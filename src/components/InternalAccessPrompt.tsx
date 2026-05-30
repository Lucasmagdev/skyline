import { Link } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import { useLocale } from "@/contexts/LocaleContext";
import { SiteHeader } from "./SiteHeader";

interface InternalAccessPromptProps {
  title: string;
  description: string;
  returnTo: string;
}

export function InternalAccessPrompt({ title, description, returnTo }: InternalAccessPromptProps) {
  const { t } = useLocale();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[900px] items-center px-6 py-16 lg:px-10">
        <div className="hairline bg-surface-1 p-8 md:p-10">
          <div className="flex items-center gap-3 text-silver">
            <LockKeyhole className="h-5 w-5" />
            <span className="font-display text-[10px] uppercase tracking-wider-2">
              {t("access.internal")}
            </span>
          </div>
          <h1 className="mt-6 font-display text-4xl uppercase tracking-display md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-silver">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/sign-in"
              search={{ returnTo }}
              className="bg-foreground px-5 py-3 font-display text-xs uppercase tracking-wider-2 text-background hover:opacity-90"
            >
              {t("common.signIn")}
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 hairline px-5 py-3 font-display text-xs uppercase tracking-wider-2 text-silver hover-surface"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("common.backToSite")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
