export interface Article {
  id: string
  date: string
  title: string
}

export interface ArticleDetail extends Article {
  url: string
  body: string
  questions: Question[]
}

export interface Question {
  id: number
  question: string
  answer: string
}
