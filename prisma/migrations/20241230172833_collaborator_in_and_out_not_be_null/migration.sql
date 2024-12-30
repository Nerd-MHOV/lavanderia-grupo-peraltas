/*
  Warnings:

  - Made the column `collaborator_id_in` on table `return_orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `collaborator_id_out` on table `return_orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "return_orders" ALTER COLUMN "collaborator_id_in" SET NOT NULL,
ALTER COLUMN "collaborator_id_out" SET NOT NULL;
