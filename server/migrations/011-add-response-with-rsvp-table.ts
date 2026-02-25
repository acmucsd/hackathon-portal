/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResponseWithRsvpTable1772051899872 implements MigrationInterface {
    name = 'AddResponseWithRsvpTable1772051899872';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TYPE "public"."Response_formtype_enum" RENAME TO "Response_formtype_enum_old"');
        await queryRunner.query('CREATE TYPE "public"."Response_formtype_enum" AS ENUM(\'APPLICATION\', \'LIABILITY_WAIVER\', \'PHOTO_RELEASE\', \'RSVP\')');
        await queryRunner.query('ALTER TABLE "Response" ALTER COLUMN "formType" TYPE "public"."Response_formtype_enum" USING "formType"::"text"::"public"."Response_formtype_enum"');
        await queryRunner.query('DROP TYPE "public"."Response_formtype_enum_old"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "public"."Response_formtype_enum_old" AS ENUM(\'APPLICATION\', \'LIABILITY_WAIVER\', \'PHOTO_RELEASE\')');
        await queryRunner.query('ALTER TABLE "Response" ALTER COLUMN "formType" TYPE "public"."Response_formtype_enum_old" USING "formType"::"text"::"public"."Response_formtype_enum_old"');
        await queryRunner.query('DROP TYPE "public"."Response_formtype_enum"');
        await queryRunner.query('ALTER TYPE "public"."Response_formtype_enum_old" RENAME TO "Response_formtype_enum"');
    }

}
