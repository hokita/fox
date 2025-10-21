import { Article, ArticleDetail } from '@/models/article'
import { ArticlesResponse, ArticleResponse } from '@/models/response'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// API Functions
export async function getArticles(): Promise<Article[]> {
  const response = await fetch(`${API_BASE_URL}/api/articles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.status}`)
  }

  const data: ArticlesResponse = await response.json()
  return data.articles
}

export async function getArticleById(id: string): Promise<ArticleDetail> {
  const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.status}`)
  }

  const data: ArticleResponse = await response.json()

  return {
    ...data.article,
    questions: [], // Questions not implemented yet
  }
}

export interface CreateArticleInput {
  url: string
  body: string
  studied_at: string
  questions: Array<{
    question: string
    answer: string
  }>
}

export interface CreateArticleResponse {
  id: string
  message: string
}

export async function createArticle(input: CreateArticleInput): Promise<CreateArticleResponse> {
  const response = await fetch(`${API_BASE_URL}/api/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Failed to create article: ${response.status}`)
  }

  return await response.json()
}
