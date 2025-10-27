import { Request, Response } from 'express'
import { Article, ArticleDetail } from '../../domain/entities/Article'
import { ScrapedArticleData } from '../../domain/services/ArticleScraper'

interface GetArticlesUseCase {
  execute: () => Promise<Article[]>
}

interface GetArticleUseCase {
  execute: (id: string) => Promise<ArticleDetail | null>
}

interface CreateArticleUseCase {
  execute: (
    url: string,
    body: string,
    studied_at: Date,
    questions: Array<{ question: string; answer: string }>,
  ) => Promise<{ id: string; message: string }>
}

interface UpdateArticleUseCase {
  execute: (
    id: string,
    url: string,
    body: string,
    studied_at: Date,
    questions: Array<{ question: string; answer: string }>,
  ) => Promise<{ message: string }>
}

interface ScrapeArticleUseCase {
  execute: (url: string) => Promise<ScrapedArticleData>
}

interface UseCases {
  getArticlesUseCase: GetArticlesUseCase
  getArticleUseCase: GetArticleUseCase
  createArticleUseCase: CreateArticleUseCase
  updateArticleUseCase: UpdateArticleUseCase
  scrapeArticleUseCase?: ScrapeArticleUseCase
}

export const createArticlesController = (useCases: UseCases) => {
  const getArticles = async (req: Request, res: Response): Promise<void> => {
    try {
      const articles = await useCases.getArticlesUseCase.execute()
      res.json({ articles })
    } catch (error) {
      console.error('Error fetching articles:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  const getArticleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const article = await useCases.getArticleUseCase.execute(id)

      if (!article) {
        res.status(404).json({ error: 'Article not found' })
        return
      }

      res.json({ article })
    } catch {
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  const createArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { url, body, studied_at, questions } = req.body

      if (!url || !body || !studied_at || !questions) {
        res.status(400).json({ error: 'Missing required fields' })
        return
      }

      // Transform DTO to domain parameters
      const studiedAtDate = new Date(studied_at)

      const result = await useCases.createArticleUseCase.execute(
        url,
        body,
        studiedAtDate,
        questions,
      )

      res.status(201).json(result)
    } catch (error) {
      console.error('Error creating article:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  const updateArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { url, body, studied_at, questions } = req.body

      if (!url || !body || !studied_at || !questions) {
        res.status(400).json({ error: 'Missing required fields' })
        return
      }

      // Transform DTO to domain parameters
      const studiedAtDate = new Date(studied_at)

      const result = await useCases.updateArticleUseCase.execute(
        id,
        url,
        body,
        studiedAtDate,
        questions,
      )

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

  const scrapeArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!useCases.scrapeArticleUseCase) {
        res.status(501).json({ error: 'Scraping feature not available' })
        return
      }

      const { url } = req.body

      if (!url) {
        res.status(400).json({ error: 'Missing required field: url' })
        return
      }

      const scrapedData = await useCases.scrapeArticleUseCase.execute(url)

      res.status(200).json(scrapedData)
    } catch (error) {
      console.error('Error scraping article:', error)
      if (error instanceof Error) {
        if (error.message.includes('Invalid DMM Eikaiwa article URL')) {
          res.status(400).json({ error: error.message })
          return
        }
        if (error.message.includes('Failed to scrape article')) {
          res.status(422).json({ error: error.message })
          return
        }
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  return {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    scrapeArticle,
  }
}
