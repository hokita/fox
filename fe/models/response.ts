import { Article, ArticleDetail } from './article'

export interface ArticlesResponse {
  articles: Article[]
}

export interface ArticleResponse {
  article: ArticleDetail
}
