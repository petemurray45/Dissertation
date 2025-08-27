import { request } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import jwt from "jsonwebtoken";
import { pathToFileURL } from "url";
import { seedTestData } from "./seed-test-db.js";

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";

const TEST_USER = {
  name: "Test User",
  email: "testuser@example.com",
  password: "password123",
};

async function globalSetup() {
  // seed DB and get agencyId
  const { agencyId } = await seedTestData();
  console.log("[global setup] seeded test data with agencyId", agencyId);

  const requestContext = await request.newContext();

  // ensure test user exists
  try {
    const registerResponse = await requestContext.post(
      `${BACKEND_URL}/api/auth/register`,
      { data: { ...TEST_USER } }
    );
    if (!registerResponse.ok()) {
      const status = registerResponse.status();
      if (![400, 401, 409].includes(status)) {
        const body = await registerResponse.json().catch(() => ({}));
        throw new Error(
          `Register failed (${status}): ${
            body?.error || body?.message || registerResponse.statusText()
          }`
        );
      }
    }
  } catch (e) {
    console.warn("[globalSetup] register warning:", e.message);
  }

  // login user to get token
  const loginRes = await requestContext.post(`${BACKEND_URL}/api/auth/login`, {
    data: { email: TEST_USER.email, password: TEST_USER.password },
  });
  if (!loginRes.ok()) {
    const body = await loginRes.json().catch(() => ({}));
    throw new Error(
      `Login failed: ${loginRes.status()} ${
        body?.error || body?.message || loginRes.statusText()
      }`
    );
  }
  const loginBody = await loginRes.json();
  const userToken = loginBody?.token;
  if (!userToken) throw new Error("Login response missing token");

  //creating an agent token (signed same as backend)
  if (!agencyId) throw new Error("Missing agencyId from seeder");
  if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET");
  const agencyToken = jwt.sign(
    { role: "agent", agencyId, agency_id: agencyId, id: agencyId },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  // both storage states
  const outDir = path.join(process.cwd(), "tests", ".auth");
  fs.mkdirSync(outDir, { recursive: true });

  const writeStorage = (file, token, role) => {
    const storage = {
      cookies: [],
      origins: [
        {
          origin: FRONTEND_ORIGIN,
          localStorage: [
            { name: "token", value: token },
            { name: "role", value: role },
            { name: "E2E", value: "1" },
          ],
        },
      ],
    };
    fs.writeFileSync(file, JSON.stringify(storage, null, 2), "utf-8");
    console.log(`[globalSetup] wrote ${file}`);
  };

  writeStorage(path.join(outDir, "storageState.json"), userToken, "user");
  writeStorage(path.join(outDir, "agentStorage.json"), agencyToken, "agent");

  await requestContext.dispose();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  globalSetup()
    .then(() => {
      console.log("[globalSetup] completed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("[globalSetup] failed:", err);
      process.exit(1);
    });
}

export default globalSetup;
