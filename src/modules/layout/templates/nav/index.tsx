import { listRegions } from "@lib/data/regions";
import { getDictionary } from "@lib/i18n/get-dictionary";
import { Locale } from "@lib/i18n/config";
import type { StoreRegion } from "@medusajs/types";
import Header from "@modules/layout/components/Header";

interface NavProps {
  params: {
    locale: Locale;
  };
}

export default async function Nav({ params }: NavProps) {
  const regions: StoreRegion[] = await listRegions();
  const dictionary = await getDictionary(params.locale);

  const navItems = [
    { path: "/", key: "home" },
    { path: "/store", key: "shop" },
    { path: "/contact", key: "contact" },
  ];

  return <Header navItems={navItems} regions={regions} dictionary={dictionary} />;
}
