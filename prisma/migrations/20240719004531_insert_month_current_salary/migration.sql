/*
  Warnings:

  - Made the column `description` on table `salaries` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "salaries" ADD COLUMN     "month" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "description" SET NOT NULL;
