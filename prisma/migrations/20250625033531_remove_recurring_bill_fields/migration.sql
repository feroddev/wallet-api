/*
  Warnings:

  - You are about to drop the column `due_date` on the `recurring_bills` table. All the data in the column will be lost.
  - You are about to drop the column `is_paid` on the `recurring_bills` table. All the data in the column will be lost.
  - You are about to drop the column `paid_at` on the `recurring_bills` table. All the data in the column will be lost.
  - Made the column `recurrence_day` on table `recurring_bills` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "recurring_bills" DROP COLUMN "due_date",
DROP COLUMN "is_paid",
DROP COLUMN "paid_at",
ALTER COLUMN "recurrence_day" SET NOT NULL;
