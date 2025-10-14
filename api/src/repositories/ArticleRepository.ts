import { Article } from '../entities/Article'

export interface ArticleRepository {
  findAll(): Promise<Article[]>
  findById(id: string): Promise<Article | null>
}
