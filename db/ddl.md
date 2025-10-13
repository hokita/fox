# Articles

| Column Name | Type          | Attributes / Default                                            | Description                               |
| ----------- | ------------- | --------------------------------------------------------------- | ----------------------------------------- |
| id          | CHAR(64)      | PRIMARY KEY, NOT NULL                                           | Unique identifier (hash) for each article |
| url         | VARCHAR(2048) | NOT NULL                                                        | Article URL (up to 2048 characters)       |
| body        | TEXT          | NOT NULL                                                        | Article content or full text              |
| studied_at  | DATETIME      | NOT NULL                                                        | The time you study the article            |
| created_at  | DATETIME      | NOT NULL, DEFAULT CURRENT_TIMESTAMP                             | When the record was created               |
| updated_at  | DATETIME      | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | When the record was last updated          |

```sql
CREATE TABLE articles (
  id CHAR(64) NOT NULL PRIMARY KEY,
  url VARCHAR(2048) NOT NULL,
  body TEXT NOT NULL,
  studied_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

# Questions

| Column Name | Type     | Attributes / Default                                            | Description                                |
| ----------- | -------- | --------------------------------------------------------------- | ------------------------------------------ |
| id          | CHAR(64) | PRIMARY KEY, NOT NULL                                           | Unique identifier (hash) for each question |
| article_id  | CHAR(64) | NOT NULL                                                        | ID of the related article                  |
| sort        | INT      | NOT NULL                                                        | Order of the question within the article   |
| body        | TEXT     | NOT NULL                                                        | Question text content                      |
| answer      | TEXT     | NOT NULL                                                        | Answer text content                        |
| created_at  | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP                             | When the question was created              |
| updated_at  | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | When the question was last updated         |

```sql
CREATE TABLE questions (
  id CHAR(64) NOT NULL PRIMARY KEY,
  article_id CHAR(64) NOT NULL,
  sort INT NOT NULL,
  body TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
