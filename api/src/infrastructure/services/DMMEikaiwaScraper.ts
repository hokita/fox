import puppeteer, { Browser, Page } from 'puppeteer'

export interface ScrapedArticleData {
  url: string
  title: string
  body: string
  questions: string[]
}

export class DMMEikaiwaScraper {
  private browser: Browser | null = null

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  async scrapeArticle(url: string): Promise<ScrapedArticleData> {
    await this.initialize()

    if (!this.browser) {
      throw new Error('Browser not initialized')
    }

    const page: Page = await this.browser.newPage()

    try {
      // Set a realistic user agent
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      )

      // Navigate to the article
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      })

      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Extract the main article title
      const title = await page.evaluate((): string => {
        const titleElement = document.querySelector('[class*="css-13zjvhz"] [lang="en"] span')
        return titleElement?.textContent?.trim() || ''
      })

      // Extract the article body from Exercise 2
      const body = await page.evaluate((): string => {
        const exercise2 = document.querySelector('#windowexercise-2')
        if (!exercise2) return ''

        const paragraphs: string[] = []
        const textElements = exercise2.querySelectorAll('[lang="en"]')

        for (const el of Array.from(textElements)) {
          const text = (el as HTMLElement).textContent?.trim()
          // Filter out instructions and short text, keep only article paragraphs
          if (
            text &&
            text.length > 30 &&
            !text.includes('Exercise') &&
            !text.includes('Read the article') &&
            !text.includes('Repeat each paragraph')
          ) {
            paragraphs.push(text)
          }
        }

        return paragraphs.join('\n\n')
      })

      // Extract the 5 discussion questions from Exercise 3
      const questions = await page.evaluate((): string[] => {
        const exercise3 = document.querySelector('#windowexercise-3')
        if (!exercise3) return []

        const text = exercise3.textContent || ''

        // Extract English questions using regex pattern
        // Matches: number + period + question starting with common question words + ending with ?
        const questionPattern =
          /(\d+)\.(What|Have|Do|Are|How|Why|When|Where|Who|Would|Could|Should|Can|Will|Is|Does)[^?]+\?/g
        const englishQuestions: string[] = []
        let match

        while ((match = questionPattern.exec(text)) !== null) {
          // Remove the number prefix and trim
          const question = match[0].replace(/^\d+\./, '').trim()
          if (question.length > 10) {
            englishQuestions.push(question)
          }
        }

        return englishQuestions.slice(0, 5)
      })

      if (!title) {
        throw new Error('Could not extract article title')
      }

      if (!body || body.length < 100) {
        throw new Error('Could not extract article body or body too short')
      }

      if (questions.length === 0) {
        throw new Error('Could not extract discussion questions')
      }

      return {
        url,
        title,
        body,
        questions,
      }
    } finally {
      await page.close()
    }
  }

  // Method to scrape and get the raw HTML for debugging
  async getPageHTML(url: string): Promise<string> {
    await this.initialize()

    if (!this.browser) {
      throw new Error('Browser not initialized')
    }

    const page: Page = await this.browser.newPage()

    try {
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      )

      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      })

      await page.waitForSelector('article', { timeout: 10000 })

      return await page.content()
    } finally {
      await page.close()
    }
  }
}
