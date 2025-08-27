// tests/globalTeardown.js
import { sql } from "../../backend/config/db.js"; // adjust path if needed

async function globalTeardown() {
  console.log("[globalTeardown] Cleaning test database...");

  try {
    await sql`TRUNCATE TABLE images CASCADE`;
    await sql`TRUNCATE TABLE properties CASCADE`;

    await sql`TRUNCATE TABLE enquiries CASCADE`;

    // dont runcate seeded agency- will reuse

    console.log("[globalTeardown] Done.");
  } catch (err) {
    console.error("[globalTeardown] Error cleaning DB:", err);
  }
}

export default globalTeardown;
