---
name: API
description: Reference for the REST API endpoints, request/response formats, and data models. Use when implementing or debugging API-related features.
---

# API Specification

This skill provides the complete API specification for the service.

## Base URL

- **Development:** `http://localhost:3000`
- **API Base Path:** `/api`

## Endpoints

### GET /api/articles

Retrieve a list of all articles.

**Request:**
```http
GET /api/articles HTTP/1.1
Content-Type: application/json
```

**Response:** `200 OK`
```json
{
  "articles": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "body": "string",
      "studied_at": "string (ISO 8601)",
      "created_at": "string (ISO 8601)",
      "updated_at": "string (ISO 8601)"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3000/api/articles
```

---

### GET /api/articles/:id

Retrieve a single article by ID.

**Request:**
```http
GET /api/articles/{id} HTTP/1.1
Content-Type: application/json
```

**Path Parameters:**
- `id` (string, required): The unique identifier of the article

**Response:** `200 OK`
```json
{
  "article": {
    "id": "string",
    "title": "string",
    "url": "string",
    "body": "string",
    "studied_at": "string (ISO 8601)",
    "created_at": "string (ISO 8601)",
    "updated_at": "string (ISO 8601)"
  }
}
```

**Response:** `404 Not Found`
```json
{
  "error": "Article not found"
}
```

**Example:**
```bash
curl http://localhost:3000/api/articles/1
```

---

## Data Models

### Article

Represents an article for English learning.

```typescript
interface Article {
  id: string
  title: string
  url: string
  body: string
  studied_at: string  // ISO 8601 datetime
  created_at: string  // ISO 8601 datetime
  updated_at: string  // ISO 8601 datetime
}
```

**Field Descriptions:**

- `id`: Unique identifier for the article
- `title`: The article's title
- `url`: Source URL of the article
- `body`: Full text content of the article
- `studied_at`: When the article was/will be studied
- `created_at`: When the article was created in the system
- `updated_at`: When the article was last modified

---

## Error Handling

All endpoints follow consistent error response patterns:

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

**404 Not Found:**
```json
{
  "error": "Article not found"
}
```

---

## Implementation Notes

### Backend Architecture

The API follows Clean Architecture principles:

1. **Controllers** (`api/src/controllers/ArticlesController.ts`)
   - Handle HTTP request/response
   - Validate input
   - Call use cases

2. **Use Cases** (`api/src/usecases/`)
   - `GetArticlesUseCase`: Fetch all articles
   - `GetArticleUseCase`: Fetch single article by ID
   - Business logic layer

3. **Repositories** (`api/src/repositories/`)
   - `ArticleRepository`: Interface defining data access methods
   - `MockArticleRepository`: In-memory implementation with sample data
   - Data access layer

4. **Entities** (`api/src/entities/Article.ts`)
   - Core data models

### Frontend Integration

The frontend uses these API endpoints via:

- **API Client:** `fe/api/articles.ts`
- **Models:** `fe/models/article.ts`
- **Response Types:** `fe/models/response.ts`

Frontend functions:
- `getArticles()`: Fetches article list
- `getArticleById(id)`: Fetches single article

---

## Testing

### Manual Testing

```bash
# Test article list
curl -s http://localhost:3000/api/articles | jq

# Test single article
curl -s http://localhost:3000/api/articles/1 | jq

# Test 404 error
curl -s http://localhost:3000/api/articles/999 | jq
```

### Current Mock Data

The MockArticleRepository provides 4 sample articles with IDs: "1", "2", "3", "4"

---

## Future Enhancements

- POST /api/articles - Create new article
- PUT /api/articles/:id - Update article
- DELETE /api/articles/:id - Delete article
- Question management endpoints
- Real database implementation (currently using mock repository)
