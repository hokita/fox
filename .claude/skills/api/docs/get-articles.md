# GET /api/articles

Get a list of all articles.

## Endpoint

```
GET /api/articles
```

## Request

### Headers

```
Content-Type: application/json
```

### Query Parameters

None

### Request Body

None

## Response

### Success Response

**Status Code:** `200 OK`

**Response Body:**

```json
{
  "articles": [
    {
      "id": "string",
      "title": "string",
      "url": "string",
      "body": "string",
      "studied_at": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### Error Response

**Status Code:** `500 Internal Server Error`

**Response Body:**

```json
{
  "error": "Internal server error"
}
```

## Data Types

### Article Object

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier for the article |
| title | string | Article title |
| url | string | Source URL of the article |
| body | string | Full text content of the article |
| studied_at | string | ISO 8601 datetime when the article was/will be studied |
| created_at | string | ISO 8601 datetime when the article was created |
| updated_at | string | ISO 8601 datetime when the article was last updated |

## Example

### Request

```bash
curl -X GET http://localhost:3000/api/articles \
  -H "Content-Type: application/json"
```

### Response

```json
{
  "articles": [
    {
      "id": "1",
      "title": "The Future of Artificial Intelligence in Education",
      "url": "https://example.com/ai-education",
      "body": "Artificial intelligence is transforming the educational landscape...",
      "studied_at": "2025-01-15T00:00:00.000Z",
      "created_at": "2025-01-15T00:00:00.000Z",
      "updated_at": "2025-01-15T00:00:00.000Z"
    },
    {
      "id": "2",
      "title": "Understanding Climate Change Through Data Visualization",
      "url": "https://example.com/climate-data",
      "body": "Data visualization has become an essential tool...",
      "studied_at": "2025-01-16T00:00:00.000Z",
      "created_at": "2025-01-16T00:00:00.000Z",
      "updated_at": "2025-01-16T00:00:00.000Z"
    }
  ]
}
```

## Implementation

### Backend

- **Controller:** `api/src/controllers/ArticlesController.ts`
- **Use Case:** `api/src/usecases/GetArticlesUseCase.ts`
- **Repository:** `api/src/repositories/ArticleRepository.ts`

### Frontend

- **API Client:** `fe/api/articles.ts` - `getArticles()`
- **Type:** `fe/models/article.ts` - `Article`
- **Response Type:** `fe/models/response.ts` - `ArticlesResponse`
