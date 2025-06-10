-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "invoice_id" TEXT,
ADD COLUMN     "is_paid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_recurring" BOOLEAN NOT NULL DEFAULT false;
