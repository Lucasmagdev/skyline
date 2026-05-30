import { useLocale } from "@/contexts/LocaleContext";
import { SkylineLogo } from "./SkylineLogo";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="hairline-t bg-background mt-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <SkylineLogo />
            <p className="mt-6 text-sm text-silver leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>
          </div>
          {[
            {
              title: t("common.fleet"),
              links: [
                { label: t("common.category.sport"), href: "/#fleet" },
                { label: t("common.category.suv"), href: "/#fleet" },
                { label: t("common.category.electric"), href: "/#fleet" },
                { label: t("common.category.supercar"), href: "/#fleet" },
              ],
            },
            {
              title: t("footer.company"),
              links: [
                { label: t("common.admin"), href: "/admin" },
                { label: t("common.maintenance"), href: "/maintenance" },
                { label: t("footer.membership"), href: "mailto:concierge@skyline.example" },
                { label: t("footer.contact"), href: "mailto:concierge@skyline.example" },
              ],
            },
            {
              title: t("footer.legal"),
              links: [
                {
                  label: t("footer.terms"),
                  href: "mailto:concierge@skyline.example?subject=Terms",
                },
                {
                  label: t("footer.privacy"),
                  href: "mailto:concierge@skyline.example?subject=Privacy",
                },
                { label: t("footer.insurance"), href: "/#booking" },
                { label: t("footer.compliance"), href: "/admin" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-xs uppercase tracking-wider-2 text-foreground">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="text-sm text-silver hover:text-foreground transition-colors"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="hairline-t mt-16 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-silver/60 font-display tracking-wider-2 uppercase">
            © {new Date().getFullYear()} Skyline Car Rental - {t("footer.rights")}
          </p>
          <p className="text-xs text-silver/60 font-display tracking-wider-2 uppercase">
            {t("footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
