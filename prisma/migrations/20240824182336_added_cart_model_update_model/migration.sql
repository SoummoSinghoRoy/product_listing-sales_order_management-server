/*
  Warnings:

  - You are about to drop the column `customerId` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cartId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_orderId_fkey`;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `customerId`,
    DROP COLUMN `orderId`,
    ADD COLUMN `cartId` INTEGER NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `itemId`,
    ADD COLUMN `cartId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Cart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `added_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Order_cartId_key` ON `Order`(`cartId`);

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
