import { Router } from 'express'
import { HelloWorldController } from '../controllers/HelloWorldController'
import { ArticlesController } from '../controllers/ArticlesController'
import { GetArticlesUseCase } from '../usecases/GetArticlesUseCase'
import { MockArticleRepository } from '../repositories/MockArticleRepository'

const router = Router()
const helloWorldController = new HelloWorldController()

// Articles
const articleRepository = new MockArticleRepository()
const getArticlesUseCase = new GetArticlesUseCase(articleRepository)
const articlesController = new ArticlesController(getArticlesUseCase)

router.get('/hello', (req, res) => helloWorldController.getHelloWorld(req, res))
router.get('/articles', (req, res) => articlesController.getArticles(req, res))

export default router
