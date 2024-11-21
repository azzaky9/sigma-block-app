-- AlterTable
ALTER TABLE `products` ADD COLUMN `origin` ENUM('production', 'purchase') NOT NULL DEFAULT 'purchase';
