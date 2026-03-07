/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReviewerCommentsFieldToUser1769544543815 implements MigrationInterface {
    name = 'AddReviewerCommentsFieldToUser1769544543815';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "User" ADD "reviewerComments" text');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "User" DROP COLUMN "reviewerComments"');
    }

}
