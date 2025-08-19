"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { dictionaries, type Locale } from "./locales";

type Ctx = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  setLocale: (loc: Locale) => void;
};

const I18nContext = React.createContext<Ctx | null>(null);

const ltrCache = createCache({ key: "mui", stylisPlugins: [prefixer] });
const rtlCache = createCache({
  key: "mui-rtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export function I18nProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = React.useState<Locale>(initialLocale);
  const dir: "ltr" | "rtl" = locale === "ar" ? "rtl" : "ltr";
  const dict = dictionaries[locale];

  const t = React.useCallback((key: string) => dict[key] ?? key, [dict]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem("locale", locale);
      document.cookie = `locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {}
  }, [locale, dir]);

  const value = React.useMemo(
    () => ({ locale, dir, t, setLocale }),
    [locale, dir, t]
  );

  return (
    <I18nContext.Provider value={value}>
      <CacheProvider value={dir === "rtl" ? rtlCache : ltrCache}>
        {children}
      </CacheProvider>
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
}
