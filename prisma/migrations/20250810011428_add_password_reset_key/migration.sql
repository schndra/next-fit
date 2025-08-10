-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "reset_token" TEXT,
ADD COLUMN     "reset_token_expires_at" TIMESTAMP(3);
