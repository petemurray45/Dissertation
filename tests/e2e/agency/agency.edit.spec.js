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

    const modal = page.getByTestId("agency-edit-modal");
    await expect(modal.getByTestId("toast-invalid-email")).toBeVisible();

    await page.getByTestId("agency-edit-email").fill("ok@example.com");
    await page.getByTestId("agency-save").click();
    await expect(modal.getByTestId("toast-agency-saved")).toBeVisible();
    await expect(page).toHaveURL(/agency\/dashboard/);
  });

  test("phone basic validation", async ({ page }) => {
    await loginAsAgent(page);
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    await page.getByTestId("agency-edit-phone").fill("12");
    await page.getByTestId("agency-save").click();

    const modal = page.getByTestId("agency-edit-modal");
    await expect(modal.getByTestId("toast-invalid-phone")).toBeVisible();

    // valid phone
    await page.getByTestId("agency-edit-phone").fill("07123 456-789");
    await page.getByTestId("agency-save").click();
    await expect(modal.getByTestId("toast-agency-saved")).toBeVisible();
    await expect(page).toHaveURL(/agency\/dashboard/);
  });

  test("website normalization", async ({ page }) => {
    await loginAsAgent(page);
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    await page.getByTestId("agency-edit-website").fill("updated.example");
    await page.getByTestId("agency-save").click();

    const modal = page.getByTestId("agency-edit-modal");
    await expect(modal.getByTestId("toast-agency-saved")).toBeVisible();

    await expect(page).toHaveURL(/agency\/dashboard/);
  });

  test("logo url can be set and removed", async ({ page }) => {
    await loginAsAgent(page);
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    const modal = page.getByTestId("agency-edit-modal");

    // set url and verify preview shows up inside the modal
    await modal
      .getByTestId("agency-edit-logo-url")
      .fill("https://placehold.co/64x64");
    await expect(modal.getByTestId("agency-logo-preview")).toBeVisible();

    const save = page.waitForResponse(
      (r) =>
        r.url().includes("/api/agency/me") && r.request().method() === "PUT"
    );
    await modal.getByTestId("agency-save").click();
    await expect(modal.getByTestId("toast-agency-saved")).toBeVisible();
    await save;
    await expect(page).toHaveURL(/agency\/dashboard/);

    // re open modal and ensure changes persisted
    await page.getByRole("button", { name: /edit agency/i }).click();
    const modal2 = page.getByTestId("agency-edit-modal");
    await expect(modal2.getByTestId("agency-logo-preview")).toBeVisible();

    // Remove logo and verify preview disappears (file/url inputs return)
    await modal2.getByTestId("agency-remove-logo").click();
    await expect(modal2.getByTestId("agency-edit-logo-url")).toBeVisible();
    await expect(modal2.getByTestId("agency-logo-preview")).toHaveCount(0);

    const save2 = page.waitForResponse(
      (r) =>
        r.url().includes("/api/agency/me") && r.request().method() === "PUT"
    );
    await modal2.getByTestId("agency-save").click();
    await expect(modal.getByTestId("toast-agency-saved")).toBeVisible();
    await save2;
    await expect(page).toHaveURL(/agency\/dashboard/);
  });

  test("can change login id (password)", async ({ page }) => {
    await loginAsAgent(page);
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    const modal = page.getByTestId("agency-edit-modal");

    await page.getByTestId("agency-current-loginid").fill("testlogin");
    await page.getByTestId("agency-new-loginid").fill("newSecret123");
    await page.getByTestId("agency-save").click();

    await expect(modal.getByTestId("toast-agency-saved")).toBeVisible();
    await expect(page).toHaveURL(/agency\/dashboard/);

    // log out and log in with new
    await page.goto(base + "/agencyLogin");
    await page.getByTestId("agency-name").fill("Test Agency");
    await page.getByTestId("agency-loginid").fill("newSecret123");
    await page.getByTestId("agency-login-submit-desktop").click();
    await expect(page).toHaveURL(/\/agency\/dashboard/);
  });

  test("wrong current login id blocked", async ({ page }) => {
    await loginAsAgent(page);
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    const modal = page.getByTestId("agency-edit-modal");

    await page.getByTestId("agency-current-loginid").fill("WRONG");
    await page.getByTestId("agency-new-loginid").fill("nope123");
    await page.getByTestId("agency-save").click();

    await expect(modal.getByTestId("toast-invalid-loginid")).toBeVisible();

    // still can login with old
    await page.goto(base + "/agencyLogin");
    await page.getByTestId("agency-name").fill("Test Agency");
    await page.getByTestId("agency-loginid").fill("testlogin");
    await page.getByTestId("agency-login-submit-desktop").click();
    await expect(page).toHaveURL(/\/agency\/dashboard/);
  });

  test("deletes after confirm hit, shows toast and redirects home", async ({
    page,
  }) => {
    await loginAsAgent(page);
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    const waitDelete = page.waitForResponse(
      (r) =>
        r.url().includes("/api/agency/me") && r.request().method() === "DELETE"
    );

    const modal = page.getByTestId("agency-edit-modal");

    page.once("dialog", (d) => d.accept());

    // Click Delete
    await page.getByTestId("agency-delete").click();
    await waitDelete;

    // You show the toast then navigate — assert both
    await expect(modal.getByTestId("toast-agency-deleted")).toBeVisible();
    await expect(page).toHaveURL(/\/home$/);
  });

  test("cancel confirm does not delete, stays on modal, no success toast", async ({
    page,
  }) => {
    await loginAsAgent(page);
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    page.once("dialog", (d) => d.dismiss());
    await page.getByTestId("agency-delete").click();

    await expect(page.getByTestId("agency-edit-modal")).toBeVisible();

    await expect(page.getByTestId("toast-agency-deleted")).toHaveCount(0);
  });

  test("back and close navigate correctly", async ({ page }) => {
    await loginAsAgent(page);
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /edit agency/i }).click();

    await page.getByTestId("agency-back").click();
    await expect(page).toHaveURL(/agency\/dashboard/);

    await page.getByRole("button", { name: /edit agency/i }).click();
    await page.getByTestId("agency-close").click();
    await expect(page).toHaveURL(/agency\/dashboard/);
  });
});
