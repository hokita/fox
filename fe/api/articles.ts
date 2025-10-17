import { Article } from '@/models/article'
import { ArticlesResponse } from '@/models/response'

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
