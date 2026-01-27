/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReviewerCommentsFieldToUser1769539325367 implements MigrationInterface {
    name = 'AddReviewerCommentsFieldToUser1769539325367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" ADD "reviewerComments" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "reviewerComments"`);
    }

}
