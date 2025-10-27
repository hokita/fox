import { ArticleScraper, ScrapedArticleData } from '../../domain/services/ArticleScraper'

export class ScrapeArticleUseCase {
  constructor(private scraper: ArticleScraper) {}

  async execute(url: string): Promise<ScrapedArticleData> {
    // Validate URL
    if (!url.includes('eikaiwa.dmm.com/app/daily-news/article/')) {
      throw new Error('Invalid DMM Eikaiwa article URL')
    }

    // Scrape the article
    const scrapedData: ScrapedArticleData = await this.scraper.scrapeArticle(url)

    // Validate scraped data
    if (!scrapedData.title || !scrapedData.body) {
      throw new Error('Failed to scrape article: missing title or body')
    }

    if (scrapedData.questions.length === 0) {
      throw new Error('Failed to scrape article: no discussion questions found')
    }

    return scrapedData
  }

  async cleanup(): Promise<void> {
    await this.scraper.close()
  }
}
