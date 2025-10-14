import { Request, Response } from 'express'
import { GetArticlesUseCase } from '../usecases/GetArticlesUseCase'

export class ArticlesController {
  constructor(private getArticlesUseCase: GetArticlesUseCase) {}

  async getArticles(req: Request, res: Response): Promise<void> {
    try {
      const articles = await this.getArticlesUseCase.execute()
      res.json({ articles })
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
