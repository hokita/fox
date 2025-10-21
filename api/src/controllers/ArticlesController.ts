import { Request, Response } from 'express'
import { GetArticlesUseCase } from '../usecases/GetArticlesUseCase'
import { GetArticleUseCase } from '../usecases/GetArticleUseCase'
import { CreateArticleUseCase } from '../usecases/CreateArticleUseCase'

export class ArticlesController {
  constructor(
    private getArticlesUseCase: GetArticlesUseCase,
    private getArticleUseCase: GetArticleUseCase,
    private createArticleUseCase: CreateArticleUseCase,
  ) {}

  async getArticles(req: Request, res: Response): Promise<void> {
    try {
      const articles = await this.getArticlesUseCase.execute()
      res.json({ articles })
    } catch (error) {
      console.error('Error fetching articles:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async getArticleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const article = await this.getArticleUseCase.execute(id)

      if (!article) {
        res.status(404).json({ error: 'Article not found' })
        return
      }

      res.json({ article })
    } catch {
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  async createArticle(req: Request, res: Response): Promise<void> {
    try {
      const { url, body, studied_at, questions } = req.body

      if (!url || !body || !studied_at || !questions) {
        res.status(400).json({ error: 'Missing required fields' })
        return
      }

      const result = await this.createArticleUseCase.execute({
        url,
        body,
        studied_at,
        questions,
      })

      res.status(201).json(result)
    } catch (error) {
      console.error('Error creating article:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
