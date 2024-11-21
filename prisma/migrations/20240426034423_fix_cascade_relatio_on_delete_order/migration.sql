-- DropForeignKey
ALTER TABLE `product_order` DROP FOREIGN KEY `product_order_order_id_fkey`;

-- AddForeignKey
ALTER TABLE `product_order` ADD CONSTRAINT `product_order_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
