-- AlterTable
ALTER TABLE "public"."ServiceRequest" ADD COLUMN     "technicianId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."ServiceRequest" ADD CONSTRAINT "ServiceRequest_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
