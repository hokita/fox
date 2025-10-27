import { Article } from '../../domain/entities/Article'
import { ArticleRepository } from '../../domain/repositories/ArticleRepository'
import { randomUUID } from 'crypto'

interface CreateArticleInput {
  url: string
  body: string
  studied_at: string
  questions: Array<{
    question: string
    answer: string
  }>
}

const extractTitle = (body: string): string => {
  const firstLine = body.split('\n')[0]
  return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
}

export const createCreateArticleUseCase = (articleRepository: ArticleRepository) => {
  const execute = async (input: CreateArticleInput): Promise<{ id: string; message: string }> => {
    // Generate UUID for article ID
    const id = randomUUID()

    // Extract title from body
    const title = extractTitle(input.body)

    const article: Article = {
      id,
      url: input.url,
      body: input.body,
      title,
      studied_at: new Date(input.studied_at),
      created_at: new Date(),
      updated_at: new Date(),
    }

    await articleRepository.create(article, input.questions)

    return {
      id,
      message: 'Article created successfully',
    }
  }

  return { execute }
}
