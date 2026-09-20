import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

/**
 * Site logo — the official KD "Kota doria sarees" artwork.
 */
export function Wordmark({
  className,
  subtitle = true,
}: {
  className?: string;
  /** Kept for compatibility with existing call sites; the artwork already includes the tagline. */
  subtitle?: boolean;
}) {
  return (
    <img
      src={logo}
      alt="Kota Doria Sarees"
      className={cn("h-14 w-auto mix-blend-multiply md:h-16", className)}
      width={494}
      height={404}
    />
  );
}
