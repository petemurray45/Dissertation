import bcrypt from "bcrypt";
import { sql } from "../config/db.js";

async function main() {
  const username = process.argv[2];
  const email = process.argv[3];
  const password = process.argv[4];

  if (!username || !email || !password) {
    console.error("Missing key details");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  const rows =
    await sql`INSERT INTO admins (username, email, password_hash) VALUES (${username}, ${email}, ${hash}) ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
    RETURNING id, username, created_at`;

  console.log("Admin inserted", rows[0]);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed admin", err);
  process.exit(1);
});
