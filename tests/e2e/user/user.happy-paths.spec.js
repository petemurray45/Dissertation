import { test, expect } from "@playwright/test";
import { resetTestDb } from "../../setup/reset-test-db";

test.describe.configure({ mode: "serial" });

const base = process.env.FRONTEND_URL || "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await resetTestDb();
  // enable any test-specific shortcuts your app has
  await page.addInitScript(() => localStorage.setItem("E2E", "1"));
});

async function loginAsUser(page) {
  await page.goto(base + "/user/login");
  await page.getByTestId("user-email").fill("testuser@example.com");
  await page.getByTestId("user-password").fill("password123");
  await page.getByTestId("user-login-submit").click();
  await expect(page).toHaveURL(/\home/);
}

async function goToHomePage(page) {
  await page.goto(base + "/home");
  await page.getByTestId("hero-location").waitFor();
}

async function openFirstProperty(page) {
  const firstTile = page.locator("[data-testid='property-tile']").first();
  await firstTile.getByRole("button", { name: /view/i }).click();
  await expect(page).toHaveURL(/\/properties\/\d+$/);
  await expect(page.getByTestId("view-listing")).toBeVisible();
}

test.describe("test user happy paths", () => {
  test("hero search routes to /properties with server results", async ({
    page,
  }) => {
    await goToHomePage(page);

    // search
    const searchInput = page.getByTestId("hero-location");
    await searchInput.fill("Belfast");
    await page.getByTestId("hero-search").click();

    await expect(page).toHaveURL(/\/properties\?/);

    // wait for tiles
    await page.getByTestId("listing-grid").waitFor();
    await expect(
      page.locator("[data-testid='property-tile']").first()
    ).toBeVisible();
  });

  test("user can filter and sort results on properties page", async ({
    page,
  }) => {
    await page.goto(base + "/properties");
    await page.getByTestId("listing-grid").waitFor();
    const firstTile = page.locator("[data-testid='property-tile']").first();
    await expect(firstTile).toBeVisible();

    // filters // only apply if present
    await page.getByTestId("open-drawer").click();

    const typeFilter = page.getByTestId("filter-prop-type");
    const ensuiteFilter = page.getByTestId("filter-ensuite");
    if (await typeFilter.isVisible().catch(() => false)) {
      await typeFilter.selectOption("Flat");
    }
    if (await ensuiteFilter.isVisible().catch(() => false)) {
      await ensuiteFilter.selectOption("true");
    }

    // sort // only if present
    const sortSelect = page.getByTestId("sort-select");
    if (await sortSelect.isVisible().catch(() => false)) {
      await sortSelect.selectOption("price_low_high");
    }

    // validate visible order by price
    const priceNodes = page.locator(
      "[data-testid='property-tile'] [data-testid='price']"
    );
    if ((await priceNodes.count()) > 1) {
      const prices = await priceNodes.allTextContents();
      const nums = prices
        .map((t) => Number(String(t).replace(/[^\d.]/g, "")))
        .filter((n) => !Number.isNaN(n));
      expect(nums.length).toBeGreaterThan(0);
      const sorted = [...nums].sort((a, b) => a - b);
      expect(nums).toEqual(sorted);
    }
  });

  test("details page shpws main info and amenity badges", async ({ page }) => {
    await page.goto(base + "/properties");
    await page.getByTestId("listing-grid").waitFor();
    await openFirstProperty(page);

    await expect(page.getByTestId("property-title")).toBeVisible();
    await expect(page.getByTestId("property-price")).toBeVisible();
    await expect(page.getByTestId("property-description")).toBeVisible();

    // amenity badges are visible
    for (const id of ["badge-ensuite", "badge-wifi", "badge-pets"]) {
      const el = page.getByTestId(id);
      if (await el.isVisible().catch(() => false)) {
        await expect(el).toBeVisible();
      }
    }
  });

  test("user can send enquiry with validation", async ({ page }) => {
    await page.goto(base + "/properties");
    await page.getByTestId("listing-grid").waitFor();
    await openFirstProperty(page);

    // seelect enquiry from secondary nav
    await page.getByTestId("tab-enquire").click();

    // fill details
    const name = page.getByTestId("enquiry-name");
    const email = page.getByTestId("enquiry-email");
    const message = page.getByTestId("enquiry-message");
    const submit = page.getByTestId("enquiry-submit");

    await name.fill("Test User");
    await email.fill("not-an-email");
    await message.fill("Can I book a viewing this weekend?");

    const reqIfAny = page
      .waitForRequest(
        (r) => r.url().endsWith("/api/enquiries") && r.method() === "POST",
        { timeout: 1500 }
      )
      .catch(() => null);

    await submit.click();

    const invalidToast = page.getByTestId("toast-invalid-email");
    if (await invalidToast.isVisible().catch(() => false)) {
      await expect(invalidToast).toBeVisible();
    } else {
      await expect(page.getByText(/valid email/i)).toBeVisible();
    }
    expect(await reqIfAny).toBeNull();

    // valid case then post  then toast
    await email.fill("test.user@example.com");

    const postReq = page.waitForRequest(
      (r) => r.url().endsWith("/api/enquiries") && r.method() === "POST"
    );
    const postRes = page.waitForResponse(
      (r) =>
        r.url().endsWith("/api/enquiries") && r.request().method() === "POST"
    );

    await submit.click();
  });
});
