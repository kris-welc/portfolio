"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "#projects", label: "PROJECTS" },
  { href: "#articles", label: "ARTICLES" },
  { href: "#systems", label: "SYSTEMS" },
  { href: "#stack", label: "STACK" },
  { href: "#contact", label: "CONTACT" },
] as const;

export function Nav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = NAV_ITEMS.map(({ href }) =>
      document.querySelector(href)
    ).filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target.id) {
          setActive(`#${visible.target.id}`);
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-waste-border/30 bg-waste-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="glow-amber font-mono text-sm tracking-[0.2em] text-waste-amber"
        >
          KW://
        </a>
        <div className="flex items-center gap-6 md:gap-8">
          {NAV_ITEMS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={cn(
                "link-underline text-xs tracking-wide transition-colors md:text-sm",
                active === href
                  ? "text-waste-amber"
                  : "text-waste-dim hover:text-waste-bone"
              )}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
