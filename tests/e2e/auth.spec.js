import { test, expect } from "@playwright/test";

const base = process.env.FRONTEND_URL || "http://localhost:5173";

const PROTECTED = [
  { path: "/profile", expectedLogin: "/user/login", name: "User Home" },
  { path: "/admin", expectedLogin: "/admin/login", name: "Admin Dashboard" },
  {
    path: "/agency/dashboard",
    expectedLogin: "/agencyLogin",
    name: "Agency Dashboard",
  },
  {
    path: "/agency/addproperty",
    expectedLogin: "/agencyLogin",
    name: "Agency Add Property",
  },
];

test.describe("Auth flows", () => {
  test("can register a new user", async ({ page }) => {
    await page.goto(base + "/user/login");

    await page.getByRole("button", { name: /sign up/i }).click();

    // fill form
    await page.getByPlaceholder("Enter full name").fill("Playwright TestUser");
    const uniqueEmail = `test_${Date.now()}@example.com`;
    await page.getByPlaceholder("Enter email").fill(uniqueEmail);
    await page.getByPlaceholder("Enter password").fill("password123");
    await page.getByPlaceholder("Confirm password").fill("password123");

    // submit sign up form
    await page.locator("#signup-form button[aria-label='Sign-in']").click();

    //expect redirect to home
    await expect(page).toHaveURL(/\/home$/);
    await expect(
      page.getByText(/searching for a room that suits/i)
    ).toBeVisible();
  });

  test("can login with existing user", async ({ page }) => {
    await page.goto(base + "/user/login");

    // fill login deets
    await page.getByPlaceholder("Enter email").fill("testuser@example.com");
    await page.getByPlaceholder("Enter password").fill("password123");

    //submit form
    await page.locator("#signin-form button[aria-label='Sign-in']").click();

    //expect redirect
    await expect(page).toHaveURL(/\/home$/);
    await expect(
      page.getByText(/searching for a room that suits/i)
    ).toBeVisible();
  });
});

test.describe("anonymous user redirects to correct login", () => {
  test.use({ storageState: null });

  for (const { path, expectedLogin, name } of PROTECTED) {
    test(`anonymous visiting ${name} -> ${expectedLogin}`, async ({ page }) => {
      await page.goto(base + path);
      await expect(page).toHaveURL(expectedLogin);
    });
  }
});
