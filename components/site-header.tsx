"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { navigation } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ name }: { name: string }) {
  const pathname = usePathname();
  // Each link below is wrapped in SheetClose, so navigating closes the menu
  // without needing to watch the pathname.
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link
          href="/"
          className="text-sm font-medium tracking-tight transition-colors hover:text-accent"
        >
          {name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navigation
            .filter((item) => item.href !== "/")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  isActive(pathname, item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetTitle className="text-sm font-medium tracking-tight">
                Menu
              </SheetTitle>
              <nav className="flex flex-col" aria-label="Mobile">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "-mx-2 rounded-md px-2 py-3 text-base transition-colors",
                        isActive(pathname, item.href)
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
