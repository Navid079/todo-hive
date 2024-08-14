/*
  Warnings:

  - Added the required column `latestNonce` to the `UserToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserToken" ADD COLUMN     "latestNonce" TEXT NOT NULL;
