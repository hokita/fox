/**
 * Integration tests for Hello World endpoint
 */
import request from 'supertest'
import { Application } from 'express'
import Database from 'better-sqlite3'
import { createTestApp } from '../helpers/testApp'
import { createTestDatabase, closeTestDatabase } from '../helpers/dbSetup'

describe('GET /api/hello', () => {
  let app: Application
  let db: Database.Database

  beforeAll(() => {
    db = createTestDatabase()
    app = createTestApp(db)
  })

  afterAll(() => {
    closeTestDatabase(db)
  })

  it('should return hello world message', async () => {
    const response = await request(app).get('/api/hello')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      content: 'Hello World',
    })
  })
})
