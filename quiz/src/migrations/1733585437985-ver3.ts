import { MigrationInterface, QueryRunner } from "typeorm";

export class Ver31733585437985 implements MigrationInterface {
    name = 'Ver31733585437985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_set" ADD "department" character varying`);
        await queryRunner.query(`ALTER TABLE "quiz_set" ALTER COLUMN "university" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quiz_set" ALTER COLUMN "book" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_set" ALTER COLUMN "book" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quiz_set" ALTER COLUMN "university" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quiz_set" DROP COLUMN "department"`);
    }

}
