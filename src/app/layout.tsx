import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto, Cairo } from "next/font/google";
import { I18nProvider } from "@/shared-fe/i18n/useTranslation";
import { RootThemeProvider } from "@/shared-fe/theme/theme-provider";
import { AuthProvider } from "@/shared-fe/hooks/useAuth";
import Chrome from "@/components/chrome/chrome";

export const metadata: Metadata = {
  title: "Eduly",
  description: "Exam dashboard",
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const cairo = Cairo({
  weight: ["400", "600", "700"],
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const initialLocale =
    ((await cookieStore).get("locale")?.value as "en" | "ar") ?? "en";
  const dir = initialLocale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={initialLocale}
      dir={dir}
      className={`${roboto.variable} ${cairo.variable}`}
    >
      <body>
        <AppRouterCacheProvider>
          <I18nProvider initialLocale={initialLocale}>
            <RootThemeProvider>
              <AuthProvider>
                <Chrome>{children}</Chrome>
              </AuthProvider>
            </RootThemeProvider>
          </I18nProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
