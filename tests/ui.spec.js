const { test, expect } = require("@playwright/test");

test("TC-001 | home page loads with heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Welcome to UI Test Sandbox" })).toBeVisible();
});

test("TC-002 | shows guest greeting when input is empty", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Generate greeting" }).click();
  await expect(page.locator("#greeting-output")).toHaveText("Hello, Guest!");
});

test("TC-003 | shows personalized greeting", async ({ page }) => {
  await page.goto("/");
  await page.locator("#name-input").fill("Rahul");
  await page.getByRole("button", { name: "Generate greeting" }).click();
  await expect(page.locator("#greeting-output")).toHaveText("Hello, Rahul!");
});
