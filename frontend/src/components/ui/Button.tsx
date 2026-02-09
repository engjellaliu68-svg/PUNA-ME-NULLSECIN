import { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-accent text-white shadow-[0_18px_35px_rgba(15,118,110,0.35)] hover:-translate-y-0.5 hover:bg-emerald-700",
  secondary:
    "border border-black/10 bg-white/80 text-ink shadow-sm hover:-translate-y-0.5 hover:border-accent",
  ghost: "text-ink hover:text-accent",
  dark: "bg-ink text-white hover:-translate-y-0.5 hover:bg-black"
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0 ${
        variants[variant]
      } ${className}`}
      {...props}
    />
  );
}
