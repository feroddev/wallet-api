/*
  Warnings:

  - You are about to drop the `_SubscriptionPlanToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SubscriptionPlanToUser" DROP CONSTRAINT "_SubscriptionPlanToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubscriptionPlanToUser" DROP CONSTRAINT "_SubscriptionPlanToUser_B_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "subscription_plan_id" TEXT;

-- DropTable
DROP TABLE "_SubscriptionPlanToUser";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
