/*
  Warnings:

  - You are about to drop the column `is_split_or_recurring` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `split_or_recurrence` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "split_or_recurrence" DROP CONSTRAINT "split_or_recurrence_credit_card_id_fkey";

-- DropForeignKey
ALTER TABLE "split_or_recurrence" DROP CONSTRAINT "split_or_recurrence_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_credit_card_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "is_split_or_recurring";

-- DropTable
DROP TABLE "split_or_recurrence";

-- DropEnum
DROP TYPE "RecurrenceType";

-- CreateTable
CREATE TABLE "credit_card_expenses" (
    "id" TEXT NOT NULL,
    "credit_card_id" TEXT NOT NULL,
    "installment_number" INTEGER NOT NULL,
    "amount" MONEY NOT NULL,
    "total_installments" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_card_expenses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "credit_card_expenses" ADD CONSTRAINT "credit_card_expenses_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
