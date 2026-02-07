"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/prompt", label: "Prompt" },
  { href: "/agent", label: "Agent" },
  { href: "/mcp", label: "MCP" },
  { href: "/project", label: "Project" },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="border-b border-border bg-card px-4 py-3 sm:px-6"
      aria-label="메인 메뉴"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <Link
          href="/"
          className={cn(
            "min-h-[44px] min-w-[44px] shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center",
            pathname === "/"
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          CRUD
        </Link>
        <div className="flex items-center gap-2">
          {items.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "min-h-[44px] shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
