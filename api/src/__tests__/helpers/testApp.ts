/**
 * Creates Express app configured for integration testing.
 * Uses SQLite repository instead of MySQL.
 */
import express, { Application } from 'express'
import cors from 'cors'
import { Router } from 'express'
import { createArticlesController } from '../../presentation/controllers/ArticlesController'
import { createGetArticlesUseCase } from '../../application/usecases/GetArticlesUseCase'
import { createGetArticleUseCase } from '../../application/usecases/GetArticleUseCase'
import { createCreateArticleUseCase } from '../../application/usecases/CreateArticleUseCase'
import { createUpdateArticleUseCase } from '../../application/usecases/UpdateArticleUseCase'
import { createDeleteArticleUseCase } from '../../application/usecases/DeleteArticleUseCase'
import { createSQLiteArticleRepository } from './SQLiteArticleRepository'
import Database from 'better-sqlite3'

export function createTestApp(db: Database.Database): Application {
  const app: Application = express()

  app.use(cors())
  app.use(express.json())

  // Create routes with SQLite repository
  const router = Router()

  // Articles with SQLite repository
  const articleRepository = createSQLiteArticleRepository(db)
  const getArticlesUseCase = createGetArticlesUseCase(articleRepository)
  const getArticleUseCase = createGetArticleUseCase(articleRepository)
  const createArticleUseCase = createCreateArticleUseCase(articleRepository)
  const updateArticleUseCase = createUpdateArticleUseCase(articleRepository)
  const deleteArticleUseCase = createDeleteArticleUseCase(articleRepository)
  const articlesController = createArticlesController({
    getArticlesUseCase,
    getArticleUseCase,
    createArticleUseCase,
    updateArticleUseCase,
    deleteArticleUseCase,
  })

  router.get('/articles', (req, res) => articlesController.getArticles(req, res))
  router.post('/articles', (req, res) => articlesController.createArticle(req, res))
  router.get('/articles/:id', (req, res) => articlesController.getArticleById(req, res))
  router.put('/articles/:id', (req, res) => articlesController.updateArticle(req, res))
  router.delete('/articles/:id', (req, res) => articlesController.deleteArticle(req, res))

  app.use('/api', router)

  return app
}
