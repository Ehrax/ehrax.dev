import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultLocale, siteContent } from "~/data";

const resources = {
  en: { translation: siteContent.en },
} as const;

void i18next.use(initReactI18next).init({
  resources,
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  interpolation: { escapeValue: false },
  returnObjects: true,
});

export { i18next };
