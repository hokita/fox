import { ArticleDetail } from '../../domain/entities/Article'
import { ArticleRepository } from '../../domain/repositories/ArticleRepository'

export class GetArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string): Promise<ArticleDetail | null> {
    return await this.articleRepository.findByIdWithQuestions(id)
  }
}
