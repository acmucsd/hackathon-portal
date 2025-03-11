/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventTable1741660841343 implements MigrationInterface {
  name = 'AddEventTable1741660841343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"public\".\"Event_type_enum\" AS ENUM('INFO', 'MAIN_EVENT', 'SOCIAL', 'WORKSHOP')",
    );
    await queryRunner.query(
      'CREATE TYPE "public"."Event_day_enum" AS ENUM(\'SATURDAY\', \'SUNDAY\')',
    );
    await queryRunner.query(
      'CREATE TABLE "Event" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."Event_type_enum" NOT NULL, "host" character varying NOT NULL, "location" character varying NOT NULL, "locationLink" character varying, "description" character varying NOT NULL, "day" "public"."Event_day_enum" NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "published" boolean NOT NULL, CONSTRAINT "PK_d75ba430ca8da12999007b930c5" PRIMARY KEY ("uuid"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "Event"');
    await queryRunner.query('DROP TYPE "public"."Event_day_enum"');
    await queryRunner.query('DROP TYPE "public"."Event_type_enum"');
  }
}
