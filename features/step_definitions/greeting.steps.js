const { Given, When, Then, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { clearGreetings, getLatestGreeting, closePool } = require("../../tests/db-client");

Given("the demo app is open", async function () {
  const title = this.page.locator("#title");
  await title.waitFor({ state: "visible" });
});

Given("the greetings table is empty", async function () {
  await clearGreetings();
});

When("I click the generate greeting button", async function () {
  await this.page.getByRole("button", { name: "Generate greeting" }).click();
});

When("I enter the name {string}", async function (name) {
  await this.page.locator("#name-input").fill(name);
});

Then("I should see the heading {string}", async function (expectedHeading) {
  await expect(this.page.locator("#title")).toHaveText(expectedHeading);
});

Then("I should see greeting output {string}", async function (expectedGreeting) {
  await expect(this.page.locator("#greeting-output")).toHaveText(expectedGreeting);
});

Then("the latest greeting in the database should have name {string}", async function (name) {
  const row = await getLatestGreeting();
  expect(row).not.toBeNull();
  expect(row.resolved_name).toBe(name);
  expect(row.greeting_text).toBe(`Hello, ${name}!`);
});

Then("the latest greeting in the database should be for a guest", async function () {
  const row = await getLatestGreeting();
  expect(row).not.toBeNull();
  expect(row.resolved_name).toBe("Guest");
  expect(row.greeting_text).toBe("Hello, Guest!");
});

AfterAll(async () => {
  await closePool();
});
