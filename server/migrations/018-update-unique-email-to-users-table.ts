/* eslint-disable max-len */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUniqueEmailToUsersTable1774498320669 implements MigrationInterface {
    name = 'UpdateUniqueEmailToUsersTable1774498320669';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "User" ADD CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email")');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "User" DROP CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e"');
    }

}
