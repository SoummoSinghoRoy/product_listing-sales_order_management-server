/*
  Warnings:

  - You are about to drop the column `cartId` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_cartId_fkey`;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `cartId`,
    ADD COLUMN `orderId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `cartId`,
    ADD COLUMN `itemId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `cart`;

-- CreateIndex
CREATE UNIQUE INDEX `CartItem_orderId_key` ON `CartItem`(`orderId`);

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
