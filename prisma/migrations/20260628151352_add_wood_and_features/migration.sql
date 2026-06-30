-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('positive', 'negative');

-- CreateTable
CREATE TABLE "wood" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wood_features" (
    "id" SERIAL NOT NULL,
    "wood_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "type" "FeatureType" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "wood_features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wood_slug_key" ON "wood"("slug");

-- AddForeignKey
ALTER TABLE "wood_features" ADD CONSTRAINT "wood_features_wood_id_fkey" FOREIGN KEY ("wood_id") REFERENCES "wood"("id") ON DELETE CASCADE ON UPDATE CASCADE;
