import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInterestByPhone1772513954255 implements MigrationInterface {
    name = 'AddInterestByPhone1772513954255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "InterestFormResponse" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "InterestFormResponse" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "InterestFormResponse" ADD CONSTRAINT "UQ_91a4e584ba7be1395bbebc22515" UNIQUE ("phone")`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "InterestFormResponse" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "InterestFormResponse" DROP CONSTRAINT "UQ_91a4e584ba7be1395bbebc22515"`);
        await queryRunner.query(`ALTER TABLE "InterestFormResponse" DROP COLUMN "phone"`);

    }

}
