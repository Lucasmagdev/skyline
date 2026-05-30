import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Car, CalendarCheck, Wrench, ArrowLeft } from "lucide-react";
import { SkylineLogo } from "@/components/SkylineLogo";
import { InternalAccessPrompt } from "@/components/InternalAccessPrompt";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Skyline Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", labelKey: "admin.dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/fleet", labelKey: "common.fleet", icon: Car },
  { to: "/admin/reservations", labelKey: "admin.reservations", icon: CalendarCheck },
  { to: "/maintenance", labelKey: "common.maintenance", icon: Wrench },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { canAccessAdmin, user, signOut } = useAuth();
  const { t } = useLocale();

  if (!canAccessAdmin) {
    return (
      <InternalAccessPrompt
        title={t("access.adminTitle")}
        description={t("access.adminDescription")}
        returnTo={pathname}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 hairline-r border-r border-[color:var(--hairline)] bg-surface-1/50 hidden lg:flex flex-col">
        <div className="p-6 hairline-b">
          <SkylineLogo />
          <p className="mt-3 font-display text-[10px] uppercase tracking-wider-2 text-silver">
            {t("admin.operations")}
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 font-display text-xs uppercase tracking-wider-2 transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-silver hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 hairline-t">
          <div className="mb-4">
            <p className="font-display text-[10px] uppercase tracking-wider-2 text-silver">
              {t("admin.signedIn")}
            </p>
            <p className="mt-1 font-display text-xs uppercase tracking-wider-2 text-foreground">
              {user?.name}
            </p>
          </div>
          <button
            onClick={signOut}
            className="mb-4 font-display text-[10px] uppercase tracking-wider-2 text-silver hover:text-foreground"
          >
            {t("common.signOut")}
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-[10px] uppercase tracking-wider-2 text-silver hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> {t("common.backToSite")}
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Mobile top nav */}
        <header className="lg:hidden hairline-b sticky top-0 z-40 bg-background/90 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 h-14">
            <SkylineLogo showWordmark={false} />
            <Link
              to="/"
              className="font-display text-[10px] uppercase tracking-wider-2 text-silver"
            >
              {t("common.exit")}
            </Link>
          </div>
          <nav className="flex overflow-x-auto px-2 pb-2 gap-2">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`shrink-0 hairline px-3 py-1.5 font-display text-[10px] uppercase tracking-wider-2 ${active ? "bg-foreground text-background" : "text-silver"}`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
