import { Article } from '../entities/Article'

export interface Question {
  question: string
  answer: string
}

export interface ArticleRepository {
  findAll(): Promise<Article[]>
  findById(id: string): Promise<Article | null>
  create(article: Article, questions: Question[]): Promise<void>
}
