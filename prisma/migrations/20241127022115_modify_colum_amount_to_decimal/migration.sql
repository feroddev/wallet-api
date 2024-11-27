/*
  Warnings:

  - You are about to drop the column `total_amount` on the `transactions` table. All the data in the column will be lost.
  - Changed the type of `limit` on the `credit_cards` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount` on the `installments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `totalAmount` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_cards" DROP COLUMN "limit",
ADD COLUMN     "limit" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "installments" DROP COLUMN "amount",
ADD COLUMN     "amount" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "total_amount",
ADD COLUMN     "totalAmount" MONEY NOT NULL;
