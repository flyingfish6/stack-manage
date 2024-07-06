/*
  Warnings:

  - You are about to alter the column `totalIn` on the `stock` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `totalOut` on the `stock` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `remaining` on the `stock` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `lastMonthCarry` on the `stock` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `monthlyIn` on the `stock` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `monthlyOut` on the `stock` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `quantity` on the `stockin` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the column `woreHouse` on the `stockout` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `stockout` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `stockInId` to the `StockOut` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock` MODIFY `totalIn` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `totalOut` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `remaining` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `lastMonthCarry` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `monthlyIn` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `monthlyOut` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `stockin` ADD COLUMN `remaining` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `quantity` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `stockout` DROP COLUMN `woreHouse`,
    ADD COLUMN `stockInId` INTEGER NOT NULL,
    ADD COLUMN `wareHouse` ENUM('qianfang', 'si71', 'ziluotong', 'laduan', 'lamaohuanian', 'dianqi', 'wu83', 'zhoucheng', 'maoling', 'sanjiaodai', 'shumaoji', 'dache', 'gaobing') NOT NULL DEFAULT 'qianfang',
    MODIFY `quantity` DOUBLE NOT NULL;

-- AddForeignKey
ALTER TABLE `StockOut` ADD CONSTRAINT `StockOut_stockInId_fkey` FOREIGN KEY (`stockInId`) REFERENCES `StockIn`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
