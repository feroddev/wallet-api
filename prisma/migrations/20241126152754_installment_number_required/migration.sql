/*
  Warnings:

  - Made the column `installment_number` on table `installments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "installments" ALTER COLUMN "installment_number" SET NOT NULL;
