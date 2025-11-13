import axios from 'axios'
import * as cheerio from 'cheerio'
import { ArticleScraper, ScrapedArticleData } from '../../domain/services/ArticleScraper'

export const createDMMEikaiwaScraper = (): ArticleScraper => {
  const scrapeArticle = async (url: string): Promise<ScrapedArticleData> => {
    // Fetch the HTML content using axios
    // Note: Using curl-like User-Agent because DMM Eikaiwa returns different HTML for browsers
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'curl/8.7.1',
        Accept: '*/*',
      },
    })

    const $ = cheerio.load(response.data)

    // Extract the main article title
    // The title appears in multiple [lang="en"] span elements
    let title = ''
    $('[lang="en"] span').each((_, element) => {
      const text = $(element).text().trim()
      // Look for title-like text (longer than 20 chars, not instructions)
      if (
        text.length > 20 &&
        !text.includes('Exercise') &&
        !text.includes('Vocabulary') &&
        !text.includes('Repeat') &&
        !text.includes('Read the article')
      ) {
        if (!title) {
          title = text
        }
      }
    })

    if (!title) {
      throw new Error('Could not extract article title')
    }

    // Extract the article body from Exercise 2
    const paragraphs: string[] = []
    const exercise2 = $('#windowexercise-2')

    if (exercise2.length > 0) {
      exercise2.find('p').each((_, element) => {
        const text = $(element).text().trim()
        // Filter out instructions, short text, and Japanese text
        if (
          text &&
          text.length > 30 &&
          !text.includes('Exercise') &&
          !text.includes('Read the article') &&
          !text.includes('Repeat each paragraph') &&
          // Exclude paragraphs with Japanese characters (Hiragana, Katakana, Kanji)
          !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)
        ) {
          // Clean up whitespace within the paragraph
          const cleanedText = text.replace(/\s+/g, ' ').trim()
          paragraphs.push(cleanedText)
        }
      })
    }

    const body = paragraphs.join('\n\n')

    if (!body || body.length < 100) {
      throw new Error('Could not extract article body or body too short')
    }

    // Extract the 5 discussion questions from Exercise 3
    const questions: string[] = []
    const exercise3 = $('#windowexercise-3')

    if (exercise3.length > 0) {
      const text = exercise3.text()

      // Extract all numbered questions (all sentences in Discussion section are questions)
      // Matches: number + period + optional whitespace + any text ending with ?
      const questionPattern = /\d+\.\s*([^?]+\?)/g
      let match

      while ((match = questionPattern.exec(text)) !== null) {
        const question = match[1].trim()
        // Filter out instructions and keep only actual questions
        if (question.length > 15 && !question.includes('based on the following')) {
          questions.push(question)
        }
      }
    }

    if (questions.length === 0) {
      throw new Error('Could not extract discussion questions')
    }

    return {
      url,
      title,
      body,
      questions: questions.slice(0, 5),
    }
  }

  const close = async (): Promise<void> => {
    // No cleanup needed for HTTP-based scraper
  }

  const getPageHTML = async (url: string): Promise<string> => {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'curl/8.7.1',
        Accept: '*/*',
      },
    })
    return response.data
  }

  return {
    scrapeArticle,
    close,
    getPageHTML,
  }
}
