/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSuperAdminAccessType1771446551801 implements MigrationInterface {
    name = 'AddSuperAdminAccessType1771446551801';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TYPE "public"."User_accesstype_enum" RENAME TO "User_accesstype_enum_old"');
        await queryRunner.query('CREATE TYPE "public"."User_accesstype_enum" AS ENUM(\'RESTRICTED\', \'STANDARD\', \'MANAGER\', \'ADMIN\', \'SUPER_ADMIN\')');
        await queryRunner.query('ALTER TABLE "User" ALTER COLUMN "accessType" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "User" ALTER COLUMN "accessType" TYPE "public"."User_accesstype_enum" USING "accessType"::"text"::"public"."User_accesstype_enum"');
        await queryRunner.query('ALTER TABLE "User" ALTER COLUMN "accessType" SET DEFAULT \'STANDARD\'');
        await queryRunner.query('DROP TYPE "public"."User_accesstype_enum_old"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "public"."User_accesstype_enum_old" AS ENUM(\'RESTRICTED\', \'STANDARD\', \'MANAGER\', \'ADMIN\')');
        await queryRunner.query('ALTER TABLE "User" ALTER COLUMN "accessType" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "User" ALTER COLUMN "accessType" TYPE "public"."User_accesstype_enum_old" USING "accessType"::"text"::"public"."User_accesstype_enum_old"');
        await queryRunner.query('ALTER TABLE "User" ALTER COLUMN "accessType" SET DEFAULT \'STANDARD\'');
        await queryRunner.query('DROP TYPE "public"."User_accesstype_enum"');
        await queryRunner.query('ALTER TYPE "public"."User_accesstype_enum_old" RENAME TO "User_accesstype_enum"');
    }

}
