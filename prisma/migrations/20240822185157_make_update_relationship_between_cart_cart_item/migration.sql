/*
  Warnings:

  - You are about to drop the column `cartId` on the `cartitem` table. All the data in the column will be lost.
  - Added the required column `cartItemId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_cartId_fkey`;

-- AlterTable
ALTER TABLE `cart` ADD COLUMN `cartItemId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `cartId`;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_cartItemId_fkey` FOREIGN KEY (`cartItemId`) REFERENCES `CartItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
