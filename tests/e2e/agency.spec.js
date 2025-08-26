import { test, expect } from "@playwright/test";

const base = process.env.FRONTEND_URL || "http://localhost:5173";

test.describe("agency dashboard", () => {
  // use agency token from global setup

  test.use({ storageState: "tests/.auth/agentStorage.json" });

  test("agent can add a new property", async ({ page }) => {
    await page.goto(base + "agency/dashboard");

    // click add property button
    await page.getByRole("button", { name: /add property/i }).click();

    //fill out form fields
    await page.getByTestId("prop-title").fill("E2E Test Property");
    await page.getByTestId("prop-price").fill("750");
    await page.getByTestId("prop-type").selectOption("Flat");
    await page.getByTestId("bed-type").selectOption("Double");
    await page.getByTestId("en-suite").selectOption("Yes");
    await page.getByTestId("wifi").selectOption("Yes");
    await page.getByTestId("pets").selectOption("No");
    await page.getByTestId("prop-location").fill("Manchester City Centre");

    // test friendly image url
    await page
      .getByTestId("prop-image-url")
      .fill("https://placehold.co/600x400");
    await page.getByTestId("add-image-url").click();

    // prop description
    await page
      .getByTestId("prop-description")
      .fill("Lovely test property for E2E runs.");

    // submit
    await page.getByTestId("submit-property").click();

    // wait for toast and navigation
    await expect(page.getByText(/property added/i)).toBeVisible();

    //esnure redirected back to dashboard
    await expect(page).toHaveURL(/agency\/dashboard/);
    await expect(page.getByText("E2E Test Property")).toBeVisible();
  });
});

test.describe("agency dashboard - negative cases", () => {
  test.use({ storageState: "tests/.auth/agentStorage.json" });

  test("cannot add a property without filling in all fields", async ({
    page,
  }) => {
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /add property/i }).click();

    const submit = page.getByTestId("submit-property");

    // completely empty fields means button should be disabled
    await expect(submit).toBeDisabled();

    //fill everything except location and ensure button still disabled
    await page.getByTestId("prop-title").fill("E2E Invalid - Missing Location");
    await page.getByTestId("prop-price").fill("800");
    await page.getByTestId("prop-type").selectOption("Flat");
    await page.getByTestId("bed-type").selectOption("Double");
    await page.getByTestId("en-suite").selectOption("Yes");
    await page.getByTestId("wifi").selectOption("Yes");
    await page.getByTestId("pets").selectOption("No");
    await page.getByTestId("prop-description").fill("Should remain disabled.");

    await expect(submit).toBeDisabled();

    // provide location (via test mode input) and button should become enabled
    await page.getByTestId("prop-location").fill("Manchester");
    await expect(submit).toBeEnabled();
  });

  test("price must be numeric, non umeric keeps button disabled", async ({
    page,
  }) => {
    await page.goto(base + "/agency/dashboard");
    await page.getByRole("button", { name: /add property/i }).click();

    const submit = page.getByTestId("submit-property");

    //fill required fields but ensure bad price
    await page.getByTestId("prop-title").fill("E2E Invalid – Bad Price");
    await page.getByTestId("prop-price").fill("eight hundred"); // non-numeric
    await page.getByTestId("prop-type").selectOption("Flat");
    await page.getByTestId("bed-type").selectOption("Double");
    await page.getByTestId("en-suite").selectOption("Yes");
    await page.getByTestId("wifi").selectOption("Yes");
    await page.getByTestId("pets").selectOption("No");
    await page.getByTestId("prop-location").fill("Leeds");
    await page.getByTestId("prop-description").fill("Invalid price test.");

    // modal converts on submit with casting via number() so this should leave button disabled as text field left as string
    await expect(submit).toBeDisabled();

    // fix price
    await page.getByTestId("prop-price").fill("800");
    await expect(submit).toBeEnabled();
  });
});
