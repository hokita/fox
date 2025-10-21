import { Article } from '../entities/Article'
import { ArticleRepository } from '../repositories/ArticleRepository'

export class GetArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string): Promise<Article | null> {
    return await this.articleRepository.findById(id)
  }
}
