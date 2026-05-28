import { SkylineLogo } from "./SkylineLogo";

export function SiteFooter() {
  return (
    <footer className="hairline-t bg-background mt-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <SkylineLogo />
            <p className="mt-6 text-sm text-silver leading-relaxed max-w-xs">
              Premium automotive experiences. Curated fleet, surgical service.
            </p>
          </div>
          {[
            { title: "Fleet", links: ["Sport", "SUV", "Electric", "Supercars"] },
            { title: "Company", links: ["About", "Press", "Careers", "Contact"] },
            { title: "Legal", links: ["Terms", "Privacy", "Insurance", "Compliance"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-xs uppercase tracking-wider-2 text-foreground">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a className="text-sm text-silver hover:text-foreground transition-colors" href="#">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="hairline-t mt-16 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-silver/60 font-display tracking-wider-2 uppercase">
            © {new Date().getFullYear()} Skyline Car Rental — All rights reserved
          </p>
          <p className="text-xs text-silver/60 font-display tracking-wider-2 uppercase">
            Drive with conviction
          </p>
        </div>
      </div>
    </footer>
  );
}
