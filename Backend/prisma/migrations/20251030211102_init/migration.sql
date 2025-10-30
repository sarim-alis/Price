-- CreateTable
CREATE TABLE "Mobile" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "ram" INTEGER NOT NULL,
    "storage" INTEGER NOT NULL,
    "screenSize" DOUBLE PRECISION NOT NULL,
    "camera" INTEGER NOT NULL,
    "battery" INTEGER NOT NULL,
    "processor" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mobile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "ram" INTEGER NOT NULL,
    "storage" INTEGER NOT NULL,
    "screenSize" DOUBLE PRECISION NOT NULL,
    "camera" INTEGER NOT NULL,
    "battery" INTEGER NOT NULL,
    "processor" TEXT NOT NULL,
    "predictedPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mobile_brand_idx" ON "Mobile"("brand");

-- CreateIndex
CREATE INDEX "Mobile_price_idx" ON "Mobile"("price");

-- CreateIndex
CREATE INDEX "Prediction_createdAt_idx" ON "Prediction"("createdAt");
