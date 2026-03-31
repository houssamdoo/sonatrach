CREATE TABLE "Accounts" (
    "Id" SERIAL PRIMARY KEY,
    "Owner" VARCHAR(255) NOT NULL,
    "Balance" NUMERIC(18, 2) NOT NULL
);

INSERT INTO "Accounts" ("Owner", "Balance") VALUES ('Amar', 1000.00);
INSERT INTO "Accounts" ("Owner", "Balance") VALUES ('Zoubir', 500.00);
INSERT INTO "Accounts" ("Owner", "Balance") VALUES ('Mounir', 7000.00);
INSERT INTO "Accounts" ("Owner", "Balance") VALUES ('Bouraya', 700000.00);
INSERT INTO "Accounts" ("Owner", "Balance") VALUES ('Serine', 5000.00);
