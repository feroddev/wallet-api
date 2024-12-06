-- AlterTable
ALTER TABLE "split_or_recurrence" ADD COLUMN     "credit_card_id" TEXT;

-- AddForeignKey
ALTER TABLE "split_or_recurrence" ADD CONSTRAINT "split_or_recurrence_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
