-- DropForeignKey
ALTER TABLE `ctg_stock` DROP FOREIGN KEY `ctg_stock_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `ctg_stock_based_location` DROP FOREIGN KEY `ctg_stock_based_location_ctg_stock_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_document_id_fkey`;

-- DropForeignKey
ALTER TABLE `price_variance` DROP FOREIGN KEY `price_variance_category_id_fkey`;

-- AlterTable
ALTER TABLE `price_variance` MODIFY `category_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `order_documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ctg_stock` ADD CONSTRAINT `ctg_stock_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `price_variance` ADD CONSTRAINT `price_variance_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `ctg_stock_based_location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ctg_stock_based_location` ADD CONSTRAINT `ctg_stock_based_location_ctg_stock_fkey` FOREIGN KEY (`ctg_stock`) REFERENCES `ctg_stock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
