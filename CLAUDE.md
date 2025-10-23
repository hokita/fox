# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo containing:
- `api/` - Backend REST API (Express + TypeScript + MySQL)
- `fe/` - Frontend application (Next.js + React + TypeScript)
- `spec/` - Specifications and documentation

## API (Backend)

### Architecture

The API follows **Clean Architecture** with strict dependency rules:

```
Domain Layer (Core Business Logic)
  ├── entities/       - Domain entities (Article, QuestionEntity, etc.)
  └── repositories/   - Repository interfaces (dependency inversion)
        ↑
Application Layer (Use Cases)
  └── usecases/       - Business logic orchestration
        ↑
Infrastructure Layer (External Dependencies)
  ├── database/       - Database connection config
  └── repositories/   - Repository implementations (MySQLArticleRepository)
        ↑
Presentation Layer (HTTP Interface)
  ├── controllers/    - Request/response handling
  ├── routes.ts       - Route definitions and dependency wiring
  └── app.ts          - Express app configuration
```

**Dependency Rule**: Inner layers never depend on outer layers. Dependencies point inward.

### Key Patterns

1. **Dependency Injection in routes.ts**: All dependencies are manually wired in `src/presentation/routes.ts`:
   ```typescript
   const repository = new MySQLArticleRepository()
   const useCase = new GetArticlesUseCase(repository)
   const controller = new ArticlesController(useCase, ...)
   ```

2. **Repository Pattern**: Domain defines interfaces, infrastructure implements them:
   - Domain: `src/domain/repositories/ArticleRepository.ts` (interface)
   - Production: `src/infrastructure/repositories/MySQLArticleRepository.ts` (MySQL)
   - Testing: `src/__tests__/helpers/SQLiteArticleRepository.ts` (SQLite in-memory)

3. **Use Cases**: Each use case encapsulates one business operation:
   - `GetArticlesUseCase`, `GetArticleUseCase`, `CreateArticleUseCase`, `UpdateArticleUseCase`

### Development Commands

```bash
cd api

# Development
npm run dev              # Start dev server with hot reload (port 3000)
npm run build            # Compile TypeScript to dist/
npm start               # Run production build

# Testing
npm test                # Run all tests (Jest + Supertest)
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Code Quality
npm run lint            # Check linting issues
npm run lint:fix        # Auto-fix linting issues
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
```

### Testing Strategy

- **Integration Tests**: Located in `src/__tests__/integration/`
- **Test Helpers**: Located in `src/__tests__/helpers/`
  - `testApp.ts` - Creates Express app with SQLite repository
  - `dbSetup.ts` - Database setup utilities
  - `SQLiteArticleRepository.ts` - In-memory SQLite implementation (testing only)

Tests use **SQLite in-memory database** instead of MySQL to avoid external dependencies. Each test gets a fresh database instance via `createTestDatabase()`.

### Database

- **Production**: MySQL (connection via `src/infrastructure/database/config.ts`)
- **Testing**: SQLite in-memory (via better-sqlite3)
- Environment variables in `.env` file (not in repo)

## Frontend (fe/)

### Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Turbopack (build tool)

### Development Commands

```bash
cd fe

# Development
npm run dev              # Start dev server with Turbopack (port 3001)
npm run build            # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format all files with Prettier
npm run format:check    # Check formatting
```

### API Integration

The frontend communicates with the API at `http://localhost:3000` in development. API client code is in `api/` directory within the frontend.

## Common Workflows

### Running Both Servers

From project root or individual directories:
```bash
# Terminal 1
cd api && npm run dev

# Terminal 2
cd fe && npm run dev
```

### Adding New API Endpoints

1. Define entity in `api/src/domain/entities/`
2. Define repository interface in `api/src/domain/repositories/`
3. Create use case in `api/src/application/usecases/`
4. Implement repository in `api/src/infrastructure/repositories/`
5. Create controller in `api/src/presentation/controllers/`
6. Wire dependencies in `api/src/presentation/routes.ts`
7. Add integration tests in `api/src/__tests__/integration/`
8. Implement SQLite version in `api/src/__tests__/helpers/` if needed

### Code Quality Standards

- ESLint and Prettier are configured for both projects
- Jest globals are configured in ESLint for test files
- Always run `npm run lint` and `npm run format:check` before committing
- Integration tests must pass before committing

## Git Workflow

- Use custom slash commands:
  - `/commit` - Create properly formatted commits
  - `/check` - Run lint, format check, and build
- Always preserve file history using `git mv` for file moves
- Test files should include descriptive comments explaining their purpose
