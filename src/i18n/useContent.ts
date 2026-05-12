import { useTranslation } from "react-i18next";
import type { SiteContent } from "~/schemas/siteContent";

export function useContent(): SiteContent {
  const { t } = useTranslation();
  return {
    nav: t("nav", { returnObjects: true }) as SiteContent["nav"],
    hero: t("hero", { returnObjects: true }) as SiteContent["hero"],
    about: t("about", { returnObjects: true }) as SiteContent["about"],
    work: t("work", { returnObjects: true }) as SiteContent["work"],
    contact: t("contact", { returnObjects: true }) as SiteContent["contact"],
  };
}
