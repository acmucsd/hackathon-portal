import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReviewerFieldToUser1768966759271 implements MigrationInterface {
    name = 'AddReviewerFieldToUser1768966759271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" ADD "reviewerId" character varying`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_2087fddc19d41019c287c893ed6" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_2087fddc19d41019c287c893ed6"`);
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "reviewerId"`);
    }

}