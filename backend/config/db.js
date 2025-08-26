import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const isTest =
  process.env.NODE_ENV === "test" || process.env.ARQJET_ENV === "test";
const pre = isTest ? "TEST_" : "";

const PGHOST = process.env[`${pre}PGHOST`];
const PGDATABASE = process.env[`${pre}PGDATABASE`];
const PGUSER = process.env[`${pre}PGUSER`];
const PGPASSWORD = process.env[`${pre}PGPASSWORD`];

if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
  throw new Error(
    `Missing PG vars for ${isTest ? "TEST" : "default"} environment`
  );
}

console.log(
  `[DB] NODE_ENV=${process.env.NODE_ENV ?? "undefined"} -> using ${
    isTest ? "TEST_*" : "default"
  } vars: host=${PGHOST}, db=${PGDATABASE}`
);

export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);
