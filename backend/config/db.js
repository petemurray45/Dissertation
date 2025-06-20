import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

// database connection variables
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// creates a SQL connection using env variables
export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);

// this sql function we export is used as a tagged template literal which allows us to write sql queries safely
