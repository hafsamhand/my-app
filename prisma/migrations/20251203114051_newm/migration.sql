/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `passwordHash` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `passwordHash`,
    ADD COLUMN `address` TEXT NULL,
    ADD COLUMN `deletedAt` TIMESTAMP(0) NULL,
    ADD COLUMN `fullname` VARCHAR(100) NOT NULL,
    ADD COLUMN `lastAccess` DATETIME(0) NULL,
    ADD COLUMN `password` VARCHAR(255) NOT NULL,
    ADD COLUMN `updatedAt` TIMESTAMP(0) NOT NULL,
    ADD COLUMN `username` VARCHAR(50) NOT NULL,
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Currency` (
    `code` CHAR(3) NOT NULL,
    `symbol` VARCHAR(5) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Loan` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `loanerId` INTEGER UNSIGNED NOT NULL,
    `borrowerId` INTEGER UNSIGNED NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currencyCode` CHAR(3) NOT NULL,
    `borrowingDate` DATE NOT NULL,
    `dueDate` DATE NOT NULL,
    `prolongementDuration` INTEGER UNSIGNED NULL,
    `status` ENUM('active', 'overdue', 'repaid', 'cancelled') NOT NULL DEFAULT 'active',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `Loan_loanerId_deletedAt_idx`(`loanerId`, `deletedAt`),
    INDEX `Loan_borrowerId_deletedAt_idx`(`borrowerId`, `deletedAt`),
    INDEX `Loan_currencyCode_idx`(`currencyCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Spending` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `spenderId` INTEGER UNSIGNED NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currencyCode` CHAR(3) NOT NULL,
    `spendingDate` DATE NOT NULL,
    `spentOn` VARCHAR(100) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `Spending_spenderId_deletedAt_idx`(`spenderId`, `deletedAt`),
    INDEX `Spending_currencyCode_idx`(`currencyCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Saving` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `saverId` INTEGER UNSIGNED NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currencyCode` CHAR(3) NOT NULL,
    `savingDate` DATE NOT NULL,
    `reason` VARCHAR(150) NULL,
    `savingPlace` VARCHAR(50) NOT NULL,
    `status` ENUM('active', 'withdrawn', 'lost', 'transferred') NOT NULL DEFAULT 'active',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `Saving_saverId_deletedAt_idx`(`saverId`, `deletedAt`),
    INDEX `Saving_currencyCode_idx`(`currencyCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- CreateIndex
CREATE INDEX `User_deletedAt_idx` ON `User`(`deletedAt`);

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_loanerId_fkey` FOREIGN KEY (`loanerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_borrowerId_fkey` FOREIGN KEY (`borrowerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_currencyCode_fkey` FOREIGN KEY (`currencyCode`) REFERENCES `Currency`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Spending` ADD CONSTRAINT `Spending_spenderId_fkey` FOREIGN KEY (`spenderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Spending` ADD CONSTRAINT `Spending_currencyCode_fkey` FOREIGN KEY (`currencyCode`) REFERENCES `Currency`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Saving` ADD CONSTRAINT `Saving_saverId_fkey` FOREIGN KEY (`saverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Saving` ADD CONSTRAINT `Saving_currencyCode_fkey` FOREIGN KEY (`currencyCode`) REFERENCES `Currency`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
