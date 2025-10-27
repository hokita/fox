export interface ScrapedArticleData {
  url: string
  title: string
  body: string
  questions: string[]
}

export interface ArticleScraper {
  scrapeArticle(url: string): Promise<ScrapedArticleData>
  close(): Promise<void>
}
