import { Article } from '../../domain/entities/Article'
import { ArticleRepository, Question } from '../../domain/repositories/ArticleRepository'

export interface UpdateArticleInput {
  url: string
  body: string
  studied_at: string
  questions: Question[]
}

const extractTitle = (body: string): string => {
  // Extract first line or first 50 characters as title
  const firstLine = body.split('\n')[0]
  return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
}

export const createUpdateArticleUseCase = (articleRepository: ArticleRepository) => {
  const execute = async (id: string, input: UpdateArticleInput): Promise<{ message: string }> => {
    // Check if article exists
    const existingArticle = await articleRepository.findById(id)
    if (!existingArticle) {
      throw new Error('Article not found')
    }

    const title = extractTitle(input.body)

    const article: Article = {
      id,
      url: input.url,
      body: input.body,
      title,
      studied_at: new Date(input.studied_at),
      created_at: existingArticle.created_at,
      updated_at: new Date(),
    }

    await articleRepository.update(id, article, input.questions)

    return { message: 'Article updated successfully' }
  }

  return { execute }
}
