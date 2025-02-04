/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApplicationDecisionField1738543800782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"public\".\"User_applicationdecision_enum\" AS ENUM('NO_DECISION', 'ACCEPT', 'REJECT', 'WAITLIST')",
    );
    await queryRunner.query(
      'ALTER TABLE "User" ADD "applicationDecision" "public"."User_applicationdecision_enum" NOT NULL DEFAULT \'NO_DECISION\'',
    );
    await queryRunner.query(
      'ALTER TYPE "public"."User_applicationstatus_enum" RENAME TO "User_applicationstatus_enum_old"',
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"User_applicationstatus_enum\" AS ENUM('NOT_SUBMITTED', 'SUBMITTED', 'WITHDRAWN', 'ACCEPTED', 'REJECTED', 'WAITLISTED', 'CONFIRMED')",
    );
    await queryRunner.query(
      'ALTER TABLE "User" ALTER COLUMN "applicationStatus" DROP DEFAULT',
    );
    await queryRunner.query(
      'ALTER TABLE "User" ALTER COLUMN "applicationStatus" TYPE "public"."User_applicationstatus_enum" USING "applicationStatus"::"text"::"public"."User_applicationstatus_enum"',
    );
    await queryRunner.query(
      'ALTER TABLE "User" ALTER COLUMN "applicationStatus" SET DEFAULT \'NOT_SUBMITTED\'',
    );
    await queryRunner.query(
      'DROP TYPE "public"."User_applicationstatus_enum_old"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"public\".\"User_applicationstatus_enum_old\" AS ENUM('NOT_SUBMITTED', 'SUBMITTED', 'WITHDRAWN', 'ACCEPTED', 'REJECTED', 'CONFIRMED')",
    );
    await queryRunner.query(
      'ALTER TABLE "User" ALTER COLUMN "applicationStatus" DROP DEFAULT',
    );
    await queryRunner.query(
      'ALTER TABLE "User" ALTER COLUMN "applicationStatus" TYPE "public"."User_applicationstatus_enum_old" USING "applicationStatus"::"text"::"public"."User_applicationstatus_enum_old"',
    );
    await queryRunner.query(
      'ALTER TABLE "User" ALTER COLUMN "applicationStatus" SET DEFAULT \'NOT_SUBMITTED\'',
    );
    await queryRunner.query('DROP TYPE "public"."User_applicationstatus_enum"');
    await queryRunner.query(
      'ALTER TYPE "public"."User_applicationstatus_enum_old" RENAME TO "User_applicationstatus_enum"',
    );
    await queryRunner.query(
      'ALTER TABLE "User" DROP COLUMN "applicationDecision"',
    );
    await queryRunner.query(
      'DROP TYPE "public"."User_applicationdecision_enum"',
    );
  }
}
