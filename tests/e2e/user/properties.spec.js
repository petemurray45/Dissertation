import { test, expect } from "@playwright/test";
import { resetTestDb } from "../../setup/reset-test-db.js";

test.describe.configure({ mode: "serial" });

const base = process.env.FRONTEND_URL || "http://localhost:5173";

test.beforeEach(async () => {
  await resetTestDb();
});

export async function loginAsUser(page) {
  await page.goto(base + "/user/login");

  await page.getByTestId("user-email").fill("testuser@example.com");
  await page.getByTestId("user-password").fill("password123");
  await page.getByTestId("user-login-submit").click();

  await expect(page).toHaveURL(/\/home/);
}

test.describe("Properties list", () => {
  test("shows property tiles on home", async ({ page }) => {
    await page.goto(base + "/home");
    const tile = page.getByRole("img");
    await expect(tile.first()).toBeVisible();
  });

  test("tile view button opens property details", async ({ page }) => {
    await page.goto(base + "/home");
    const firstTile = page.locator("[data-testid='property-tile']").first();
    await firstTile.getByRole("button", { name: /view/i }).click();
    await expect(page).toHaveURL(/\/properties\/\d+$/);

    // basic page assertions
    await expect(page.getByRole("heading", { name: /£/i })).toBeVisible();
  });

  test("tile carousel next/prev changes image on show", async ({ page }) => {
    await page.goto(base + "/properties");

    // wait until property tiles render
    await page.locator('[data-testid="property-tile"]').first().waitFor();

    // pick a tile that is marked as having multiple images
    const tile = page
      .locator('[data-testid="property-tile"][data-has-multi="true"]')
      .first();

    // if no tile has multiple images test doesnt apply
    if ((await tile.count()) === 0) {
      test.skip(true, "No tiles with multiple images available on this page");
    }

    const image = tile.locator("img").first();
    const nextBtn = tile.locator('[data-testid="next-image"]');
    const prevBtn = tile.locator('[data-testid="previous-image"]');

    const src1 = await image.getAttribute("src");

    await nextBtn.click();
    await expect.poll(async () => image.getAttribute("src")).not.toBe(src1);

    await prevBtn.click();
    await expect.poll(async () => image.getAttribute("src")).toBe(src1);
  });

  test("like button toggles", async ({ page }) => {
    await page.goto(base + "/home");

    const tile = page.locator("[data-testid='property-tile']").first();
    const likeButton = tile
      .getByRole("button", { name: /like/i })
      .or(tile.locator("[data-testid='like-button']"));

    await likeButton.waitFor({ state: "visible" });

    // filled heart appears --- button becomes unlike
    await likeButton.click();
    await expect(tile.locator("[data-testid='liked-icon']")).toBeVisible();
    await expect(likeButton).toHaveAccessibleName(/unlike/i);

    await likeButton.click();
    await expect(tile.locator("[data-testid='liked-icon']")).toBeHidden();
    await expect(tile.locator("[data-testid='unliked-icon']")).toBeVisible();
    await expect(likeButton).toHaveAccessibleName(/like/i);
  });
});

/// test pagination
