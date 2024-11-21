-- DropForeignKey
ALTER TABLE `order_stock_lists` DROP FOREIGN KEY `order_stock_lists_order_id_fkey`;

-- AddForeignKey
ALTER TABLE `order_stock_lists` ADD CONSTRAINT `order_stock_lists_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `product_order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
