import { Article, Question } from '../../domain/entities/Article'
import { ArticleRepository } from '../../domain/repositories/ArticleRepository'
import { randomUUID } from 'crypto'

export const createUpdateArticleUseCase = (articleRepository: ArticleRepository) => {
  const execute = async (
    id: string,
    url: string,
    title: string,
    body: string,
    studied_at: Date,
    questionInputs: Array<{ question: string; answer: string }>,
  ): Promise<{ message: string }> => {
    // Check if article exists
    const existingArticle = await articleRepository.findById(id)
    if (!existingArticle) {
      throw new Error('Article not found')
    }

    // Create updated domain entity
    const article: Article = {
      id,
      url,
      body,
      title,
      studied_at,
      created_at: existingArticle.created_at,
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

    await articleRepository.update(id, article, questions)

    return { message: 'Article updated successfully' }
  }

  return { execute }
}
