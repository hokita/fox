/**
 * Creates Express app configured for integration testing.
 * Uses SQLite repository instead of MySQL.
 */
import express, { Application } from 'express'
import cors from 'cors'
import { Router } from 'express'
import { HelloWorldController } from '../../presentation/controllers/HelloWorldController'
import { ArticlesController } from '../../presentation/controllers/ArticlesController'
import { GetArticlesUseCase } from '../../application/usecases/GetArticlesUseCase'
import { GetArticleUseCase } from '../../application/usecases/GetArticleUseCase'
import { CreateArticleUseCase } from '../../application/usecases/CreateArticleUseCase'
import { UpdateArticleUseCase } from '../../application/usecases/UpdateArticleUseCase'
import { SQLiteArticleRepository } from '../../infrastructure/repositories/SQLiteArticleRepository'
import Database from 'better-sqlite3'

export function createTestApp(db: Database.Database): Application {
  const app: Application = express()

  app.use(cors())
  app.use(express.json())

  // Create routes with SQLite repository
  const router = Router()
  const helloWorldController = new HelloWorldController()

  // Articles with SQLite repository
  const articleRepository = new SQLiteArticleRepository(db)
  const getArticlesUseCase = new GetArticlesUseCase(articleRepository)
  const getArticleUseCase = new GetArticleUseCase(articleRepository)
  const createArticleUseCase = new CreateArticleUseCase(articleRepository)
  const updateArticleUseCase = new UpdateArticleUseCase(articleRepository)
  const articlesController = new ArticlesController(
    getArticlesUseCase,
    getArticleUseCase,
    createArticleUseCase,
    updateArticleUseCase,
  )

  router.get('/hello', (req, res) => helloWorldController.getHelloWorld(req, res))
  router.get('/articles', (req, res) => articlesController.getArticles(req, res))
  router.post('/articles', (req, res) => articlesController.createArticle(req, res))
  router.get('/articles/:id', (req, res) => articlesController.getArticleById(req, res))
  router.put('/articles/:id', (req, res) => articlesController.updateArticle(req, res))

  app.use('/api', router)

  return app
}
