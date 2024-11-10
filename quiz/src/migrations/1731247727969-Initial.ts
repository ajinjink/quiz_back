import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1731247727969 implements MigrationInterface {
    name = 'Initial1731247727969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("userID" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "createdList" text NOT NULL, "sharedList" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_80b95948dfff0967ce1b3e3ae1b" PRIMARY KEY ("userID"))`);
        await queryRunner.query(`CREATE TABLE "short_answer_quiz" ("id" SERIAL NOT NULL, "no" integer NOT NULL, "question" character varying NOT NULL, "answer" character varying NOT NULL, "quizSetID" integer NOT NULL, CONSTRAINT "PK_83a1f299f6cc77b87fc86e20817" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_set" ("setID" SERIAL NOT NULL, "title" character varying NOT NULL, "creator" character varying NOT NULL, "public" boolean NOT NULL, "quizType" character varying NOT NULL, "sharedList" text NOT NULL, "cnt" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_a371cf929ff6e89083c3679013b" PRIMARY KEY ("setID"))`);
        await queryRunner.query(`ALTER TABLE "short_answer_quiz" ADD CONSTRAINT "FK_e60be389ccf0d67690a12e7a5aa" FOREIGN KEY ("quizSetID") REFERENCES "quiz_set"("setID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "short_answer_quiz" DROP CONSTRAINT "FK_e60be389ccf0d67690a12e7a5aa"`);
        await queryRunner.query(`DROP TABLE "quiz_set"`);
        await queryRunner.query(`DROP TABLE "short_answer_quiz"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
