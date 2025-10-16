'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar, Link2, BookOpen, HelpCircle, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EnglishLearningPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [articleTitle, setArticleTitle] = useState('')
  const [articleUrl, setArticleUrl] = useState('')
  const [articleBody, setArticleBody] = useState('')
  const [questions, setQuestions] = useState([
    { id: 1, question: '', answer: '' },
    { id: 2, question: '', answer: '' },
    { id: 3, question: '', answer: '' },
    { id: 4, question: '', answer: '' },
    { id: 5, question: '', answer: '' },
  ])

  const handleQuestionChange = (id: number, value: string) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, question: value } : q)))
  }

  const handleAnswerChange = (id: number, value: string) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, answer: value } : q)))
  }

  const handleSave = () => {
    const data = {
      date,
      articleTitle,
      articleUrl,
      articleBody,
      questions,
    }
    console.log('Saving data:', data)
    alert('Article and answers saved successfully!')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground">
            New Article
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Create a new article and add questions
          </p>
        </div>

        <div className="space-y-6">
          {/* Date and URL Section */}
          <Card className="border-border/50 bg-card p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <Calendar className="h-4 w-4 text-accent-foreground" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border-border/50 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="url"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <Link2 className="h-4 w-4 text-accent-foreground" />
                  Article URL
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/article"
                  value={articleUrl}
                  onChange={e => setArticleUrl(e.target.value)}
                  className="w-full border-border/50 bg-background"
                />
              </div>
            </div>
          </Card>

          {/* Article Title Section */}
          <Card className="border-border/50 bg-card p-6">
            <div className="space-y-3">
              <Label
                htmlFor="title"
                className="flex items-center gap-2 text-base font-semibold text-foreground"
              >
                <BookOpen className="h-5 w-5 text-accent-foreground" />
                Article Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter the article title..."
                value={articleTitle}
                onChange={e => setArticleTitle(e.target.value)}
                className="text-base border-border/50 bg-background"
              />
            </div>
          </Card>

          {/* Article Body Section */}
          <Card className="border-border/50 bg-card p-6">
            <div className="space-y-3">
              <Label
                htmlFor="article"
                className="flex items-center gap-2 text-base font-semibold text-foreground"
              >
                <BookOpen className="h-5 w-5 text-accent-foreground" />
                Article Body
              </Label>
              <Textarea
                id="article"
                placeholder="Paste or type the article content here..."
                value={articleBody}
                onChange={e => setArticleBody(e.target.value)}
                className="min-h-[300px] resize-y text-base leading-relaxed border-border/50 bg-background"
              />
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
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="space-y-4 rounded-lg border border-border/50 p-4 bg-accent/20"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor={`question-${q.id}`}
                        className="text-sm font-medium text-foreground"
                      >
                        Question {index + 1}
                      </Label>
                      <Input
                        id={`question-${q.id}`}
                        placeholder="Enter your question..."
                        value={q.question}
                        onChange={e => handleQuestionChange(q.id, e.target.value)}
                        className="border-border/50 bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`answer-${q.id}`}
                        className="text-sm font-medium text-muted-foreground"
                      >
                        Your Answer
                      </Label>
                      <Textarea
                        id={`answer-${q.id}`}
                        placeholder="Type your answer here..."
                        value={q.answer}
                        onChange={e => handleAnswerChange(q.id, e.target.value)}
                        className="min-h-[100px] resize-y border-border/50 bg-background"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              size="lg"
              className="gap-2 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-5 w-5" />
              Save Progress
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
