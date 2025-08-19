import { test, expect } from "@playwright/test";
import { setLocaleCookie } from "./auth";

test("unauthenticated /profile redirects to /login", async ({ page }) => {

  await setLocaleCookie(page, "en");


  await page.addInitScript(() => {
    localStorage.removeItem("auth.user");
    localStorage.removeItem("auth.token");
  });

  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login(\?next=.*)?$/);


  await expect(page.getByTestId("login-title")).toBeVisible();
});