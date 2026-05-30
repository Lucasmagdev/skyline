import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, User, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { useAuth, type DemoRole } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [{ title: "Skyline Sign In" }, { name: "robots", content: "noindex" }],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { signIn } = useAuth();
  const { t } = useLocale();
  const [returnTo, setReturnTo] = useState("/");

  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get("returnTo");
    if (target?.startsWith("/")) setReturnTo(target);
  }, []);

  function chooseRole(role: DemoRole) {
    signIn(role);
    if (role === "concierge") {
      window.location.href = "/admin";
    } else if (role === "inspector") {
      window.location.href = "/maintenance";
    } else {
      const isInternalPage =
        returnTo.startsWith("/admin") || returnTo.startsWith("/maintenance");
      window.location.href = isInternalPage ? "/" : returnTo;
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1180px] items-center gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
            {t("signIn.eyebrow")}
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-display md:text-6xl">
            {t("signIn.title")}
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-silver">{t("signIn.copy")}</p>
        </div>

        <div className="grid gap-4">
          <RoleCard
            icon={<User className="h-5 w-5" />}
            title={t("common.customer")}
            description={t("signIn.customerDescription")}
            onClick={() => chooseRole("customer")}
          />
          <RoleCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title={t("common.concierge")}
            description={t("signIn.conciergeDescription")}
            onClick={() => chooseRole("concierge")}
          />
          <RoleCard
            icon={<Wrench className="h-5 w-5" />}
            title={t("common.inspector")}
            description={t("signIn.inspectorDescription")}
            onClick={() => chooseRole("inspector")}
          />
        </div>
      </section>
    </main>
  );
}

function RoleCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="group hairline bg-surface-1 p-6 text-left hover-surface">
      <span className="flex items-center justify-between gap-6">
        <span className="text-silver">{icon}</span>
        <ArrowRight className="h-4 w-4 text-silver transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
      </span>
      <span className="mt-6 block font-display text-3xl uppercase tracking-display">{title}</span>
      <span className="mt-2 block max-w-md text-sm leading-relaxed text-silver">{description}</span>
    </button>
  );
}
