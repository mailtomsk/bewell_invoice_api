/*
  Warnings:

  - Added the required column `vendor_id` to the `tbl_invoiceHeader` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tbl_invoiceHeader" ADD COLUMN     "upload_doc" TEXT,
ADD COLUMN     "vendor_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."tbl_vendor" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address1" TEXT,
    "address2" TEXT,
    "country" TEXT,
    "zipcode" TEXT,
    "remarks" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_vendor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."tbl_invoiceHeader" ADD CONSTRAINT "tbl_invoiceHeader_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "public"."tbl_vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
