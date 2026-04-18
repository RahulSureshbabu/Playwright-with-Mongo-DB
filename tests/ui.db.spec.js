const { test, expect } = require("@playwright/test");
const { clearGreetings, getLatestGreeting, closePool } = require("./db-client");

test.describe.configure({ mode: "serial" });

test.beforeEach(async () => {
  await clearGreetings();
});

test.afterAll(async () => {
  await closePool();
});

test("TC-004 | saves personalized greeting to MySQL", async ({ page }) => {
  const testName = `Rahul-${Date.now()}`;

  await page.goto("/");
  await page.locator("#name-input").fill(testName);
  await page.getByRole("button", { name: "Generate greeting" }).click();
  await expect(page.locator("#greeting-output")).toHaveText(`Hello, ${testName}!`);

  const latest = await getLatestGreeting();
  expect(latest).not.toBeNull();
  expect(latest.name_input).toBe(testName);
  expect(latest.resolved_name).toBe(testName);
  expect(latest.greeting_text).toBe(`Hello, ${testName}!`);
});

test("TC-005 | saves guest greeting to MySQL", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Generate greeting" }).click();
  await expect(page.locator("#greeting-output")).toHaveText("Hello, Guest!");

  const latest = await getLatestGreeting();
  expect(latest).not.toBeNull();
  expect(latest.name_input).toBe("");
  expect(latest.resolved_name).toBe("Guest");
  expect(latest.greeting_text).toBe("Hello, Guest!");
});
