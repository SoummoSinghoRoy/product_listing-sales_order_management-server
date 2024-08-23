/*
  Warnings:

  - You are about to drop the column `cartItemId` on the `cart` table. All the data in the column will be lost.
  - Added the required column `cartId` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_cartItemId_fkey`;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `cartItemId`;

-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `cartId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
