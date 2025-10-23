/**
 * Integration tests for Articles API endpoints
 */
import request from 'supertest'
import { Application } from 'express'
import Database from 'better-sqlite3'
import { createTestApp } from '../helpers/testApp'
import { createTestDatabase, closeTestDatabase, createTestRepository } from '../helpers/dbSetup'

describe('Articles API Integration Tests', () => {
  let app: Application
  let db: Database.Database

  beforeAll(() => {
    db = createTestDatabase()
    app = createTestApp(db)
  })

  afterAll(() => {
    closeTestDatabase(db)
  })

  beforeEach(() => {
    // Clear database before each test
    const repository = createTestRepository(db)
    repository.clearAll()
  })

  describe('POST /api/articles', () => {
    it('should create a new article with questions', async () => {
      const newArticle = {
        url: 'https://example.com/test-article',
        body: 'Test Article Body\n\nThis is a test article for integration testing.',
        studied_at: '2025-10-23',
        questions: [
          {
            question: 'What is this article about?',
            answer: 'Integration testing',
          },
          {
            question: 'Why is testing important?',
            answer: 'To ensure code quality and prevent regressions',
          },
        ],
      }

      const response = await request(app).post('/api/articles').send(newArticle)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('message', 'Article created successfully')
      expect(typeof response.body.id).toBe('string')
    })

    it('should return 400 if required fields are missing', async () => {
      const incompleteArticle = {
        url: 'https://example.com/incomplete',
        // Missing body, studied_at, questions
      }

      const response = await request(app).post('/api/articles').send(incompleteArticle)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error', 'Missing required fields')
    })
  })

  describe('GET /api/articles', () => {
    beforeEach(async () => {
      // Create test articles
      await request(app)
        .post('/api/articles')
        .send({
          url: 'https://example.com/article-1',
          body: 'First Article\n\nContent of first article',
          studied_at: '2025-10-23',
          questions: [{ question: 'Question 1?', answer: 'Answer 1' }],
        })

      await request(app)
        .post('/api/articles')
        .send({
          url: 'https://example.com/article-2',
          body: 'Second Article\n\nContent of second article',
          studied_at: '2025-10-22',
          questions: [{ question: 'Question 2?', answer: 'Answer 2' }],
        })
    })

    it('should return all articles', async () => {
      const response = await request(app).get('/api/articles')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('articles')
      expect(Array.isArray(response.body.articles)).toBe(true)
      expect(response.body.articles.length).toBe(2)

      // Check article structure
      const article = response.body.articles[0]
      expect(article).toHaveProperty('id')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('url')
      expect(article).toHaveProperty('body')
      expect(article).toHaveProperty('studied_at')
      expect(article).toHaveProperty('created_at')
      expect(article).toHaveProperty('updated_at')
    })

    it('should return articles ordered by studied_at DESC', async () => {
      const response = await request(app).get('/api/articles')

      expect(response.status).toBe(200)
      const articles = response.body.articles

      // First article should have the more recent studied_at date
      expect(articles[0].url).toBe('https://example.com/article-1')
      expect(articles[1].url).toBe('https://example.com/article-2')
    })
  })

  describe('GET /api/articles/:id', () => {
    let testArticleId: string

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/articles')
        .send({
          url: 'https://example.com/detailed-article',
          body: 'Detailed Article\n\nThis article has questions',
          studied_at: '2025-10-23',
          questions: [
            { question: 'First question?', answer: 'First answer' },
            { question: 'Second question?', answer: 'Second answer' },
          ],
        })
      testArticleId = response.body.id
    })

    it('should return article with questions', async () => {
      const response = await request(app).get(`/api/articles/${testArticleId}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('article')

      const article = response.body.article
      expect(article).toHaveProperty('id', testArticleId)
      expect(article).toHaveProperty('url', 'https://example.com/detailed-article')
      expect(article).toHaveProperty('questions')
      expect(Array.isArray(article.questions)).toBe(true)
      expect(article.questions.length).toBe(2)

      // Check question structure
      const question = article.questions[0]
      expect(question).toHaveProperty('id')
      expect(question).toHaveProperty('article_id', testArticleId)
      expect(question).toHaveProperty('sort')
      expect(question).toHaveProperty('body', 'First question?')
      expect(question).toHaveProperty('answer', 'First answer')
      expect(question).toHaveProperty('created_at')
      expect(question).toHaveProperty('updated_at')
    })

    it('should return 404 for non-existent article', async () => {
      const response = await request(app).get('/api/articles/non-existent-id')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error', 'Article not found')
    })
  })

  describe('PUT /api/articles/:id', () => {
    let testArticleId: string

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/articles')
        .send({
          url: 'https://example.com/original-article',
          body: 'Original Body\n\nOriginal content',
          studied_at: '2025-10-23',
          questions: [{ question: 'Original question?', answer: 'Original answer' }],
        })
      testArticleId = response.body.id
    })

    it('should update an existing article', async () => {
      const updatedData = {
        url: 'https://example.com/updated-article',
        body: 'Updated Body\n\nUpdated content',
        studied_at: '2025-10-24',
        questions: [
          { question: 'Updated question 1?', answer: 'Updated answer 1' },
          { question: 'Updated question 2?', answer: 'Updated answer 2' },
        ],
      }

      const response = await request(app).put(`/api/articles/${testArticleId}`).send(updatedData)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', 'Article updated successfully')

      // Verify the update
      const getResponse = await request(app).get(`/api/articles/${testArticleId}`)
      const article = getResponse.body.article

      expect(article.url).toBe(updatedData.url)
      expect(article.body).toBe(updatedData.body)
      expect(article.questions.length).toBe(2)
      expect(article.questions[0].body).toBe('Updated question 1?')
      expect(article.questions[1].body).toBe('Updated question 2?')
    })

    it('should return 404 when updating non-existent article', async () => {
      const updatedData = {
        url: 'https://example.com/updated',
        body: 'Updated content',
        studied_at: '2025-10-24',
        questions: [],
      }

      const response = await request(app).put('/api/articles/non-existent-id').send(updatedData)

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error', 'Article not found')
    })

    it('should return 400 if required fields are missing', async () => {
      const incompleteData = {
        url: 'https://example.com/incomplete',
        // Missing body, studied_at, questions
      }

      const response = await request(app).put(`/api/articles/${testArticleId}`).send(incompleteData)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error', 'Missing required fields')
    })
  })
})
