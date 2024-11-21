/*
  Warnings:

  - Added the required column `production_cost` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `person_in_charge` VARCHAR(191) NULL,
    ADD COLUMN `production_cost` BIGINT NOT NULL,
    ADD COLUMN `supplier_phone` VARCHAR(191) NULL;
