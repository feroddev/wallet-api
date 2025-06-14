-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "installment_number" INTEGER,
ADD COLUMN     "purchase_id" TEXT,
ADD COLUMN     "total_installments" INTEGER;
