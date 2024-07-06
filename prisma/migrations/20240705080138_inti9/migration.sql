/*
  Warnings:

  - You are about to drop the column `supplierId` on the `stockin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `stockin` DROP FOREIGN KEY `StockIn_supplierId_fkey`;

-- AlterTable
ALTER TABLE `stockin` DROP COLUMN `supplierId`,
    ADD COLUMN `supplier` VARCHAR(191) NOT NULL DEFAULT '供货商1';
