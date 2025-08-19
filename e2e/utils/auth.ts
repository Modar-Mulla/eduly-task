import { type Page } from "@playwright/test";

export async function loginAs(page: Page, user?: { id?: string; name?: string; email?: string }) {
  
  await page.addInitScript((u) => {
    localStorage.setItem("auth.user", JSON.stringify({
      id: u?.id ?? "me",
      name: u?.name ?? "Mero",
      email: u?.email ?? "mero@example.com",
    }));
    localStorage.setItem("auth.token", "mock-token");
  }, user ?? {});
}

export async function setLocaleCookie(page: Page, locale: "en" | "ar") {
  await page.context().addCookies([
    { name: "locale", value: locale, domain: "localhost", path: "/", httpOnly: false, secure: false, sameSite: "Lax" },
  ]);
}
