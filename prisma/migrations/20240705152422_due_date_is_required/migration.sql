/*
  Warnings:

  - Made the column `due_date` on table `expenses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "due_date" SET NOT NULL,
ALTER COLUMN "due_date" SET DEFAULT CURRENT_TIMESTAMP;
