'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetch('http://localhost:3000/api/hello')
      .then(res => res.json())
      .then(data => {
        setMessage(data.content)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to fetch from API')
        setLoading(false)
        console.error(err)
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          English Learning App
        </h1>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-gray-700">API Response:</p>
              {loading && <p className="text-gray-600 italic">Loading...</p>}
              {error && <p className="text-red-600">{error}</p>}
              {message && <p className="text-lg font-semibold text-blue-700">{message}</p>}
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Frontend: Next.js + TypeScript</p>
          <p>Backend: Node.js + Express</p>
        </div>
      </div>
    </div>
  )
}
