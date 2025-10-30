-- Migration: Add memo column to articles table
-- Date: 2025-10-30

-- Step 1: Add column as nullable (TEXT can't have DEFAULT in MySQL)
ALTER TABLE articles
ADD COLUMN memo TEXT NULL AFTER body;

-- Step 2: Update all existing rows to have empty string
UPDATE articles SET memo = '' WHERE memo IS NULL;

-- Step 3: Make column NOT NULL
ALTER TABLE articles
MODIFY COLUMN memo TEXT NOT NULL;
