-- CreateTable
CREATE TABLE "price_items" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "thickness" INTEGER NOT NULL,
    "pricePerM3" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_items_pkey" PRIMARY KEY ("id")
);
