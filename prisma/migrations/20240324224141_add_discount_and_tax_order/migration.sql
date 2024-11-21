/*
  Warnings:

  - You are about to drop the `CompanyInformation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `discount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_amount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_percentage` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax_amount` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `discount` INTEGER NOT NULL,
    ADD COLUMN `discount_amount` INTEGER NOT NULL,
    ADD COLUMN `discount_percentage` INTEGER NOT NULL,
    ADD COLUMN `tax_amount` INTEGER NOT NULL,
    ADD COLUMN `tax_percentage` INTEGER NOT NULL DEFAULT 11;

-- DropTable
DROP TABLE `CompanyInformation`;

-- CreateTable
CREATE TABLE `company_information` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `tel` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
