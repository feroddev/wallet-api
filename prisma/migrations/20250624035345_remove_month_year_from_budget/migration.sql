/*
  Warnings:

  - You are about to drop the column `category` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `budgets` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `budgets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,category_id]` on the table `budgets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `budgets` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "budgets_user_id_category_month_year_key";

-- AlterTable
ALTER TABLE "budgets" DROP COLUMN "category",
DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "category_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "budgets_user_id_category_id_key" ON "budgets"("user_id", "category_id");

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
