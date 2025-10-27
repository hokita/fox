import { ArticleDetail } from '../../domain/entities/Article'
import { ArticleRepository } from '../../domain/repositories/ArticleRepository'

export const createGetArticleUseCase = (articleRepository: ArticleRepository) => {
  const execute = async (id: string): Promise<ArticleDetail | null> => {
    return await articleRepository.findByIdWithQuestions(id)
  }

  return { execute }
}
