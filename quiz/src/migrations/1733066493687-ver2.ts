import { MigrationInterface, QueryRunner } from "typeorm";

export class Ver21733066493687 implements MigrationInterface {
    name = 'Ver21733066493687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "short_answer_quiz" ("id" SERIAL NOT NULL, "no" integer NOT NULL, "question" character varying NOT NULL, "answer" character varying NOT NULL, "quizSetID" integer NOT NULL, CONSTRAINT "PK_83a1f299f6cc77b87fc86e20817" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_set_share" ("userId" uuid NOT NULL, "quizSetId" integer NOT NULL, CONSTRAINT "PK_fe310a1f32c8779430251980b2c" PRIMARY KEY ("userId", "quizSetId"))`);
        await queryRunner.query(`CREATE TABLE "quiz_attempt_history" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "quizSetId" integer NOT NULL, "lastAttemptDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d7cdd853450798753b972f0860" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_set" ("setID" SERIAL NOT NULL, "title" character varying NOT NULL, "creatorId" uuid NOT NULL, "public" boolean NOT NULL, "university" character varying NOT NULL, "subject" character varying NOT NULL, "book" character varying NOT NULL, "quizType" character varying NOT NULL, "cnt" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_a371cf929ff6e89083c3679013b" PRIMARY KEY ("setID"))`);
        await queryRunner.query(`CREATE TABLE "users" ("userID" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "university" character varying NOT NULL, "department" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_80b95948dfff0967ce1b3e3ae1b" PRIMARY KEY ("userID"))`);
        await queryRunner.query(`ALTER TABLE "short_answer_quiz" ADD CONSTRAINT "FK_e60be389ccf0d67690a12e7a5aa" FOREIGN KEY ("quizSetID") REFERENCES "quiz_set"("setID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_set_share" ADD CONSTRAINT "FK_0a69e4ceb37e882be960ad044ef" FOREIGN KEY ("userId") REFERENCES "users"("userID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_set_share" ADD CONSTRAINT "FK_82ad81c15df6a24074114336dca" FOREIGN KEY ("quizSetId") REFERENCES "quiz_set"("setID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_attempt_history" ADD CONSTRAINT "FK_d7b29c08297a1cd0ea5aed03c48" FOREIGN KEY ("userId") REFERENCES "users"("userID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_attempt_history" ADD CONSTRAINT "FK_a5723e6c6506fe134e34767c82e" FOREIGN KEY ("quizSetId") REFERENCES "quiz_set"("setID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_set" ADD CONSTRAINT "FK_c5214e966572030d3fa981da009" FOREIGN KEY ("creatorId") REFERENCES "users"("userID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_set" DROP CONSTRAINT "FK_c5214e966572030d3fa981da009"`);
        await queryRunner.query(`ALTER TABLE "quiz_attempt_history" DROP CONSTRAINT "FK_a5723e6c6506fe134e34767c82e"`);
        await queryRunner.query(`ALTER TABLE "quiz_attempt_history" DROP CONSTRAINT "FK_d7b29c08297a1cd0ea5aed03c48"`);
        await queryRunner.query(`ALTER TABLE "quiz_set_share" DROP CONSTRAINT "FK_82ad81c15df6a24074114336dca"`);
        await queryRunner.query(`ALTER TABLE "quiz_set_share" DROP CONSTRAINT "FK_0a69e4ceb37e882be960ad044ef"`);
        await queryRunner.query(`ALTER TABLE "short_answer_quiz" DROP CONSTRAINT "FK_e60be389ccf0d67690a12e7a5aa"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "quiz_set"`);
        await queryRunner.query(`DROP TABLE "quiz_attempt_history"`);
        await queryRunner.query(`DROP TABLE "quiz_set_share"`);
        await queryRunner.query(`DROP TABLE "short_answer_quiz"`);
    }

}
