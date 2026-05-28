import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Car, CalendarCheck, Wrench, ArrowLeft } from "lucide-react";
import { SkylineLogo } from "@/components/SkylineLogo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Skyline Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/fleet", label: "Fleet", icon: Car },
  { to: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 hairline-r border-r border-[color:var(--hairline)] bg-surface-1/50 hidden lg:flex flex-col">
        <div className="p-6 hairline-b">
          <SkylineLogo />
          <p className="mt-3 font-display text-[10px] uppercase tracking-wider-2 text-silver">
            Operations console
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
                  active ? "bg-foreground text-background" : "text-silver hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 hairline-t">
          <Link to="/" className="flex items-center gap-2 font-display text-[10px] uppercase tracking-wider-2 text-silver hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Back to site
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Mobile top nav */}
        <header className="lg:hidden hairline-b sticky top-0 z-40 bg-background/90 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 h-14">
            <SkylineLogo showWordmark={false} />
            <Link to="/" className="font-display text-[10px] uppercase tracking-wider-2 text-silver">Exit</Link>
          </div>
          <nav className="flex overflow-x-auto px-2 pb-2 gap-2">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link key={item.to} to={item.to} className={`shrink-0 hairline px-3 py-1.5 font-display text-[10px] uppercase tracking-wider-2 ${active ? "bg-foreground text-background" : "text-silver"}`}>
                  {item.label}
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
