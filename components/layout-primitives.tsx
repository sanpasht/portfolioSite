import * as React from "react";

import { cn } from "@/lib/utils";

/** Every page sits on the same measure. Nothing opts out. */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-3xl px-5 sm:px-6", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  meta,
  action,
}: {
  title: string;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-12 pt-14 sm:pt-20">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {action}
      </div>
      {description ? (
        <div className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </div>
      ) : null}
      {meta ? (
        <div className="mt-4 text-sm text-muted-foreground">{meta}</div>
      ) : null}
    </header>
  );
}

export function Section({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-16 sm:mt-20", className)}>
      {title ? (
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
