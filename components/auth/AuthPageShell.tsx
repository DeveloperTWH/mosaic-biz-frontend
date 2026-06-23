import type { ReactNode } from "react";
import Link from "next/link";

export interface AuthPageShellProps {
  typeLabel: string;
  title: string;
  hero: ReactNode;
  children: ReactNode;
}

export default function AuthPageShell({ typeLabel, title, hero, children }: AuthPageShellProps) {
  return (
    <div className="grid min-h-screen max-w-[100vw] grid-cols-1 overflow-x-hidden md:grid-cols-2">
      <header className="absolute left-0 right-0 top-0 z-20 flex w-full items-center justify-between bg-white px-4 py-4 md:left-20 md:bg-transparent md:px-0">
        <Link href="/" className="text-xl font-bold tracking-wide text-brand-navy md:text-white">
          <img src="/login/logo.png" alt="Mosaic Biz Hub" />
        </Link>
      </header>

      <div className="relative hidden items-center justify-center bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-teal-dark text-white md:flex">
        <img
          src="/login/sideImg.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          aria-hidden
        />
        <div className="relative z-10 max-w-md px-10">{hero}</div>
      </div>

      <div className="flex min-w-0 items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md min-w-0">
          <span className="auth-role-badge mb-2 inline-block">
            {typeLabel}
          </span>
          <h2 className="mb-2 font-poppins text-3xl font-bold text-brand-navy">{title}</h2>
          <div className="mb-5 flex flex-col justify-start">
            <hr className="h-[2px] w-20 bg-brand-navy" />
            <hr className="mb-4 mt-0.5 h-[2px] w-20 bg-brand-navy" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
