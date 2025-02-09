/*
  Warnings:

  - Added the required column `name` to the `credit_card_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `pending_payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_card_expenses" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pending_payments" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
