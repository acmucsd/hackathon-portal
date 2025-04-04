/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttendanceTable1743796145133 implements MigrationInterface {
    name = 'AddAttendanceTable1743796145133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Attendance" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" character varying, "eventUuid" uuid, CONSTRAINT "PK_9cc5f217882d48fb0a4f3f94203" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "Attendance" ADD CONSTRAINT "FK_662f0968ac6febc10772f3329a0" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Attendance" ADD CONSTRAINT "FK_eb327d0a601f36c271fe214ddeb" FOREIGN KEY ("eventUuid") REFERENCES "Event"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Attendance" DROP CONSTRAINT "FK_eb327d0a601f36c271fe214ddeb"`);
        await queryRunner.query(`ALTER TABLE "Attendance" DROP CONSTRAINT "FK_662f0968ac6febc10772f3329a0"`);
        await queryRunner.query(`DROP TABLE "Attendance"`);
    }

}
