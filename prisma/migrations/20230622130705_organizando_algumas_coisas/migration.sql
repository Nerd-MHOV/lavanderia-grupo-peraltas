/*
  Warnings:

  - You are about to drop the column `responsible_id` on the `output` table. All the data in the column will be lost.
  - You are about to drop the column `responsible_id` on the `output_history` table. All the data in the column will be lost.
  - You are about to drop the column `collaborator_id` on the `return` table. All the data in the column will be lost.
  - You are about to drop the column `obg_out` on the `return` table. All the data in the column will be lost.
  - You are about to drop the column `responsible_id_in` on the `return` table. All the data in the column will be lost.
  - You are about to drop the column `responsible_id_out` on the `return` table. All the data in the column will be lost.
  - Added the required column `forSector` to the `output` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forSector` to the `output_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collaborator_id_in` to the `return` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collaborator_id_out` to the `return` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forSector` to the `return` table without a default value. This is not possible if the table is not empty.
  - Added the required column `obs_out` to the `return` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `output` DROP FOREIGN KEY `output_responsible_id_fkey`;

-- DropForeignKey
ALTER TABLE `output_history` DROP FOREIGN KEY `output_history_responsible_id_fkey`;

-- DropForeignKey
ALTER TABLE `return` DROP FOREIGN KEY `return_collaborator_id_fkey`;

-- DropForeignKey
ALTER TABLE `return` DROP FOREIGN KEY `return_responsible_id_in_fkey`;

-- DropForeignKey
ALTER TABLE `return` DROP FOREIGN KEY `return_responsible_id_out_fkey`;

-- AlterTable
ALTER TABLE `output` DROP COLUMN `responsible_id`,
    ADD COLUMN `collaboratorId` VARCHAR(191) NULL,
    ADD COLUMN `forSector` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `output_history` DROP COLUMN `responsible_id`,
    ADD COLUMN `collaboratorId` VARCHAR(191) NULL,
    ADD COLUMN `forSector` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `return` DROP COLUMN `collaborator_id`,
    DROP COLUMN `obg_out`,
    DROP COLUMN `responsible_id_in`,
    DROP COLUMN `responsible_id_out`,
    ADD COLUMN `collaborator_id_in` VARCHAR(191) NOT NULL,
    ADD COLUMN `collaborator_id_out` VARCHAR(191) NOT NULL,
    ADD COLUMN `forSector` VARCHAR(191) NOT NULL,
    ADD COLUMN `obs_out` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `return` ADD CONSTRAINT `return_collaborator_id_in_fkey` FOREIGN KEY (`collaborator_id_in`) REFERENCES `collaborators`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `return` ADD CONSTRAINT `return_collaborator_id_out_fkey` FOREIGN KEY (`collaborator_id_out`) REFERENCES `collaborators`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
