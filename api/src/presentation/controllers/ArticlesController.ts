import { Request, Response } from 'express'
import { GetArticlesUseCase } from '../../application/usecases/GetArticlesUseCase'
import { GetArticleUseCase } from '../../application/usecases/GetArticleUseCase'
import { CreateArticleUseCase } from '../../application/usecases/CreateArticleUseCase'
import { UpdateArticleUseCase } from '../../application/usecases/UpdateArticleUseCase'

export class ArticlesController {
  constructor(
    private getArticlesUseCase: GetArticlesUseCase,
    private getArticleUseCase: GetArticleUseCase,
    private createArticleUseCase: CreateArticleUseCase,
    private updateArticleUseCase: UpdateArticleUseCase,
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

  async updateArticle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { url, body, studied_at, questions } = req.body

      if (!url || !body || !studied_at || !questions) {
        res.status(400).json({ error: 'Missing required fields' })
        return
      }

      const result = await this.updateArticleUseCase.execute(id, {
        url,
        body,
        studied_at,
        questions,
      })

      res.json(result)
    } catch (error) {
      if (error instanceof Error && error.message === 'Article not found') {
        res.status(404).json({ error: 'Article not found' })
        return
      }
      console.error('Error updating article:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
