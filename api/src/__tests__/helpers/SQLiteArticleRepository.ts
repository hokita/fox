/**
 * SQLite implementation of ArticleRepository for integration testing.
 * Uses in-memory SQLite database to avoid dependency on MySQL during tests.
 */
import Database from 'better-sqlite3'
import { Article, ArticleDetail, Question } from '../../domain/entities/Article'
import { ArticleRepository } from '../../domain/repositories/ArticleRepository'

interface ArticleRow {
  id: string
  url: string
  title: string
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

const initializeSchema = (db: Database.Database): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      title TEXT NOT NULL,
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

export const createSQLiteArticleRepository = (
  db: Database.Database,
): ArticleRepository & { clearAll: () => void } => {
  initializeSchema(db)

  const findAll = async (): Promise<Article[]> => {
    const rows = db.prepare('SELECT * FROM articles ORDER BY studied_at DESC').all() as ArticleRow[]

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      url: row.url,
      body: row.body,
      studied_at: new Date(row.studied_at),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }))
  }

  const findById = async (id: string): Promise<Article | null> => {
    const row = db.prepare('SELECT * FROM articles WHERE id = ?').get(id) as ArticleRow | undefined

    if (!row) {
      return null
    }

    return {
      id: row.id,
      title: row.title,
      url: row.url,
      body: row.body,
      studied_at: new Date(row.studied_at),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }
  }

  const findByIdWithQuestions = async (id: string): Promise<ArticleDetail | null> => {
    const article = await findById(id)

    if (!article) {
      return null
    }

    const questionRows = db
      .prepare('SELECT * FROM questions WHERE article_id = ? ORDER BY sort ASC')
      .all(id) as QuestionRow[]

    const questions: Question[] = questionRows.map(row => ({
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

  const create = async (article: Article, questions: Question[]): Promise<void> => {
    const insertArticle = db.prepare(
      'INSERT INTO articles (id, url, title, body, studied_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )

    const insertQuestion = db.prepare(
      'INSERT INTO questions (id, article_id, sort, body, answer, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )

    const transaction = db.transaction(() => {
      insertArticle.run(
        article.id,
        article.url,
        article.title,
        article.body,
        article.studied_at.toISOString(),
        article.created_at.toISOString(),
        article.updated_at.toISOString(),
      )

      questions.forEach(q => {
        insertQuestion.run(
          q.id,
          q.article_id,
          q.sort,
          q.body,
          q.answer,
          q.created_at.toISOString(),
          q.updated_at.toISOString(),
        )
      })
    })

    transaction()
  }

  const update = async (id: string, article: Article, questions: Question[]): Promise<void> => {
    const updateArticle = db.prepare(
      'UPDATE articles SET url = ?, title = ?, body = ?, studied_at = ?, updated_at = ? WHERE id = ?',
    )

    const deleteQuestions = db.prepare('DELETE FROM questions WHERE article_id = ?')

    const insertQuestion = db.prepare(
      'INSERT INTO questions (id, article_id, sort, body, answer, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )

    const transaction = db.transaction(() => {
      updateArticle.run(
        article.url,
        article.title,
        article.body,
        article.studied_at.toISOString(),
        new Date().toISOString(),
        id,
      )

      deleteQuestions.run(id)

      questions.forEach(q => {
        insertQuestion.run(
          q.id,
          q.article_id,
          q.sort,
          q.body,
          q.answer,
          q.created_at.toISOString(),
          q.updated_at.toISOString(),
        )
      })
    })

    transaction()
  }

  // Test utility method to clear all data
  const clearAll = (): void => {
    db.exec('DELETE FROM questions')
    db.exec('DELETE FROM articles')
  }

  return {
    findAll,
    findById,
    findByIdWithQuestions,
    create,
    update,
    clearAll,
  }
}
