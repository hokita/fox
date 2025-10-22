import { Article, ArticleDetail } from '../entities/Article'

export interface Question {
  question: string
  answer: string
}

export interface ArticleRepository {
  findAll(): Promise<Article[]>
  findById(id: string): Promise<Article | null>
  findByIdWithQuestions(id: string): Promise<ArticleDetail | null>
  create(article: Article, questions: Question[]): Promise<void>
}
