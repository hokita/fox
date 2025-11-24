---
name: Database
description: Database schemas, table specifications, and migration information. Use when working with database structure or queries.
---

# Database Reference

Database schema and specifications for the Fox English learning service.

## Database System

- **Production:** MySQL
- **Testing:** SQLite (in-memory via better-sqlite3)
- **Configuration:** `api/src/infrastructure/database/config.ts`

## Documentation

- **[Table Schemas](docs/tables.md)** - Detailed table structure and field descriptions
- **[DDL Script](docs/ddl.sql)** - Complete SQL schema definition
- **[Migrations](docs/migrations/)** - Database migration scripts

## Tables

### Articles

Stores English learning articles and their metadata.

**Key Fields:**
- `id` (CHAR(36)) - UUID primary key
- `title` (VARCHAR(255)) - User-editable article title
- `url` (VARCHAR(2048)) - Article source URL
- `body` (TEXT) - Article content
- `memo` (TEXT) - User's personal notes
- `studied_at` (DATETIME) - When the article was/will be studied
- `created_at`, `updated_at` - Timestamps

### Questions

Stores comprehension questions related to articles.

**Key Fields:**
- `id` (CHAR(36)) - UUID primary key
- `article_id` (CHAR(36)) - Foreign key to articles
- `sort` (INT) - Display order
- `body` (TEXT) - Question text
- `answer` (TEXT) - Answer text
- `created_at`, `updated_at` - Timestamps

**Relationship:** Each question belongs to one article (many-to-one)

## Repository Pattern

- **Interface:** `api/src/domain/repositories/ArticleRepository.ts`
- **MySQL Implementation:** `api/src/infrastructure/repositories/MySQLArticleRepository.ts`
- **SQLite Implementation (Testing):** `api/src/__tests__/helpers/SQLiteArticleRepository.ts`

## Related Skills

- **api** - API endpoints and data models
