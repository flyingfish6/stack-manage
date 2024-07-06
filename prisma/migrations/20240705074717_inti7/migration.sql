/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Receiver` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Receiver_name_key` ON `Receiver`(`name`);
