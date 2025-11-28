import { ArticleRepository } from '../../domain/repositories/ArticleRepository'

export const createDeleteArticleUseCase = (articleRepository: ArticleRepository) => {
  const execute = async (id: string): Promise<{ message: string }> => {
    // Check if article exists
    const existingArticle = await articleRepository.findById(id)
    if (!existingArticle) {
      throw new Error('Article not found')
    }

    await articleRepository.delete(id)

    return { message: 'Article deleted successfully' }
  }

  return { execute }
}
