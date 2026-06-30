-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'participant');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'participant';
