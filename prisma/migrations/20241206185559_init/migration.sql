/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `collaborators` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "barcodes" DROP CONSTRAINT "barcodes_product_id_fkey";

-- DropForeignKey
ALTER TABLE "inputs" DROP CONSTRAINT "inputs_product_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_product_id_fkey";

-- DropForeignKey
ALTER TABLE "outputs_history" DROP CONSTRAINT "outputs_history_collaborator_id_fkey";

-- DropForeignKey
ALTER TABLE "outputs_history" DROP CONSTRAINT "outputs_history_product_id_fkey";

-- DropForeignKey
ALTER TABLE "products_departments" DROP CONSTRAINT "products_departments_product_id_fkey";

-- DropForeignKey
ALTER TABLE "returns" DROP CONSTRAINT "returns_collaborator_id_in_fkey";

-- DropForeignKey
ALTER TABLE "returns" DROP CONSTRAINT "returns_collaborator_id_out_fkey";

-- DropForeignKey
ALTER TABLE "returns" DROP CONSTRAINT "returns_product_id_fkey";

-- AlterTable
ALTER TABLE "outputs_history" ALTER COLUMN "product_id" DROP NOT NULL,
ALTER COLUMN "collaborator_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "returns" ALTER COLUMN "collaborator_id_in" DROP NOT NULL,
ALTER COLUMN "collaborator_id_out" DROP NOT NULL;

-- CreateTable
CREATE TABLE "output_orders" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "collaborator_id" TEXT NOT NULL,
    "finality" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "obs" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "collaboratorId" TEXT,

    CONSTRAINT "output_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "output_orders_history" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "collaborator_id" TEXT NOT NULL,
    "finality" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "obs" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "collaboratorId" TEXT,

    CONSTRAINT "output_orders_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collaborators_cpf_key" ON "collaborators"("cpf");

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inputs" ADD CONSTRAINT "inputs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "output_orders" ADD CONSTRAINT "output_orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "output_orders" ADD CONSTRAINT "output_orders_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "output_orders_history" ADD CONSTRAINT "output_orders_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "output_orders_history" ADD CONSTRAINT "output_orders_history_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outputs_history" ADD CONSTRAINT "outputs_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outputs_history" ADD CONSTRAINT "outputs_history_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_collaborator_id_in_fkey" FOREIGN KEY ("collaborator_id_in") REFERENCES "collaborators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_collaborator_id_out_fkey" FOREIGN KEY ("collaborator_id_out") REFERENCES "collaborators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_departments" ADD CONSTRAINT "products_departments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barcodes" ADD CONSTRAINT "barcodes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
