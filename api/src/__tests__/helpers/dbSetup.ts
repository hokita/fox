/**
 * Database setup utilities for integration tests.
 * Creates and manages in-memory SQLite database instances.
 */
import Database from 'better-sqlite3'
import { createSQLiteArticleRepository } from './SQLiteArticleRepository'
import { ArticleRepository } from '../../domain/repositories/ArticleRepository'

export function createTestDatabase(): Database.Database {
  // Create in-memory SQLite database
  const db = new Database(':memory:')
  return db
}

export function createTestRepository(
  db: Database.Database,
): ArticleRepository & { clearAll: () => void } {
  return createSQLiteArticleRepository(db)
}

export function closeTestDatabase(db: Database.Database): void {
  db.close()
}
