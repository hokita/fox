/**
 * Database setup utilities for integration tests.
 * Creates and manages in-memory SQLite database instances.
 */
import Database from 'better-sqlite3'
import { SQLiteArticleRepository } from './SQLiteArticleRepository'

export function createTestDatabase(): Database.Database {
  // Create in-memory SQLite database
  const db = new Database(':memory:')
  return db
}

export function createTestRepository(db: Database.Database): SQLiteArticleRepository {
  return new SQLiteArticleRepository(db)
}

export function closeTestDatabase(db: Database.Database): void {
  db.close()
}
