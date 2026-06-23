import Link from "next/link";

type AuthPathSwitchProps = {
  message: string;
  href: string;
  linkLabel: string;
  className?: string;
};

/** Secondary auth navigation — e.g. switch customer/vendor or go to signup. */
export default function AuthPathSwitch({
  message,
  href,
  linkLabel,
  className = "",
}: AuthPathSwitchProps) {
  return (
    <p className={`auth-path-switch ${className}`.trim()}>
      {message}{" "}
      <Link href={href} className="font-semibold text-brand-navy-light hover:underline">
        {linkLabel}
      </Link>
    </p>
  );
}
