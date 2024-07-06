/*
  Warnings:

  - The values [WORKSHOP_A,WORKSHOP_B,WORKSHOP_C] on the enum `StockOut_workshop` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `stockout` MODIFY `workshop` ENUM('qianfang', 'si71', 'ziluotong', 'laduan', 'lamaohuanian', 'dianqi', 'wu83', 'zhoucheng', 'maoling', 'sanjiaodai', 'shumaoji', 'dache', 'gaobing', 'jiangxi', 'chuku') NOT NULL;
