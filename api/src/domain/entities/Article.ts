export interface Article {
  id: string
  url: string
  body: string
  title: string
  memo: string
  studied_at: Date
  created_at?: Date
  updated_at?: Date
}

export interface Question {
  id: string
  article_id: string
  sort: number
  body: string
  answer: string
  created_at?: Date
  updated_at?: Date
}

export interface ArticleDetail extends Article {
  questions: Question[]
}
