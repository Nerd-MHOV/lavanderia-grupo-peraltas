/*
  Warnings:

  - Added the required column `amount` to the `inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inventory` ADD COLUMN `amount` INTEGER NOT NULL;
