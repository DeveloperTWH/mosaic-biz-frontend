import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionAlign = "left" | "center";

export function MarketingSectionHeader({
  title,
  description,
  align = "center",
  className = "",
}: {
  title: string;
  description?: string;
  align?: SectionAlign;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 sm:mb-10",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <h2 className="market-section-heading">{title}</h2>
      <div className={cn("market-section-divider", align === "left" && "!mx-0")} />
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-2xl font-montserrat text-sm leading-relaxed text-market-muted sm:text-base",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function MarketingSplitSection({
  title,
  children,
  imageSrc,
  imageAlt,
  reverse = false,
  tone = "default",
  className = "",
}: {
  title: string;
  children: ReactNode;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  tone?: "default" | "elevated";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "public-section",
        tone === "elevated" ? "bg-market-surface" : "bg-market-bg",
        className
      )}
    >
      <div className="container-page">
        <div
          className={cn(
            "grid items-center gap-8 lg:grid-cols-2 lg:gap-12",
            reverse && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
          )}
        >
          <div>
            <h2 className="market-section-heading mb-2 text-2xl sm:text-3xl">{title}</h2>
            <div className="market-section-divider !mx-0 !w-20" />
            <div className="mt-5 space-y-4">{children}</div>
          </div>
          <div className="marketing-media-frame">
            <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarketingBulletList({
  items,
  className = "",
}: {
  items: { label?: string; text: string }[];
  className?: string;
}) {
  return (
    <ul className={cn("marketing-bullet-list", className)}>
      {items.map((item) => (
        <li key={item.text} className="marketing-bullet-item">
          {item.label ? (
            <>
              <span className="font-semibold text-market-text">{item.label}</span>{" "}
              {item.text}
            </>
          ) : (
            item.text
          )}
        </li>
      ))}
    </ul>
  );
}

export function MarketingFeatureCard({
  icon,
  title,
  children,
  featured = false,
}: {
  icon: ReactNode;
  title?: string;
  children: ReactNode;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "marketing-feature-card flex h-full flex-col items-center text-center",
        featured && "marketing-feature-card--featured"
      )}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center">{icon}</div>
      {title ? (
        <h3 className="mb-3 font-poppins text-base font-semibold text-market-text">{title}</h3>
      ) : null}
      <p className="font-montserrat text-sm leading-relaxed text-market-muted">{children}</p>
    </article>
  );
}

export function MarketingStepSection({
  step,
  title,
  items,
  imageSrc,
  imageAlt,
  reverse = false,
}: {
  step: number;
  title: string;
  items: { label?: string; text: string }[];
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}) {
  return (
    <section className={cn("marketing-step-section", reverse && "marketing-step-section--reverse")}>
      <div className="marketing-step-content">
        <p className="marketing-step-label">Step {step}</p>
        <h3 className="marketing-step-title">{title}</h3>
        <div className="market-section-divider !mx-0 !mb-6 !mt-3 !w-16" />
        <MarketingBulletList items={items} />
      </div>
      <div className="marketing-step-media">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
    </section>
  );
}

export function MarketingContactCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="marketing-contact-card">
      <div className="mb-4 text-market-gold">{icon}</div>
      <h3 className="font-poppins text-sm font-semibold uppercase tracking-wide text-market-text">
        {title}
      </h3>
      <div className="market-section-divider !mx-0 !my-3 !w-10" />
      <div className="space-y-1 font-montserrat text-sm leading-relaxed text-market-muted">
        {children}
      </div>
    </article>
  );
}

export function MarketingPathCard({
  title,
  bullets,
  href,
  ctaLabel,
  variant = "primary",
}: {
  title: string;
  bullets: string[];
  href: string;
  ctaLabel: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <article className="market-card-light flex h-full flex-col">
      <h3 className="market-card-light-title mb-3">{title}</h3>
      <ul className="market-card-light-body space-y-2 text-left">
        {bullets.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-market-gold" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={cn(
          "mt-auto inline-block min-h-11 w-full text-center sm:w-auto",
          variant === "primary" ? "market-btn-primary" : "market-btn-secondary"
        )}
      >
        {ctaLabel}
      </Link>
    </article>
  );
}
