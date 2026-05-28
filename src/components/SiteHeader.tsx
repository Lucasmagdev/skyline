import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SkylineLogo } from "./SkylineLogo";
import { Menu, X } from "lucide-react";

const nav = [
  { label: "Fleet", to: "/" },
  { label: "Maintenance", to: "/maintenance" },
  { label: "Admin", to: "/admin" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "PT">("EN");

  return (
    <header className="sticky top-0 z-50 hairline-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center">
          <SkylineLogo />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="font-display text-xs uppercase tracking-wider-2 text-silver transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setLang(lang === "EN" ? "PT" : "EN")}
            className="font-display text-[11px] uppercase tracking-wider-2 text-silver hover:text-foreground"
            aria-label="Toggle language"
          >
            {lang} <span className="text-foreground/30 mx-1">/</span>{" "}
            <span className="text-foreground/30">{lang === "EN" ? "PT" : "EN"}</span>
          </button>
          <Link
            to="/"
            className="font-display text-xs uppercase tracking-wider-2 text-silver hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/"
            className="inline-flex items-center bg-foreground px-5 py-2.5 font-display text-xs uppercase tracking-wider-2 text-background transition-opacity hover:opacity-90"
          >
            Reserve
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden hairline-t">
          <nav className="flex flex-col px-6 py-4">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="font-display py-3 text-sm uppercase tracking-wider-2 text-silver hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/"
              className="mt-3 inline-flex items-center justify-center bg-foreground px-5 py-3 font-display text-xs uppercase tracking-wider-2 text-background"
            >
              Reserve
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
