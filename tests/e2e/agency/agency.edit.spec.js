import { test, expect } from "@playwright/test";
import { resetTestDb } from "../../setup/reset-test-db";

// avoid concurrent writes

test.describe.configure({ mode: "serial" });
const base = process.env.FRONTEND_URL || "http://localhost:5173";

test.beforeEach(async () => {
  await resetTestDb();
});

async function loginAsAgent(page) {
  await page.goto(base + "/agencyLogin");

  await page.getByTestId("agency-name").fill("Test Agency");
  await page.getByTestId("agency-loginid").fill("testlogin");
  await page.getByTestId("agency-login-submit-desktop").click();

  await expect(page).toHaveURL(/\/agency\/dashboard/);
}

test.describe("agent can login and update agency details", () => {
  test("agnency can update their details", async ({ page }) => {
    await loginAsAgent(page);

    // enable E2E mode for test only inputs
    await page.evaluate(() => localStorage.setItem("E2E", "1"));

    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    // fill edit fields
    await page.getByTestId("agency-edit-name").fill("Test Agency Updated");
    await page.getByTestId("agency-edit-email").fill("new-email@test.com");
    await page.getByTestId("agency-edit-phone").fill("07123456789");
    await page
      .getByTestId("agency-edit-website")
      .fill("https://updated.example");

    // skip file upload just use url
    await page
      .getByTestId("agency-edit-logo-url")
      .fill("https://placehold.co/128x128");

    // wait for repsonse from api
    const save = page.waitForResponse(
      (res) =>
        res.url().includes("/api/agency/me") && res.request().method() === "PUT"
    );

    await page.getByTestId("agency-save").click();
    await save;

    // expect toast modal and close

    await expect(page).toHaveURL(/agency\/dashboard/); // if your onClose navigates back

    await expect(page.getByText("Welcome")).toBeVisible();
  });

  test("changes persist after reload", async ({ page }) => {
    await loginAsAgent(page);
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    // change name and save
    await page.getByTestId("agency-edit-name").fill("Persist name");
    const save = page.waitForResponse(
      (res) =>
        res.url().includes("/api/agency/me") && res.request().method() === "PUT"
    );
    await page.getByTestId("agency-save").click();
    await save;

    // ensure back on dashboard
    await expect(page).toHaveURL(/agency\/dashboard/);

    await page.reload({ waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("agency-name-display")).toHaveText(
      /persist name/i
    );
  });

  test("sends minimal, correct payload", async ({ page }) => {
    await loginAsAgent(page);
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    const [put] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().includes("/api/agency/me") && r.request().method() === "PUT"
      ),
      page
        .getByTestId("agency-edit-phone")
        .fill("07000000000")
        .then(() => page.getByTestId("agency-save").click()),
    ]);
    const payload = JSON.parse(put.request().postData() || "{}");
    expect(payload.phone).toBe("07000000000");
  });

  test("email must be valid", async ({ page }) => {
    await loginAsAgent(page);
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    await page.getByTestId("agency-edit-email").fill("not-an-email");
    await page.getByTestId("agency-save").click();
    await expect(page.getByTestId("toast-invalid-email")).toBeVisible();

    await page.getByTestId("agency-edit-email").fill("ok@example.com");
    await page.getByTestId("agency-save").click();
    await expect(page).toHaveURL(/agency\/dashboard/);
  });
});
