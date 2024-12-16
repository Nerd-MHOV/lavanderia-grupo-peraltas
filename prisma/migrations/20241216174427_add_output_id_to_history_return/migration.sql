/*
  Warnings:

  - Added the required column `output_id` to the `return_orders_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "return_orders_history" ADD COLUMN     "output_id" TEXT NOT NULL;
