import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SkylineLogo } from "./SkylineLogo";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { languageLabel, t } = useLocale();

  const isInternal = user?.role === "concierge" || user?.role === "inspector";
  const nav = isInternal
    ? []
    : [{ label: t("common.fleet"), to: "/#fleet" }];

  function signedInLabel() {
    if (user?.role === "concierge") return t("header.signedIn.concierge");
    if (user?.role === "inspector") return t("header.signedIn.inspector");
    return t("header.signedIn.customer");
  }

  return (
    <header className="sticky top-0 z-50 hairline-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center">
          <SkylineLogo />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.to}
              className="font-display text-xs uppercase tracking-wider-2 text-silver transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <span
            className="font-display text-[11px] uppercase tracking-wider-2 text-silver"
            aria-label={t("common.currentLanguage")}
          >
            {languageLabel}
          </span>
          {user ? (
            <button
              onClick={signOut}
              className="font-display text-xs uppercase tracking-wider-2 text-silver hover:text-foreground"
            >
              {signedInLabel()}
            </button>
          ) : (
            <Link
              to="/sign-in"
              className="font-display text-xs uppercase tracking-wider-2 text-silver hover:text-foreground"
            >
              {t("common.signIn")}
            </Link>
          )}
          {!isInternal && (
            <a
              href="/#booking"
              className="inline-flex items-center bg-foreground px-5 py-2.5 font-display text-xs uppercase tracking-wider-2 text-background transition-opacity hover:opacity-90"
            >
              {t("common.reserve")}
            </a>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label={t("common.toggleMenu")}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden hairline-t">
          <nav className="flex flex-col px-6 py-4">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.to}
                onClick={() => setOpen(false)}
                className="font-display py-3 text-sm uppercase tracking-wider-2 text-silver hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="py-3 text-left font-display text-sm uppercase tracking-wider-2 text-silver hover:text-foreground"
              >
                {t("common.signOut")}
              </button>
            ) : (
              <Link
                to="/sign-in"
                onClick={() => setOpen(false)}
                className="py-3 font-display text-sm uppercase tracking-wider-2 text-silver hover:text-foreground"
              >
                {t("common.signIn")}
              </Link>
            )}
            {!isInternal && (
              <a
                href="/#booking"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center justify-center bg-foreground px-5 py-3 font-display text-xs uppercase tracking-wider-2 text-background"
              >
                {t("common.reserve")}
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
