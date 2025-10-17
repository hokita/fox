'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getArticles } from '@/api/articles'
import { formatDisplayDate } from '@/lib/date'
import { type Article } from '@/models/article'

export default function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getArticles()
        setArticles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-16 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-5xl font-light tracking-tight text-foreground lg:text-6xl">
              English Learning
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Read articles and practice comprehension
            </p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link href="/articles/new">
              <Plus className="h-5 w-5" />
              New Article
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-lg text-muted-foreground">Loading articles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
            <p className="text-destructive">Error: {error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              Retry
            </Button>
          </div>
        )}

        {/* Article List */}
        {!loading && !error && (
          <div className="space-y-1">
            {articles.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-lg text-muted-foreground">
                  No articles yet. Create your first article!
                </p>
              </div>
            ) : (
              <>
                {articles.map(article => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.id}`}
                    className="group block border-t border-border py-8 transition-colors hover:bg-accent/30"
                  >
                    <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                      {/* Date */}
                      <div className="lg:col-span-2">
                        <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
                          {formatDisplayDate(article.date)}
                        </p>
                      </div>

                      {/* Title */}
                      <div className="lg:col-span-9">
                        <h2 className="font-serif text-2xl font-light tracking-tight text-foreground transition-colors group-hover:text-primary lg:text-3xl">
                          {article.title}
                        </h2>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-end lg:col-span-1">
                        <ArrowRight className="h-6 w-6 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                    </div>
                  </Link>
                ))}
                {/* Bottom border */}
                <div className="border-t border-border" />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
