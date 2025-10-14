import { Article } from '../entities/Article'
import { ArticleRepository } from '../repositories/ArticleRepository'

export class GetArticlesUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(): Promise<Article[]> {
    return await this.articleRepository.findAll()
  }
}
