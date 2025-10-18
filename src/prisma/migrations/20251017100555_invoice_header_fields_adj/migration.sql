-- AlterTable
ALTER TABLE "public"."tbl_invoiceHeader" ADD COLUMN     "payment_terms" TEXT,
ADD COLUMN     "receiver_address" TEXT,
ADD COLUMN     "receiver_name" TEXT,
ADD COLUMN     "ref_no" TEXT,
ALTER COLUMN "tran_date" SET DATA TYPE DATE,
ALTER COLUMN "payment_date" SET DATA TYPE DATE;
