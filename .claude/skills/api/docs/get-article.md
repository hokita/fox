# GET /api/articles/:id

Get a single article by ID.

## Endpoint

```
GET /api/articles/:id
```

## Request

### Headers

```
Content-Type: application/json
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | The unique identifier of the article |

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
  "article": {
    "id": "string",
    "title": "string",
    "url": "string",
    "body": "string",
    "studied_at": "string",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

### Error Responses

#### Article Not Found

**Status Code:** `404 Not Found`

**Response Body:**

```json
{
  "error": "Article not found"
}
```

#### Internal Server Error

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

## Examples

### Request - Success Case

```bash
curl -X GET http://localhost:3000/api/articles/1 \
  -H "Content-Type: application/json"
```

### Response - Success Case

```json
{
  "article": {
    "id": "1",
    "title": "The Future of Artificial Intelligence in Education",
    "url": "https://example.com/ai-education",
    "body": "Artificial intelligence is transforming the educational landscape in unprecedented ways. From personalized learning experiences to automated grading systems, AI is making education more accessible and effective for students worldwide.",
    "studied_at": "2025-01-15T00:00:00.000Z",
    "created_at": "2025-01-15T00:00:00.000Z",
    "updated_at": "2025-01-15T00:00:00.000Z"
  }
}
```

### Request - Not Found Case

```bash
curl -X GET http://localhost:3000/api/articles/999 \
  -H "Content-Type: application/json"
```

### Response - Not Found Case

```json
{
  "error": "Article not found"
}
```

## Implementation

### Backend

- **Controller:** `api/src/controllers/ArticlesController.ts` - `getArticleById()`
- **Use Case:** `api/src/usecases/GetArticleUseCase.ts`
- **Repository:** `api/src/repositories/ArticleRepository.ts` - `findById()`

### Frontend

- **API Client:** `fe/api/articles.ts` - `getArticleById(id: string)`
- **Type:** `fe/models/article.ts` - `ArticleDetail`
- **Response Type:** `fe/models/response.ts` - `ArticleResponse`

## Notes

- The frontend `getArticleById()` function maps the response to `ArticleDetail` type, which extends `Article` with a `questions` field
- Currently, questions are returned as an empty array since the question feature is not yet implemented
