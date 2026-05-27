-- AlterTable
-- Remove the identifier column and its index from the users table
DROP INDEX IF EXISTS "users_identifier_idx";
ALTER TABLE "users" DROP COLUMN IF EXISTS "identifier";
