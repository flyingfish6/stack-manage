-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockIn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemName` VARCHAR(191) NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `supplierId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockOut` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemName` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `supplierId` INTEGER NOT NULL,
    `receiver` VARCHAR(191) NOT NULL,
    `workshop` ENUM('WORKSHOP_A', 'WORKSHOP_B', 'WORKSHOP_C') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stock` (
    `itemName` VARCHAR(191) NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `totalIn` INTEGER NOT NULL,
    `totalOut` INTEGER NOT NULL,
    `remaining` INTEGER NOT NULL,
    `stockValue` DOUBLE NOT NULL,

    PRIMARY KEY (`itemName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StockIn` ADD CONSTRAINT `StockIn_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockIn` ADD CONSTRAINT `StockIn_itemName_fkey` FOREIGN KEY (`itemName`) REFERENCES `Stock`(`itemName`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockOut` ADD CONSTRAINT `StockOut_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockOut` ADD CONSTRAINT `StockOut_itemName_fkey` FOREIGN KEY (`itemName`) REFERENCES `Stock`(`itemName`) ON DELETE RESTRICT ON UPDATE CASCADE;
