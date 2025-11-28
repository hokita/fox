import { Article, ArticleDetail, Question } from '../entities/Article'

export interface ArticleRepository {
  findAll(): Promise<Article[]>
  findById(id: string): Promise<Article | null>
  findByIdWithQuestions(id: string): Promise<ArticleDetail | null>
  create(article: Article, questions: Question[]): Promise<void>
  update(id: string, article: Article, questions: Question[]): Promise<void>
  delete(id: string): Promise<void>
}
