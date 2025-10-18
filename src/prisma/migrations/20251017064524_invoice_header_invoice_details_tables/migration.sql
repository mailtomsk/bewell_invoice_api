-- CreateTable
CREATE TABLE "public"."tbl_invoiceHeader" (
    "id" SERIAL NOT NULL,
    "tran_no" TEXT NOT NULL,
    "tran_date" TIMESTAMP(3) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "vendor_name" TEXT,
    "vendor_address" TEXT,
    "sub_total" DECIMAL(10,2) NOT NULL,
    "gst" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "amount_paid" DECIMAL(10,2) NOT NULL,
    "amount_balance" DECIMAL(10,2) NOT NULL,
    "status" TEXT,
    "notes" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_invoiceHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tbl_invoiceDetails" (
    "id" SERIAL NOT NULL,
    "header_id" INTEGER NOT NULL,
    "tran_no" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "sno" INTEGER NOT NULL,
    "notes" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_invoiceDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_invoiceHeader_tran_no_key" ON "public"."tbl_invoiceHeader"("tran_no");

-- AddForeignKey
ALTER TABLE "public"."tbl_invoiceDetails" ADD CONSTRAINT "tbl_invoiceDetails_header_id_fkey" FOREIGN KEY ("header_id") REFERENCES "public"."tbl_invoiceHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
