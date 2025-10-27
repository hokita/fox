import { Article } from '../../domain/entities/Article'
import { ArticleRepository } from '../../domain/repositories/ArticleRepository'

export const createGetArticlesUseCase = (articleRepository: ArticleRepository) => {
  const execute = async (): Promise<Article[]> => {
    return await articleRepository.findAll()
  }

  return { execute }
}
