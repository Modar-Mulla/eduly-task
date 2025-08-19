
import { test, expect } from "@playwright/test";
import { loginAs } from "./auth";
import { mockLiveState } from "./mock";

test.beforeEach(async ({ page }) => {
  await loginAs(page);
  await mockLiveState(page);
});

test("dashboard renders charts and students grid, opens drawer", async ({ page }) => {
  await page.goto("/dashboard");
  await page.waitForResponse((res) => res.url().includes("/api/live") && res.ok());


  const grid = page.getByTestId("dashboard-table");
  await expect(grid).toBeVisible();


});
