/* eslint-disable max-len */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastDecisionUpdatedByFieldToUser1772409600000 implements MigrationInterface {
    name = 'AddLastDecisionUpdatedByFieldToUser1772409600000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "User" ADD "lastDecisionUpdatedById" character varying');
        await queryRunner.query('ALTER TABLE "User" ADD CONSTRAINT "FK_74d66b28b8d7687c814b2f206c1" FOREIGN KEY ("lastDecisionUpdatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "User" DROP CONSTRAINT "FK_74d66b28b8d7687c814b2f206c1"');
        await queryRunner.query('ALTER TABLE "User" DROP COLUMN "lastDecisionUpdatedById"');
    }
}
