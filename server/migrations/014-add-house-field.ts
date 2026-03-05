import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHouse1772695003690 implements MigrationInterface {
    name = 'AddHouse1772695003690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_74d66b28b8d7687c814b2f206c1"`);
        await queryRunner.query(`ALTER TABLE "ApplicationConfig" DROP CONSTRAINT "FK_application_config_updated_by"`);
        await queryRunner.query(`ALTER TABLE "ApplicationConfig" DROP CONSTRAINT "CHK_application_config_singleton"`);
        await queryRunner.query(`ALTER TABLE "Event" ADD "pointValue" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."User_house_enum" AS ENUM('GEISEL', 'SUN_GOD', 'RACCOON', 'TRITON', 'UNASSIGNED')`);
        await queryRunner.query(`ALTER TABLE "User" ADD "house" "public"."User_house_enum" NOT NULL DEFAULT 'UNASSIGNED'`);
        await queryRunner.query(`ALTER TABLE "User" ADD "points" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_bcb9839029a3ca11f5bdff06277" FOREIGN KEY ("lastDecisionUpdatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_bcb9839029a3ca11f5bdff06277"`);
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "points"`);
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "house"`);
        await queryRunner.query(`DROP TYPE "public"."User_house_enum"`);
        await queryRunner.query(`ALTER TABLE "Event" DROP COLUMN "pointValue"`);
        await queryRunner.query(`ALTER TABLE "ApplicationConfig" ADD CONSTRAINT "CHK_application_config_singleton" CHECK ((id = 1))`);
        await queryRunner.query(`ALTER TABLE "ApplicationConfig" ADD CONSTRAINT "FK_application_config_updated_by" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_74d66b28b8d7687c814b2f206c1" FOREIGN KEY ("lastDecisionUpdatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
