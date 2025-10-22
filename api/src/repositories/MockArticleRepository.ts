import { Article, ArticleDetail } from '../entities/Article'
import { ArticleRepository, Question } from './ArticleRepository'

export class MockArticleRepository implements ArticleRepository {
  private articles: Article[] = [
    {
      id: '1',
      title: 'The Future of Artificial Intelligence in Education',
      url: 'https://example.com/ai-education',
      body: 'Artificial intelligence is transforming the educational landscape in unprecedented ways. From personalized learning experiences to automated grading systems, AI is making education more accessible and effective for students worldwide.',
      studied_at: new Date('2025-01-15'),
      created_at: new Date('2025-01-15'),
      updated_at: new Date('2025-01-15'),
    },
    {
      id: '2',
      title: 'Understanding Climate Change Through Data Visualization',
      url: 'https://example.com/climate-data',
      body: 'Climate change is one of the most pressing issues of our time. Through data visualization, we can better understand the patterns and trends that are shaping our planet.',
      studied_at: new Date('2025-01-08'),
      created_at: new Date('2025-01-08'),
      updated_at: new Date('2025-01-08'),
    },
    {
      id: '3',
      title: 'How Technology is Transforming Modern Healthcare',
      url: 'https://example.com/tech-healthcare',
      body: 'Technology is revolutionizing healthcare delivery, from telemedicine to AI-powered diagnostics. These innovations are making healthcare more accessible and efficient.',
      studied_at: new Date('2024-12-22'),
      created_at: new Date('2024-12-22'),
      updated_at: new Date('2024-12-22'),
    },
    {
      id: '4',
      title: 'The Rise of Sustainable Energy Solutions',
      url: 'https://example.com/sustainable-energy',
      body: 'Sustainable energy solutions are becoming increasingly important as we work to reduce our carbon footprint. Solar, wind, and other renewable sources are leading the way.',
      studied_at: new Date('2024-12-15'),
      created_at: new Date('2024-12-15'),
      updated_at: new Date('2024-12-15'),
    },
  ]

  async findAll(): Promise<Article[]> {
    return this.articles
  }

  async findById(id: string): Promise<Article | null> {
    const article = this.articles.find(a => a.id === id)
    return article || null
  }

  async findByIdWithQuestions(id: string): Promise<ArticleDetail | null> {
    const article = this.articles.find(a => a.id === id)
    if (!article) {
      return null
    }

    return {
      ...article,
      questions: [],
    }
  }

  async create(article: Article, questions: Question[]): Promise<void> {
    this.articles.push(article)
    // Mock implementation - questions are not stored in memory
  }
}
