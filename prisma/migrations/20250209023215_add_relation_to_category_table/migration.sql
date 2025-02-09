/*
  Warnings:

  - Added the required column `category_id` to the `credit_card_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `pending_payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_card_expenses" ADD COLUMN     "category_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pending_payments" ADD COLUMN     "category_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "credit_card_expenses" ADD CONSTRAINT "credit_card_expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_payments" ADD CONSTRAINT "pending_payments_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
