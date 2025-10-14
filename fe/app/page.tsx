'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Article {
  id: string
  date: string
  title: string
}

export default function ArticleListPage() {
  const [articles] = useState<Article[]>([
    {
      id: '1',
      date: 'JAN 15 2025',
      title: 'The Future of Artificial Intelligence in Education',
    },
    {
      id: '2',
      date: 'JAN 08 2025',
      title: 'Understanding Climate Change Through Data Visualization',
    },
    {
      id: '3',
      date: 'DEC 22 2024',
      title: 'How Technology is Transforming Modern Healthcare',
    },
    {
      id: '4',
      date: 'DEC 15 2024',
      title: 'The Rise of Sustainable Energy Solutions',
    },
  ])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-16 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-5xl font-light tracking-tight text-foreground lg:text-6xl">
              English Learning
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">Read articles and practice comprehension</p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link href="/articles/new">
              <Plus className="h-5 w-5" />
              New Article
            </Link>
          </Button>
        </div>

        {/* Article List */}
        <div className="space-y-1">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="group block border-t border-border py-8 transition-colors hover:bg-accent/30"
            >
              <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                {/* Date */}
                <div className="lg:col-span-2">
                  <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground">{article.date}</p>
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
        </div>
      </div>
    </div>
  )
}
