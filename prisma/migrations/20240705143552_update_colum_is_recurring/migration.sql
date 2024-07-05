/*
  Warnings:

  - You are about to drop the column `is_recurring` on the `expenses` table. All the data in the column will be lost.
  - Made the column `recurring` on table `expenses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "is_recurring",
ALTER COLUMN "recurring" SET NOT NULL,
ALTER COLUMN "recurring" SET DEFAULT 1;
