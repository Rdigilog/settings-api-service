/*
  Warnings:

  - The `holiday_types_allowed` column on the `holiday_request_rule_settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `claim_eligibility` column on the `shift_trade_settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `leave_types` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('PER_HOUR', 'PER_DAY', 'PER_WEEK', 'PER_MONTH', 'PER_YEAR');

-- CreateEnum
CREATE TYPE "ClainEligibility" AS ENUM ('ALL_EMPLOYEE', 'QUALIFIED_EMPLOYEE', 'BY_BRANCH');

-- CreateEnum
CREATE TYPE "HolidayTypes" AS ENUM ('PAID_LEAVE', 'UNPAID_LEAVE', 'SICK_LEAVE', 'SABATICAL', 'MATERNITY');

-- DropForeignKey
ALTER TABLE "leaves" DROP CONSTRAINT "leaves_leave_type_id_fkey";

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "about_me" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "banking_info" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "country_timezone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emergency_contact" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "identity_info" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "job_details" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "personal_info" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "primary_info" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "currency_code" TEXT,
ADD COLUMN     "pay_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "period" "BillingCycle" NOT NULL DEFAULT 'PER_HOUR',
ADD COLUMN     "timezone" TEXT;

-- AlterTable
ALTER TABLE "holiday_request_rule_settings" DROP COLUMN "holiday_types_allowed",
ADD COLUMN     "holiday_types_allowed" "HolidayTypes"[],
ALTER COLUMN "approval_required_from" SET NOT NULL,
ALTER COLUMN "approval_required_from" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "shift_trade_settings" DROP COLUMN "claim_eligibility",
ADD COLUMN     "claim_eligibility" "ClainEligibility" DEFAULT 'ALL_EMPLOYEE';

-- DropTable
DROP TABLE "leave_types";

-- CreateTable
CREATE TABLE "leave_policies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "days_per_year" INTEGER NOT NULL DEFAULT 0,
    "companyId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leave_policies_name_key" ON "leave_policies"("name");

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "leave_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
