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
  id: number
  question: string
  answer: string
}
