import { ArticleDetail } from '../entities/Article'
import { ArticleRepository } from '../repositories/ArticleRepository'

export class GetArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string): Promise<ArticleDetail | null> {
    return await this.articleRepository.findByIdWithQuestions(id)
  }
}
