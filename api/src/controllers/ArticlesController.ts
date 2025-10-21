import { Request, Response } from 'express'
import { GetArticlesUseCase } from '../usecases/GetArticlesUseCase'
import { GetArticleUseCase } from '../usecases/GetArticleUseCase'

export class ArticlesController {
  constructor(
    private getArticlesUseCase: GetArticlesUseCase,
    private getArticleUseCase: GetArticleUseCase
  ) {}

  async getArticles(req: Request, res: Response): Promise<void> {
    try {
      const articles = await this.getArticlesUseCase.execute()
      res.json({ articles })
    } catch {
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
}
