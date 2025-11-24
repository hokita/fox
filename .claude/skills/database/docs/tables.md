# Database Table Specifications

## Articles

The `articles` table stores English learning articles and their metadata.

| Column Name | Type          | Attributes / Default                                            | Description                             |
| ----------- | ------------- | --------------------------------------------------------------- | --------------------------------------- |
| id          | CHAR(36)      | PRIMARY KEY, NOT NULL                                           | Unique identifier (UUID) for each article |
| url         | VARCHAR(2048) | NOT NULL                                                        | Article URL (up to 2048 characters)     |
| title       | VARCHAR(255)  | NOT NULL                                                        | Article title                           |
| body        | TEXT          | NOT NULL                                                        | Article content or full text            |
| memo        | TEXT          | NOT NULL, DEFAULT ''                                            | User's personal notes or memo about the article |
| studied_at  | DATETIME      | NOT NULL                                                        | The time you study the article          |
| created_at  | DATETIME      | NOT NULL, DEFAULT CURRENT_TIMESTAMP                             | When the record was created             |
| updated_at  | DATETIME      | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | When the record was last updated        |

### Notes

- `id`: Uses CHAR(36) to store UUID-based unique identifiers
- `url`: Maximum length of 2048 characters to accommodate long URLs
- `title`: User-editable article title
- `body`: TEXT type for storing variable-length article content
- `memo`: Optional field for user's personal notes or observations about the article
- `studied_at`: Records when the user studied or plans to study the article

---

## Questions

The `questions` table stores comprehension questions related to articles.

| Column Name | Type     | Attributes / Default                                            | Description                              |
| ----------- | -------- | --------------------------------------------------------------- | ---------------------------------------- |
| id          | CHAR(36) | PRIMARY KEY, NOT NULL                                           | Unique identifier (UUID) for each question |
| article_id  | CHAR(36) | NOT NULL                                                        | ID of the related article                |
| sort        | INT      | NOT NULL                                                        | Order of the question within the article |
| body        | TEXT     | NOT NULL                                                        | Question text content                    |
| answer      | TEXT     | NOT NULL                                                        | Answer text content                      |
| created_at  | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP                             | When the question was created            |
| updated_at  | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | When the question was last updated       |

### Notes

- `article_id`: Foreign key reference to the `articles` table
- `sort`: Determines the display order of questions for an article
- `body`: Stores the question text
- `answer`: Stores the user's answer to the question

### Relationships

- Each question belongs to one article (many-to-one relationship via `article_id`)
- Questions are ordered within an article using the `sort` field
