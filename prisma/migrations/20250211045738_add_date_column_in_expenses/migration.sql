/*
  Warnings:

  - Added the required column `date` to the `credit_card_expenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_card_expenses" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
