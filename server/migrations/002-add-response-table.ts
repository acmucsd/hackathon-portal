/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResponseTable1736321126004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TYPE "public"."Response_formtype_enum" AS ENUM(\'APPLICATION\', \'LIABILITY_WAIVER\', \'PHOTO_RELEASE\')',
    );
    await queryRunner.query(
      'CREATE TABLE "Response" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "formType" "public"."Response_formtype_enum" NOT NULL, "data" json NOT NULL, "user" character varying, CONSTRAINT "PK_a5617758dbf4d5f0811b277a8f7" PRIMARY KEY ("uuid"))',
    );
    await queryRunner.query(
      'CREATE INDEX "response_by_user_index" ON "Response" ("user") ',
    );
    await queryRunner.query(
      'ALTER TABLE "Response" ADD CONSTRAINT "FK_761abe8c92143db50bb2c853102" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "Response" DROP CONSTRAINT "FK_761abe8c92143db50bb2c853102"',
    );
    await queryRunner.query('DROP INDEX "public"."response_by_user_index"');
    await queryRunner.query('DROP TABLE "Response"');
    await queryRunner.query('DROP TYPE "public"."Response_formtype_enum"');
  }
}
