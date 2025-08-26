import { test, expect } from "@playwright/test";

test("user login page loads", async ({ page }) => {
  const base = process.env.FRONTEND_URL || "http://localhost:5173";

  await page.goto(base + "/user/login");

  //check we are on right url
  await expect(page).toHaveURL(/\/user\/login$/);

  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});

test("redirects to home page after login", async ({ page }) => {
  const base = process.env.FRONTEND_URL || "http://localhost:5173";

  await page.goto(base + "/home");

  await expect(page).toHaveURL(/\/home$/);
  await expect(
    page.getByText(/searching for a room that suits/i)
  ).toBeVisible();
});
