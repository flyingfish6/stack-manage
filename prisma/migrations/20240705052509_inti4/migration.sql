/*
  Warnings:

  - You are about to drop the column `supplierId` on the `stockout` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `stockout` DROP FOREIGN KEY `StockOut_supplierId_fkey`;

-- AlterTable
ALTER TABLE `stockout` DROP COLUMN `supplierId`;
