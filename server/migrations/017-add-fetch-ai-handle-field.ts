import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFetchAiHandleField1773810713413 implements MigrationInterface {
    name = '017AddFetchAiHandleField1773810713413';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "User" ADD "fetchAiHandle" text');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "User" DROP COLUMN "fetchAiHandle"');
    }

}
