import { Article, ArticleDetail, Question } from '../../domain/entities/Article'
import { ArticleRepository } from '../../domain/repositories/ArticleRepository'
import pool from '../database/config'
import { RowDataPacket } from 'mysql2'

interface ArticleRow extends RowDataPacket {
  id: string
  url: string
  title: string
  body: string
  memo: string
  studied_at: string
  created_at: string
  updated_at: string
}

interface QuestionRow extends RowDataPacket {
  id: string
  article_id: string
  sort: number
  body: string
  answer: string
  created_at: string
  updated_at: string
}

export const createMySQLArticleRepository = (): ArticleRepository => {
  const findAll = async (): Promise<Article[]> => {
    const [rows] = await pool.query<ArticleRow[]>('SELECT * FROM articles ORDER BY studied_at DESC')

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      url: row.url,
      body: row.body,
      memo: row.memo,
      studied_at: new Date(row.studied_at),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    }))
  }

  const findById = async (id: string): Promise<Article | null> => {
    const [rows] = await pool.query<ArticleRow[]>('SELECT * FROM articles WHERE id = ?', [id])

    if (rows.length === 0) {
      return null
    }

    const row = rows[0]
    return {
      id: row.id,
      title: row.title,
      url: row.url,
      body: row.body,
      memo: row.memo,
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

    const [questionRows] = await pool.query<QuestionRow[]>(
      'SELECT * FROM questions WHERE article_id = ? ORDER BY sort ASC',
      [id],
    )

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
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // Insert article
      await connection.query(
        'INSERT INTO articles (id, url, title, body, memo, studied_at) VALUES (?, ?, ?, ?, ?, ?)',
        [article.id, article.url, article.title, article.body, article.memo, article.studied_at],
      )

      // Insert questions
      for (const question of questions) {
        await connection.query(
          'INSERT INTO questions (id, article_id, sort, body, answer) VALUES (?, ?, ?, ?, ?)',
          [question.id, question.article_id, question.sort, question.body, question.answer],
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

  const update = async (id: string, article: Article, questions: Question[]): Promise<void> => {
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // Update article
      await connection.query(
        'UPDATE articles SET url = ?, title = ?, body = ?, memo = ?, studied_at = ? WHERE id = ?',
        [article.url, article.title, article.body, article.memo, article.studied_at, id],
      )

      // Delete existing questions
      await connection.query('DELETE FROM questions WHERE article_id = ?', [id])

      // Insert new questions
      for (const question of questions) {
        await connection.query(
          'INSERT INTO questions (id, article_id, sort, body, answer) VALUES (?, ?, ?, ?, ?)',
          [question.id, question.article_id, question.sort, question.body, question.answer],
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

  return {
    findAll,
    findById,
    findByIdWithQuestions,
    create,
    update,
  }
}
