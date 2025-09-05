import dotenv from "dotenv";
dotenv.config();

process.env.NODE_ENV = "test";
import { resetTestDb } from "./reset-test-db.js";

export default async function () {
  await resetTestDb({ reseed: true });
}
