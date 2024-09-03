/*
  Warnings:

  - Added the required column `last_payment_date` to the `SaleOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_status` to the `SaleOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `saleorder` ADD COLUMN `last_payment_date` DATETIME(3) NOT NULL,
    ADD COLUMN `payment_status` VARCHAR(191) NOT NULL;
