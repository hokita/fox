'use client'

import { use, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar, Link2, BookOpen, HelpCircle, Edit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  // Mock data - in real app, fetch based on params.id
  const [article] = useState({
    date: '2025-01-15',
    title: 'The Future of Artificial Intelligence in Education',
    url: 'https://example.com/ai-education',
    body: 'Artificial intelligence is transforming the educational landscape in unprecedented ways. From personalized learning experiences to automated grading systems, AI is making education more accessible and effective for students worldwide.\n\nThe integration of AI tools in classrooms enables teachers to focus more on individual student needs while AI handles routine administrative tasks. This shift allows for more meaningful interactions between educators and learners.',
    questions: [
      {
        id: 1,
        question: 'What are the main benefits of AI in education mentioned in the article?',
        answer: 'Personalized learning experiences and automated grading systems',
      },
      {
        id: 2,
        question: 'How does AI help teachers according to the text?',
        answer:
          'AI handles routine administrative tasks, allowing teachers to focus more on individual student needs',
      },
      {
        id: 3,
        question: 'What is the overall impact of AI on education accessibility?',
        answer: 'AI makes education more accessible and effective for students worldwide',
      },
      {
        id: 4,
        question: 'What type of interactions does AI enable in the classroom?',
        answer: 'More meaningful interactions between educators and learners',
      },
      {
        id: 5,
        question: 'How is AI transforming the educational landscape?',
        answer: 'In unprecedented ways through various technological integrations',
      },
    ],
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with back button and edit button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              asChild
              variant="ghost"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Articles
              </Link>
            </Button>
            <Button asChild size="lg" className="gap-2">
              <Link href={`/articles/${id}/edit`}>
                <Edit className="h-5 w-5" />
                Edit
              </Link>
            </Button>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground">
            Article Preview
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Review your article and answers</p>
        </div>

        <div className="space-y-6">
          {/* Date and URL Section */}
          <Card className="border-border/50 bg-card p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Calendar className="h-4 w-4 text-accent-foreground" />
                  Date
                </Label>
                <p className="text-base text-foreground">{article.date}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Link2 className="h-4 w-4 text-accent-foreground" />
                  Article URL
                </Label>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-primary hover:underline break-all"
                >
                  {article.url}
                </a>
              </div>
            </div>
          </Card>

          {/* Article Title Section */}
          <Card className="border-border/50 bg-card p-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base font-semibold text-foreground">
                <BookOpen className="h-5 w-5 text-accent-foreground" />
                Article Title
              </Label>
              <p className="text-xl font-serif font-light text-foreground">{article.title}</p>
            </div>
          </Card>

          {/* Article Body Section */}
          <Card className="border-border/50 bg-card p-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base font-semibold text-foreground">
                <BookOpen className="h-5 w-5 text-accent-foreground" />
                Article Body
              </Label>
              <div className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                {article.body}
              </div>
            </div>
          </Card>

          {/* Questions Section */}
          <Card className="border-border/50 bg-card p-6">
            <div className="space-y-6">
              <Label className="flex items-center gap-2 text-base font-semibold text-foreground">
                <HelpCircle className="h-5 w-5 text-accent-foreground" />
                Comprehension Questions
              </Label>

              <div className="space-y-6">
                {article.questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="space-y-4 rounded-lg border border-border/50 p-4 bg-accent/20"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Question {index + 1}
                      </Label>
                      <p className="text-base text-foreground">{q.question}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Your Answer
                      </Label>
                      <p className="text-base text-foreground">{q.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
