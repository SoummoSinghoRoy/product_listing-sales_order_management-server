-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_orderId_fkey`;

-- AlterTable
ALTER TABLE `cartitem` MODIFY `orderId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
