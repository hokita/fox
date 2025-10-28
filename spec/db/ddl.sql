-- Articles Table
-- Stores English learning articles and their metadata
CREATE TABLE articles (
  id CHAR(36) NOT NULL PRIMARY KEY,
  url VARCHAR(2048) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  studied_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Questions Table
-- Stores comprehension questions related to articles
CREATE TABLE questions (
  id CHAR(36) NOT NULL PRIMARY KEY,
  article_id CHAR(36) NOT NULL,
  sort INT NOT NULL,
  body TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
