# Goal

I want to a application of English learning.
Application can scrape articles from the web and user can read articles and answer questions about the articles.

# Specifications

## FE

- typescript
- Next.js

## API

- typescript
- jest
- Node.js + Express
- MySQL (No framework)
- Clean Architecture

# Plan

- [x]   1. create "Hello World" api
- [x]   2. create "Hello World" FE

# API Requirements

Based on frontend implementation analysis.

## Required APIs

### 1. GET /api/articles

List all articles for the home page

**Purpose**: Display article list on home page (fe/app/page.tsx:15)

**Response**:

```json
{
    "articles": [
        {
            "id": "string",
            "date": "string",
            "title": "string"
        }
    ]
}
```

---

### 2. GET /api/articles/:id

Get single article with questions

**Purpose**: Display article preview page (fe/app/articles/[id]/page.tsx:13)

**Response**:

```json
{
  "id": "string",
  "date": "string",
  "title": "string",
  "url": "string",
  "body": "string",
  "questions": [
    {
      "id": number,
      "question": "string",
      "answer": "string"
    }
  ]
}
```

---

### 3. POST /api/articles

Create new article

**Purpose**: Save new article from creation page (fe/app/articles/new/page.tsx:33)

**Request Body**:

```json
{
    "date": "string",
    "title": "string",
    "url": "string",
    "body": "string",
    "questions": [
        {
            "question": "string",
            "answer": "string"
        }
    ]
}
```

**Response**:

```json
{
    "id": "string",
    "message": "Article created successfully"
}
```

---

### 4. PUT /api/articles/:id

Update existing article

**Purpose**: Save changes from edit page (fe/app/articles/[id]/edit/page.tsx:57)

**Request Body**: Same as POST /api/articles

**Response**:

```json
{
    "message": "Article updated successfully"
}
```

---

### 5. DELETE /api/articles/:id (Optional)

Delete article

**Purpose**: Future feature for article deletion

**Response**:

```json
{
    "message": "Article deleted successfully"
}
```

---

## API Summary by Page

| Page                         | APIs Needed                                  |
| ---------------------------- | -------------------------------------------- |
| `/` (Article List)           | GET /api/articles                            |
| `/articles/new` (Create)     | POST /api/articles                           |
| `/articles/[id]` (Preview)   | GET /api/articles/:id                        |
| `/articles/[id]/edit` (Edit) | GET /api/articles/:id, PUT /api/articles/:id |

## Implementation Notes

1. **Date Format**: Frontend uses ISO format (YYYY-MM-DD) for forms, displays as "MMM DD YYYY" on list page
2. **Questions**: Always 5 questions per article (fe/app/articles/new/page.tsx:17-23)
3. **Mock Data**: Currently all pages use mock data - need to replace with actual API calls
4. **Error Handling**: Frontend should handle API errors gracefully
5. **Loading States**: Add loading indicators during API calls
6. **CORS**: Backend already has CORS enabled for http://localhost:3001
