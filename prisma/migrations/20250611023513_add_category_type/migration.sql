/*
  Warnings:

  - You are about to drop the column `subscription_plan_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `subscription_plans` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "CategoryType" ADD VALUE 'INVESTMENT';

-- AlterEnum
ALTER TYPE "Plan" ADD VALUE 'BASIC';

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'INVESTMENT';

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_subscription_plan_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "subscription_plan_id";

-- DropTable
DROP TABLE "subscription_plans";
