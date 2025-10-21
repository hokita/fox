import { Article } from '../entities/Article'
import { ArticleRepository, Question } from './ArticleRepository'
import pool from '../infrastructure/database'
import { RowDataPacket } from 'mysql2'
import { randomUUID } from 'crypto'

interface ArticleRow extends RowDataPacket {
  id: string
  url: string
  body: string
  studied_at: string
  created_at: string
  updated_at: string
}

export class MySQLArticleRepository implements ArticleRepository {
  async findAll(): Promise<Article[]> {
    const [rows] = await pool.query<ArticleRow[]>('SELECT * FROM articles ORDER BY studied_at DESC')

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
    const [rows] = await pool.query<ArticleRow[]>('SELECT * FROM articles WHERE id = ?', [id])

    if (rows.length === 0) {
      return null
    }

    const row = rows[0]
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

  async create(article: Article, questions: Question[]): Promise<void> {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // Insert article
      await connection.query(
        'INSERT INTO articles (id, url, body, studied_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [
          article.id,
          article.url,
          article.body,
          article.studied_at,
          article.created_at,
          article.updated_at,
        ],
      )

      // Insert questions
      for (let i = 0; i < questions.length; i++) {
        const questionId = randomUUID()

        await connection.query(
          'INSERT INTO questions (id, article_id, sort, body, answer, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            questionId,
            article.id,
            i + 1,
            questions[i].question,
            questions[i].answer,
            new Date(),
            new Date(),
          ],
        )
      }

      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }

  private extractTitle(body: string): string {
    // Extract first line or first 50 characters as title
    const firstLine = body.split('\n')[0]
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
  }
}
