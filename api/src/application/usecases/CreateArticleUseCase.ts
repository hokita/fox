import { Article, Question } from '../../domain/entities/Article'
import { ArticleRepository } from '../../domain/repositories/ArticleRepository'
import { extractTitle } from '../../domain/services/TitleExtractor'
import { randomUUID } from 'crypto'

export const createCreateArticleUseCase = (articleRepository: ArticleRepository) => {
  const execute = async (
    url: string,
    body: string,
    studied_at: Date,
    questionInputs: Array<{ question: string; answer: string }>,
  ): Promise<{ id: string; message: string }> => {
    // Generate UUID for article ID
    const id = randomUUID()

    // Extract title from body
    const title = extractTitle(body)

    // Create domain entity
    const article: Article = {
      id,
      url,
      body,
      title,
      studied_at,
      created_at: new Date(),
      updated_at: new Date(),
    }

    // Convert question inputs to question entities
    const questions: Question[] = questionInputs.map((input, index) => ({
      id: randomUUID(),
      article_id: id,
      sort: index + 1,
      body: input.question,
      answer: input.answer,
      created_at: new Date(),
      updated_at: new Date(),
    }))

    await articleRepository.create(article, questions)

    return {
      id,
      message: 'Article created successfully',
    }
  }

  return { execute }
}
