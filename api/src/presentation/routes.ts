import { Router } from 'express'
import { createArticlesController } from './controllers/ArticlesController'
import { createGetArticlesUseCase } from '../application/usecases/GetArticlesUseCase'
import { createGetArticleUseCase } from '../application/usecases/GetArticleUseCase'
import { createCreateArticleUseCase } from '../application/usecases/CreateArticleUseCase'
import { createUpdateArticleUseCase } from '../application/usecases/UpdateArticleUseCase'
import { createScrapeArticleUseCase } from '../application/usecases/ScrapeArticleUseCase'
import { createMySQLArticleRepository } from '../infrastructure/repositories/MySQLArticleRepository'
import { createDMMEikaiwaScraper } from '../infrastructure/services/DMMEikaiwaScraper'

const router = Router()

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Articles
const articleRepository = createMySQLArticleRepository()
const getArticlesUseCase = createGetArticlesUseCase(articleRepository)
const getArticleUseCase = createGetArticleUseCase(articleRepository)
const createArticleUseCase = createCreateArticleUseCase(articleRepository)
const updateArticleUseCase = createUpdateArticleUseCase(articleRepository)

// Scraper (optional, only initialized when needed)
const scraper = createDMMEikaiwaScraper()
const scrapeArticleUseCase = createScrapeArticleUseCase(scraper)

const articlesController = createArticlesController({
  getArticlesUseCase,
  getArticleUseCase,
  createArticleUseCase,
  updateArticleUseCase,
  scrapeArticleUseCase,
})

router.get('/articles', (req, res) => articlesController.getArticles(req, res))
router.post('/articles', (req, res) => articlesController.createArticle(req, res))
router.post('/articles/scrape', (req, res) => articlesController.scrapeArticle(req, res))
router.get('/articles/:id', (req, res) => articlesController.getArticleById(req, res))
router.put('/articles/:id', (req, res) => articlesController.updateArticle(req, res))

export default router
