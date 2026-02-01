/* eslint-disable max-len */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInterestFormResponseTable1767825337145 implements MigrationInterface {
    name = 'AddInterestFormResponseTable1767825337145';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "InterestFormResponse" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fdbe32fcbeb288ac746f1da0707" UNIQUE ("email"), CONSTRAINT "PK_bc4d18432d1970781db7060d34c" PRIMARY KEY ("uuid"))');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "InterestFormResponse"');
    }

}
