export interface Article {
  id: string
  title: string
  url: string
  body: string
  studied_at: string
  created_at: string
  updated_at: string
}

export interface ArticleDetail extends Article {
  questions: Question[]
}

export interface Question {
  id: string
  article_id: string
  sort: number
  body: string
  answer: string
  created_at: string
  updated_at: string
}
