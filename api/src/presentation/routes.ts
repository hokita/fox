import { Router } from 'express'
import { ArticlesController } from './controllers/ArticlesController'
import { GetArticlesUseCase } from '../application/usecases/GetArticlesUseCase'
import { GetArticleUseCase } from '../application/usecases/GetArticleUseCase'
import { CreateArticleUseCase } from '../application/usecases/CreateArticleUseCase'
import { UpdateArticleUseCase } from '../application/usecases/UpdateArticleUseCase'
import { ScrapeArticleUseCase } from '../application/usecases/ScrapeArticleUseCase'
import { MySQLArticleRepository } from '../infrastructure/repositories/MySQLArticleRepository'
import { DMMEikaiwaScraper } from '../infrastructure/services/DMMEikaiwaScraper'

const router = Router()

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Articles
const articleRepository = new MySQLArticleRepository()
const getArticlesUseCase = new GetArticlesUseCase(articleRepository)
const getArticleUseCase = new GetArticleUseCase(articleRepository)
const createArticleUseCase = new CreateArticleUseCase(articleRepository)
const updateArticleUseCase = new UpdateArticleUseCase(articleRepository)

// Scraper (optional, only initialized when needed)
const scraper = new DMMEikaiwaScraper()
const scrapeArticleUseCase = new ScrapeArticleUseCase(scraper)

const articlesController = new ArticlesController(
  getArticlesUseCase,
  getArticleUseCase,
  createArticleUseCase,
  updateArticleUseCase,
  scrapeArticleUseCase,
)

router.get('/articles', (req, res) => articlesController.getArticles(req, res))
router.post('/articles', (req, res) => articlesController.createArticle(req, res))
router.post('/articles/scrape', (req, res) => articlesController.scrapeArticle(req, res))
router.get('/articles/:id', (req, res) => articlesController.getArticleById(req, res))
router.put('/articles/:id', (req, res) => articlesController.updateArticle(req, res))

export default router
