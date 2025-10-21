import { Article } from '../entities/Article'
import { ArticleRepository } from './ArticleRepository'
import pool from '../infrastructure/database'
import { RowDataPacket } from 'mysql2'

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

  private extractTitle(body: string): string {
    // Extract first line or first 50 characters as title
    const firstLine = body.split('\n')[0]
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
  }
}
