/*
  Warnings:

  - You are about to drop the column `date_out` on the `return` table. All the data in the column will be lost.
  - You are about to alter the column `forSector` on the `return` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `return` DROP COLUMN `date_out`,
    MODIFY `forSector` BOOLEAN NOT NULL;
