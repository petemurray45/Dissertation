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

test.describe("Agency edit seeded properties", () => {
  test("edit first property, verify initial booleans, PUT payload, redirect and UI persistence", async ({
    page,
  }) => {
    await loginAsAgent(page);

    const card = page.getByTestId("property-card-1");
    await card.getByTestId("tile-select").click();

    // open the edit page for the property

    await expect(page).toHaveURL(/\/agency\/editproperty\/\d+$/);
    await expect(page.getByText("Edit Property")).toBeVisible();

    // initial values reflect the first property seeded to database
    await expect(page.getByTestId("prop-type")).toHaveValue("Flat");
    await expect(page.getByTestId("bed-type")).toHaveValue("Double");
    await expect(page.getByTestId("en-suite")).toHaveValue("true");
    await expect(page.getByTestId("wifi")).toHaveValue("true");
    await expect(page.getByTestId("pets")).toHaveValue("false");

    //make edits
    await page.getByTestId("prop-title").fill("Edited Seeded Title");
    await page.getByTestId("prop-price").fill("888");
    await page.getByTestId("prop-type").selectOption({ label: "Detached" });
    await page.getByTestId("bed-type").selectOption({ label: "King" });

    // change booleans
    await page.getByTestId("en-suite").selectOption({ value: "false" });
    await page.getByTestId("wifi").selectOption({ value: "false" });
    await page.getByTestId("pets").selectOption({ value: "true" });

    // check outgoing PUT payload and toast
    const put = page.waitForResponse(
      (r) =>
        /\/api\/properties\/\d+$/.test(r.url()) &&
        r.request().method() === "PUT"
    );

    await page.getByTestId("submit-property").click();
    const putRes = await put;
    await expect(page.getByTestId("toast-prop-saved")).toBeVisible({
      timeout: 2000,
    });

    const payload = JSON.parse(putRes.request().postData() || "{}");
    expect(payload.title).toBe("Edited Seeded Title");
    expect(payload.price_per_month).toBe(888); // number
    expect(payload.propertyType).toBe("Detached");
    expect(payload.bedType).toBe("King");
    expect(typeof payload.ensuite).toBe("boolean");
    expect(typeof payload.wifi).toBe("boolean");
    expect(typeof payload.pets).toBe("boolean");
    expect(payload.ensuite).toBe(false);
    expect(payload.wifi).toBe(false);
    expect(payload.pets).toBe(true);

    // redirect to dashboard works
    await expect(page).toHaveURL(/\/agency\/dashboard/);

    // ensure edited title appears on card
    await expect(
      page.getByRole("heading", { name: "Edited Seeded Title", level: 2 })
    ).toBeVisible();
  });

  /*

  test("remove an image an ensure payload recognises", async ({ page }) => {
    await loginAsAgent(page);
    const card = page.getByTestId("property-card-1");
    await card.getByTestId("tile-select").click();

    // open the edit page for the property

    await expect(page).toHaveURL(/\/agency\/editproperty\/\d+$/);
    await expect(page.getByText("Edit Property")).toBeVisible();

    // get images src length before delete
    const before = await page.locator('img[alt^="Property Image"]').all();
    expect(before.length).toBeGreaterThan(0);
    const firstSrc = await before[0].getAttribute("src");

    // click x on first image
    await page.locator('button:has-text("X")').first().click();

    // get new length
    const afterCount = await page.locator('img[alt^="Property Image"]').count();
    expect(afterCount).toBe(before.length - 1);

    const put = page.waitForResponse(
      (r) =>
        /\/api\/properties\/\d+$/.test(r.url()) &&
        r.request().method() === "PUT"
    );

    await page.getByTestId("submit-property").click();

    const putRes = await put;

    await expect(page.getByTestId("toast-prop-saved")).toBeVisible({
      timeout: 2000,
    });
    const payload = JSON.parse(putRes.request().postData() || "{}");

    if (Array.isArray(payload.images)) {
      expect(payload.images).not.toContain(firstSrc);
    }
  });

  */

  test("validation - invalid price keeps submit disabled", async ({ page }) => {
    await loginAsAgent(page);

    const card = page.getByTestId("property-card-1");
    await card.getByTestId("tile-select").click();

    // open the edit page for the property

    await expect(page).toHaveURL(/\/agency\/editproperty\/\d+$/);
    await expect(page.getByText("Edit Property")).toBeVisible();

    const modal = page.getByTestId("agency-property-modal");

    // Set invalid price
    await modal.getByTestId("prop-price").fill("abc");

    // Submit should be disabled by price regex guard
    await expect(modal.getByTestId("submit-property")).toBeDisabled();
  });

  test("close without saving means no PUT sent and navigate back", async ({
    page,
  }) => {
    await loginAsAgent(page);

    const card = page.getByTestId("property-card-1");
    await card.getByTestId("tile-select").click();

    // open the edit page for the property

    await expect(page).toHaveURL(/\/agency\/editproperty\/\d+$/);
    await expect(page.getByText("Edit Property")).toBeVisible();

    let putCount = 0;
    page.on("request", (req) => {
      if (req.method() === "PUT" && /\/api\/properties\/\d+$/.test(req.url())) {
        putCount++;
      }
    });

    // Click Close (top-left close button provided by PropertyModal)
    await page.getByRole("button", { name: /^close$/i }).click();

    await expect(page).toHaveURL(/\/agency\/dashboard/);
    expect(putCount).toBe(0);
  });

  test("delete property: confirm dialog, DELETE request, redirect, card gone", async ({
    page,
  }) => {
    await loginAsAgent(page);

    const card = page.getByTestId("property-card-1");
    await card.getByTestId("tile-select").click();

    // open the edit page for the property

    await expect(page).toHaveURL(/\/agency\/editproperty\/\d+$/);
    await expect(page.getByText("Edit Property")).toBeVisible();

    // Intercept confirm dialog
    page.once("dialog", (dlg) => {
      expect(dlg.type()).toBe("confirm");
      dlg.accept();
    });

    const del = page.waitForResponse(
      (r) =>
        /\/api\/properties\/\d+$/.test(r.url()) &&
        r.request().method() === "DELETE"
    );

    await page.getByTestId("delete-property").click();

    await del;

    await expect(page.getByTestId("toast-delete")).toBeVisible({
      timeout: 2000,
    });

    await expect(page).toHaveURL(/\/agency\/dashboard/);

    // The original seeded title should no longer be present
    await expect(
      page.getByRole("heading", { name: "Sunny Double Room", level: 2 })
    ).toHaveCount(0);
  });
});
