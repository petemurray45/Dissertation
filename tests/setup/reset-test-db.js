import dotenv from "dotenv";
dotenv.config({ override: true });

if (process.env.NODE_ENV !== "test") {
  process.env.NODE_ENV = "test";
}

import { sql } from "../../backend/config/db.js";
import { seedTestData } from "./seed-test-db.js";

export async function resetTestDb({ reseed = true } = {}) {
  await sql`BEGIN`;
  try {
    await sql`TRUNCATE TABLE images RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE enquiries RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE properties RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE agencies RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE admins RESTART IDENTITY CASCADE`;
    await sql`COMMIT`;
  } catch (err) {
    await sql`ROLLBACK`;
    throw err;
  }

  if (!reseed) return { agencyId: null, userId: null };

  const { agencyId, userId } = await seedTestData();
  return { agencyId, userId };
}

export default resetTestDb;
