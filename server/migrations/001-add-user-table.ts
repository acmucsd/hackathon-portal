/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTable1736321009503 implements MigrationInterface {
  name = 'UserAndResponseTables1736321009503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"public\".\"User_accesstype_enum\" AS ENUM('RESTRICTED', 'STANDARD', 'MANAGER', 'ADMIN')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"User_applicationstatus_enum\" AS ENUM('NOT_SUBMITTED', 'SUBMITTED', 'WITHDRAWN', 'ACCEPTED', 'REJECTED', 'CONFIRMED')",
    );
    await queryRunner.query(
      'CREATE TABLE "User" ("id" character varying NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "accessType" "public"."User_accesstype_enum" NOT NULL DEFAULT \'STANDARD\', "applicationStatus" "public"."User_applicationstatus_enum" NOT NULL DEFAULT \'NOT_SUBMITTED\', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "User"');
    await queryRunner.query('DROP TYPE "public"."User_applicationstatus_enum"');
    await queryRunner.query('DROP TYPE "public"."User_accesstype_enum"');
  }
}
