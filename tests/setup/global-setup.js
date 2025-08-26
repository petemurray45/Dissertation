import { request } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { pathToFileURL } from "url";
import { seedTestData } from "./seed-test-db";

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";

const TEST_USER = {
  name: "Test User",
  email: "testuser@example.com",
  password: "password123",
};

async function globalSetup() {
  const requestContext = await request.newContext();

  try {
    const registerResponse = await requestContext.post(
      `${BACKEND_URL}/api/auth/register`,
      {
        data: {
          ...TEST_USER,
        },
      }
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
  const token = loginBody?.token;
  if (!token) throw new Error("Login response missing token");

  const storageState = {
    cookies: [],
    origins: [
      {
        origin: FRONTEND_ORIGIN,
        localStorage: [
          { name: "token", value: token },
          { name: "role", value: "user" },
        ],
      },
    ],
  };

  const outDir = path.join(process.cwd(), "tests", ".auth");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "storageState.json");
  fs.writeFileSync(outFile, JSON.stringify(storageState, null, 2), "utf-8");

  await requestContext.dispose();
  console.log(`[globalSetup] wrote ${outFile}`);

  // seed test db
  await seedTestData();
  console.log("[global setup] seeded test data");
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
