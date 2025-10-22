import { Article } from '../entities/Article'
import { ArticleRepository, Question } from '../repositories/ArticleRepository'

export interface UpdateArticleInput {
  url: string
  body: string
  studied_at: string
  questions: Question[]
}

export class UpdateArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string, input: UpdateArticleInput): Promise<{ message: string }> {
    // Check if article exists
    const existingArticle = await this.articleRepository.findById(id)
    if (!existingArticle) {
      throw new Error('Article not found')
    }

    const title = this.extractTitle(input.body)

    const article: Article = {
      id,
      url: input.url,
      body: input.body,
      title,
      studied_at: new Date(input.studied_at),
      created_at: existingArticle.created_at,
      updated_at: new Date(),
    }

    await this.articleRepository.update(id, article, input.questions)

    return { message: 'Article updated successfully' }
  }

  private extractTitle(body: string): string {
    // Extract first line or first 50 characters as title
    const firstLine = body.split('\n')[0]
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
  }
}
