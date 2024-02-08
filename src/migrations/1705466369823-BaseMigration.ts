import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseMigration1705466369823 implements MigrationInterface {
  name = 'BaseMigration1705466369823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(200) NOT NULL, "balance" decimal NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(200) NOT NULL, "cpf" varchar(200) NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "userCreatorId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "proposals" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "profit" decimal NOT NULL DEFAULT (0), "status" varchar NOT NULL DEFAULT ('PENDING'), "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "userCreatorId" integer, "customerId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_customers" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(200) NOT NULL, "cpf" varchar(200) NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "userCreatorId" integer, CONSTRAINT "FK_a0932bb33d8608838ca02298f9a" FOREIGN KEY ("userCreatorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_customers"("id", "name", "cpf", "createdAt", "updatedAt", "userCreatorId") SELECT "id", "name", "cpf", "createdAt", "updatedAt", "userCreatorId" FROM "customers"`,
    );
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_customers" RENAME TO "customers"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_proposals" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "profit" decimal NOT NULL DEFAULT (0), "status" varchar NOT NULL DEFAULT ('PENDING'), "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "userCreatorId" integer, "customerId" integer, CONSTRAINT "FK_fab41ee39cbfbed10dbc12ca94a" FOREIGN KEY ("userCreatorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d86dfcf8793c8bd8a4af6bafa50" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_proposals"("id", "profit", "status", "createdAt", "updatedAt", "userCreatorId", "customerId") SELECT "id", "profit", "status", "createdAt", "updatedAt", "userCreatorId", "customerId" FROM "proposals"`,
    );
    await queryRunner.query(`DROP TABLE "proposals"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_proposals" RENAME TO "proposals"`,
    );

    const users = [
      {
        name: 'Mason Blackwood',
        balance: 1000,
        createdAt: new Date('2023-11-23T04:34:36'),
        updatedAt: new Date('2023-11-23T04:34:36'),
      },
      {
        name: 'Sierra Hartford',
        balance: 0,
        createdAt: new Date('2023-08-30T04:34:36'),
        updatedAt: new Date('2023-08-30T04:34:36'),
      },
      {
        name: 'Jasper Sterling',
        balance: 2400,
        createdAt: new Date('2023-04-14T04:34:36'),
        updatedAt: new Date('2023-04-14T04:34:36'),
      },
      {
        name: 'Ivy Easton',
        balance: 5000,
        createdAt: new Date('2019-12-18T04:34:36'),
        updatedAt: new Date('2019-12-18T04:34:36'),
      },
      {
        name: 'Griffin Wilder',
        balance: 934,
        createdAt: new Date('2020-03-20T04:34:36'),
        updatedAt: new Date('2020-03-20T04:34:36'),
      },
    ];

    for (const user of users) {
      await queryRunner.query(
        `INSERT INTO users (name, balance, "createdAt", "updatedAt") VALUES ('${user.name}', ${user.balance}, '${user.createdAt}', '${user.updatedAt}')`,
      );
    }

    const customers = [
      {
        userCreatorId: 1,
        name: 'Emily Johnson',
        cpf: '12345678900',
        createdAt: new Date('2022-01-15T08:00:00'),
        updatedAt: new Date('2022-01-15T08:00:00'),
      },
      {
        userCreatorId: 1,
        name: 'James Smith',
        cpf: '98765432100',
        createdAt: new Date('2022-01-14T12:30:00'),
        updatedAt: new Date('2022-01-14T12:30:00'),
      },
      {
        userCreatorId: 1,
        name: 'Olivia Davis',
        cpf: '55555555500',
        createdAt: new Date('2022-01-01T19:20:00'),
        updatedAt: new Date('2022-01-01T19:20:00'),
      },
      {
        userCreatorId: 2,
        name: 'Sophia Wilson',
        cpf: '11111111100',
        createdAt: new Date('2022-01-15T08:00:00'),
        updatedAt: new Date('2022-01-15T08:00:00'),
      },
      {
        userCreatorId: 2,
        name: 'Noah Martin',
        cpf: '77777777700',
        createdAt: new Date('2022-01-14T12:30:00'),
        updatedAt: new Date('2022-01-14T12:30:00'),
      },
      {
        userCreatorId: 2,
        name: 'Mia Rodriguez',
        cpf: '22222222200',
        createdAt: new Date('2022-01-01T19:20:00'),
        updatedAt: new Date('2022-01-01T19:20:00'),
      },
      {
        userCreatorId: 3,
        name: 'William Anderson',
        cpf: '88888888800',
        createdAt: new Date('2022-01-15T08:00:00'),
        updatedAt: new Date('2022-01-15T08:00:00'),
      },
      {
        userCreatorId: 3,
        name: 'Liam Brown',
        cpf: '33333333300',
        createdAt: new Date('2022-01-14T12:30:00'),
        updatedAt: new Date('2022-01-14T12:30:00'),
      },
      {
        userCreatorId: 3,
        name: 'Isabella Taylor',
        cpf: '99999999900',
        createdAt: new Date('2022-01-01T19:20:00'),
        updatedAt: new Date('2022-01-01T19:20:00'),
      },
      {
        userCreatorId: 4,
        name: 'Michael Garcia',
        cpf: '44444444400',
        createdAt: new Date('2022-01-15T08:00:00'),
        updatedAt: new Date('2022-01-15T08:00:00'),
      },
      {
        userCreatorId: 4,
        name: 'Ava Hernandez',
        cpf: '66666666600',
        createdAt: new Date('2022-01-14T12:30:00'),
        updatedAt: new Date('2022-01-14T12:30:00'),
      },
      {
        userCreatorId: 4,
        name: 'Emma Lopez',
        cpf: '55555555500',
        createdAt: new Date('2022-01-01T19:20:00'),
        updatedAt: new Date('2022-01-01T19:20:00'),
      },
      {
        userCreatorId: 5,
        name: 'Ethan Martinez',
        cpf: '77777777700',
        createdAt: new Date('2022-01-15T08:00:00'),
        updatedAt: new Date('2022-01-15T08:00:00'),
      },
      {
        userCreatorId: 5,
        name: 'Charlotte Jones',
        cpf: '44444444400',
        createdAt: new Date('2022-01-14T12:30:00'),
        updatedAt: new Date('2022-01-14T12:30:00'),
      },
      {
        userCreatorId: 5,
        name: 'Alexander White',
        cpf: '88888888800',
        createdAt: new Date('2022-01-01T19:20:00'),
        updatedAt: new Date('2022-01-01T19:20:00'),
      },
    ];

    for (const customer of customers) {
      await queryRunner.query(
        `INSERT INTO customers ("userCreatorId", name, cpf, "createdAt", "updatedAt") VALUES ('${customer.userCreatorId}', '${customer.name}', '${customer.cpf}', '${customer.createdAt}', '${customer.updatedAt}')`,
      );
    }

    const proposals = [
      {
        profit: 123,
        status: 'PENDING',
        userCreatorId: 1,
        customerId: 1,
        createdAt: new Date('2024-01-01T19:20:00'),
        updatedAt: new Date('2024-01-01T19:20:00'),
      },
      {
        profit: 456,
        status: 'SUCCESSFUL',
        userCreatorId: 2,
        customerId: 2,
        createdAt: new Date('2024-01-01T19:20:00'),
        updatedAt: new Date('2024-01-01T19:20:00'),
      },
      {
        profit: 789,
        status: 'REFUSED',
        userCreatorId: 3,
        customerId: 3,
        createdAt: new Date('2024-01-04T19:20:00'),
        updatedAt: new Date('2024-01-04T19:20:00'),
      },
      {
        profit: 234,
        status: 'ERROR',
        userCreatorId: 4,
        customerId: 4,
        createdAt: new Date('2024-01-14T07:20:00'),
        updatedAt: new Date('2024-01-14T07:20:00'),
      },
      {
        profit: 567,
        status: 'PENDING',
        userCreatorId: 5,
        customerId: 5,
        createdAt: new Date('2024-01-20T19:20:00'),
        updatedAt: new Date('2024-01-20T19:20:00'),
      },
      {
        profit: 890,
        status: 'PENDING',
        userCreatorId: 1,
        customerId: 6,
        createdAt: new Date('2024-01-13T21:20:00'),
        updatedAt: new Date('2024-01-13T21:20:00'),
      },
      {
        profit: 123,
        status: 'PENDING',
        userCreatorId: 2,
        customerId: 7,
        createdAt: new Date('2024-01-23T23:20:00'),
        updatedAt: new Date('2024-01-23T23:20:00'),
      },
      {
        profit: 456,
        status: 'SUCCESSFUL',
        userCreatorId: 3,
        customerId: 8,
        createdAt: new Date('2023-12-01T10:20:00'),
        updatedAt: new Date('2023-12-01T10:20:00'),
      },
      {
        profit: 789,
        status: 'REFUSED',
        userCreatorId: 4,
        customerId: 9,
        createdAt: new Date('2024-01-02T03:20:00'),
        updatedAt: new Date('2024-01-02T03:20:00'),
      },
      {
        profit: 234,
        status: 'ERROR',
        userCreatorId: 5,
        customerId: 10,
        createdAt: new Date('2024-01-05T07:20:00'),
        updatedAt: new Date('2024-01-05T07:20:00'),
      },
      {
        profit: 567,
        status: 'PENDING',
        userCreatorId: 1,
        customerId: 11,
        createdAt: new Date('2024-01-17T05:20:00'),
        updatedAt: new Date('2024-01-17T05:20:00'),
      },
      {
        profit: 890,
        status: 'PENDING',
        userCreatorId: 2,
        customerId: 12,
        createdAt: new Date('2024-01-20T03:20:00'),
        updatedAt: new Date('2024-01-20T03:20:00'),
      },
      {
        profit: 123,
        status: 'PENDING',
        userCreatorId: 3,
        customerId: 13,
        createdAt: new Date('2024-01-15T14:20:00'),
        updatedAt: new Date('2024-01-15T14:20:00'),
      },
      {
        profit: 456,
        status: 'SUCCESSFUL',
        userCreatorId: 4,
        customerId: 14,
        createdAt: new Date('2024-01-15T15:20:00'),
        updatedAt: new Date('2024-01-15T15:20:00'),
      },
      {
        profit: 789,
        status: 'REFUSED',
        userCreatorId: 5,
        customerId: 15,
        createdAt: new Date('2024-01-10T13:20:00'),
        updatedAt: new Date('2024-01-10T13:20:00'),
      },
    ];

    for (const proposal of proposals) {
      await queryRunner.query(
        `INSERT INTO proposals ("userCreatorId", "customerId", status, profit, "createdAt", "updatedAt") VALUES ('${proposal.userCreatorId}', '${proposal.customerId}', '${proposal.status}', ${proposal.profit}, '${proposal.createdAt}', '${proposal.updatedAt}')`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "proposals" RENAME TO "temporary_proposals"`,
    );
    await queryRunner.query(
      `CREATE TABLE "proposals" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "profit" decimal NOT NULL DEFAULT (0), "status" varchar NOT NULL DEFAULT ('PENDING'), "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "userCreatorId" integer, "customerId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "proposals"("id", "profit", "status", "createdAt", "updatedAt", "userCreatorId", "customerId") SELECT "id", "profit", "status", "createdAt", "updatedAt", "userCreatorId", "customerId" FROM "temporary_proposals"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_proposals"`);
    await queryRunner.query(
      `ALTER TABLE "customers" RENAME TO "temporary_customers"`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(200) NOT NULL, "cpf" varchar(200) NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "userCreatorId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "customers"("id", "name", "cpf", "createdAt", "updatedAt", "userCreatorId") SELECT "id", "name", "cpf", "createdAt", "updatedAt", "userCreatorId" FROM "temporary_customers"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_customers"`);
    await queryRunner.query(`DROP TABLE "proposals"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
