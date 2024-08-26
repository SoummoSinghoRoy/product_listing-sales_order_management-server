/*
  Warnings:

  - You are about to drop the column `createdAt` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `saleorder` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `saleorder` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cart` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `payment_method` VARCHAR(191) NOT NULL DEFAULT 'cash',
    MODIFY `order_date` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `saleorder` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
