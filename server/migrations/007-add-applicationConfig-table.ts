/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApplicationConfig1767587254964 implements MigrationInterface {
  name = 'AddApplicationConfig1767587254964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "ApplicationConfig" (
        "id" integer NOT NULL,
        "applicationsOpen" boolean NOT NULL DEFAULT false,
        "updatedBy" character varying,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_application_config" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_application_config_singleton" CHECK ("id" = 1),
        CONSTRAINT "FK_application_config_updated_by"
          FOREIGN KEY ("updatedBy") REFERENCES "User"("id")
      )
    `);

    // Insert the singleton row with default values
    await queryRunner.query(`
      INSERT INTO "ApplicationConfig"
        ("id", "applicationsOpen", "updatedBy", "updatedAt")
      VALUES
        (1, false, NULL, now())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ApplicationConfig"`);
  }
}