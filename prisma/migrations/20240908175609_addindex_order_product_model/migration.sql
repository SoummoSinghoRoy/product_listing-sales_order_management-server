-- CreateIndex
CREATE INDEX `Order_order_date_idx` ON `Order`(`order_date`);

-- CreateIndex
CREATE INDEX `Product_name_idx` ON `Product`(`name`);

-- CreateIndex
CREATE INDEX `Product_brand_idx` ON `Product`(`brand`);

-- CreateIndex
CREATE INDEX `Product_sku_idx` ON `Product`(`sku`);
