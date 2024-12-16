-- CreateTable
CREATE TABLE "return_orders" (
    "id" TEXT NOT NULL,
    "output_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "collaborator_id_in" TEXT,
    "collaborator_id_out" TEXT,
    "finality" TEXT NOT NULL,
    "amount_has" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "amount_bad" INTEGER NOT NULL,
    "status_in" BOOLEAN NOT NULL,
    "status_out" BOOLEAN NOT NULL,
    "obs_in" TEXT NOT NULL,
    "obs_out" TEXT NOT NULL,
    "date_in" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_orders_history" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "collaborator_id_in" TEXT,
    "collaborator_id_out" TEXT,
    "finality" TEXT NOT NULL,
    "amount_has" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "amount_bad" INTEGER NOT NULL,
    "status_in" BOOLEAN NOT NULL,
    "status_out" BOOLEAN NOT NULL,
    "obs_in" TEXT NOT NULL,
    "obs_out" TEXT NOT NULL,
    "date_in" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_orders_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "return_orders" ADD CONSTRAINT "return_orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_orders" ADD CONSTRAINT "return_orders_collaborator_id_in_fkey" FOREIGN KEY ("collaborator_id_in") REFERENCES "collaborators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_orders" ADD CONSTRAINT "return_orders_collaborator_id_out_fkey" FOREIGN KEY ("collaborator_id_out") REFERENCES "collaborators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_orders" ADD CONSTRAINT "return_orders_output_id_fkey" FOREIGN KEY ("output_id") REFERENCES "outputs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_orders_history" ADD CONSTRAINT "return_orders_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_orders_history" ADD CONSTRAINT "return_orders_history_collaborator_id_in_fkey" FOREIGN KEY ("collaborator_id_in") REFERENCES "collaborators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_orders_history" ADD CONSTRAINT "return_orders_history_collaborator_id_out_fkey" FOREIGN KEY ("collaborator_id_out") REFERENCES "collaborators"("id") ON DELETE SET NULL ON UPDATE CASCADE;
