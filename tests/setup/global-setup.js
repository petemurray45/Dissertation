import { request } from "@playwright/test";
import fs from "fs";

async function globalSetup(config) {
  const requestContext = await request.newContext();
  const response = await requestContext.post(
    "http://localhost:5000/api/auth/login",
    {
      data: { email: "testuser@example.com", password: "password123" },
    }
  );

  const body = await response.json();
  if (!body.token) throw new Error("Login failed in global setup");

  fs.writeFileSync("tests/.auth/session.json", JSON.stringify(body));

  await requestContext.dispose();
}

export default globalSetup;
