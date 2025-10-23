/**
 * SQLite implementation of ArticleRepository for integration testing.
 * Uses in-memory SQLite database to avoid dependency on MySQL during tests.
 */
import Database from 'better-sqlite3'
import { Article, ArticleDetail, QuestionEntity } from '../../domain/entities/Article'
import { ArticleRepository, Question } from '../../domain/repositories/ArticleRepository'
import { randomUUID } from 'crypto'

interface ArticleRow {
  id: string
  url: string
  body: string
  studied_at: string
  created_at: string
  updated_at: string
}

interface QuestionRow {
  id: string
  article_id: string
  sort: number
  body: string
  answer: string
  created_at: string
  updated_at: string
}

export class SQLiteArticleRepository implements ArticleRepository {
  private db: Database.Database

  constructor(db: Database.Database) {
    this.db = db
    this.initializeSchema()
  }

  private initializeSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        body TEXT NOT NULL,
        studied_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        article_id TEXT NOT NULL,
        sort INTEGER NOT NULL,
        body TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
      );
    `)
  }

  async findAll(): Promise<Article[]> {
    const rows = this.db
      .prepare('SELECT * FROM articles ORDER BY studied_at DESC')
      .all() as ArticleRow[]

    return rows.map(row => ({
      id: row.id,
      title: this.extractTitle(row.body),
      url: row.url,
      body: row.body,
      studied_at: new Date(row.studied_at),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }))
  }

  async findById(id: string): Promise<Article | null> {
    const row = this.db.prepare('SELECT * FROM articles WHERE id = ?').get(id) as
      | ArticleRow
      | undefined

    if (!row) {
      return null
    }

    return {
      id: row.id,
      title: this.extractTitle(row.body),
      url: row.url,
      body: row.body,
      studied_at: new Date(row.studied_at),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }
  }

  async findByIdWithQuestions(id: string): Promise<ArticleDetail | null> {
    const article = await this.findById(id)

    if (!article) {
      return null
    }

    const questionRows = this.db
      .prepare('SELECT * FROM questions WHERE article_id = ? ORDER BY sort ASC')
      .all(id) as QuestionRow[]

    const questions: QuestionEntity[] = questionRows.map(row => ({
      id: row.id,
      article_id: row.article_id,
      sort: row.sort,
      body: row.body,
      answer: row.answer,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }))

    return {
      ...article,
      questions,
    }
  }

  async create(article: Article, questions: Question[]): Promise<void> {
    const insertArticle = this.db.prepare(
      'INSERT INTO articles (id, url, body, studied_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    )

    const insertQuestion = this.db.prepare(
      'INSERT INTO questions (id, article_id, sort, body, answer, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )

    const transaction = this.db.transaction(() => {
      insertArticle.run(
        article.id,
        article.url,
        article.body,
        article.studied_at.toISOString(),
        article.created_at.toISOString(),
        article.updated_at.toISOString(),
      )

      questions.forEach((q, i) => {
        const questionId = randomUUID()
        insertQuestion.run(
          questionId,
          article.id,
          i + 1,
          q.question,
          q.answer,
          new Date().toISOString(),
          new Date().toISOString(),
        )
      })
    })

    transaction()
  }

  async update(id: string, article: Article, questions: Question[]): Promise<void> {
    const updateArticle = this.db.prepare(
      'UPDATE articles SET url = ?, body = ?, studied_at = ?, updated_at = ? WHERE id = ?',
    )

    const deleteQuestions = this.db.prepare('DELETE FROM questions WHERE article_id = ?')

    const insertQuestion = this.db.prepare(
      'INSERT INTO questions (id, article_id, sort, body, answer, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )

    const transaction = this.db.transaction(() => {
      updateArticle.run(
        article.url,
        article.body,
        article.studied_at.toISOString(),
        new Date().toISOString(),
        id,
      )

      deleteQuestions.run(id)

      questions.forEach((q, i) => {
        const questionId = randomUUID()
        insertQuestion.run(
          questionId,
          id,
          i + 1,
          q.question,
          q.answer,
          new Date().toISOString(),
          new Date().toISOString(),
        )
      })
    })

    transaction()
  }

  private extractTitle(body: string): string {
    const firstLine = body.split('\n')[0]
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
  }

  // Test utility method to clear all data
  clearAll(): void {
    this.db.exec('DELETE FROM questions')
    this.db.exec('DELETE FROM articles')
  }
}
