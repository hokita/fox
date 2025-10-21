import { Router } from 'express'
import { HelloWorldController } from '../controllers/HelloWorldController'
import { ArticlesController } from '../controllers/ArticlesController'
import { GetArticlesUseCase } from '../usecases/GetArticlesUseCase'
import { GetArticleUseCase } from '../usecases/GetArticleUseCase'
import { MySQLArticleRepository } from '../repositories/MySQLArticleRepository'

const router = Router()
const helloWorldController = new HelloWorldController()

// Articles
const articleRepository = new MySQLArticleRepository()
const getArticlesUseCase = new GetArticlesUseCase(articleRepository)
const getArticleUseCase = new GetArticleUseCase(articleRepository)
const articlesController = new ArticlesController(getArticlesUseCase, getArticleUseCase)

router.get('/hello', (req, res) => helloWorldController.getHelloWorld(req, res))
router.get('/articles', (req, res) => articlesController.getArticles(req, res))
router.get('/articles/:id', (req, res) => articlesController.getArticleById(req, res))

export default router
