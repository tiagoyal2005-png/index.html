import { cn } from "@/lib/utils";

/**
 * ACTDF wordmark.
 *
 * DROP-IN LOGO SLOT: when the final Canva logo asset is available, save it to
 * `src/assets/logo-actdf.svg` (or .png), import it here and swap the
 * <span> block for an <img>. Nothing else in the app needs to change.
 *
 *   import logo from "@/assets/logo-actdf.svg";
 *   return <img src={logo} alt="ACTDF" className="h-9 w-auto" />;
 */
export function Wordmark({
  className,
  subtitle = true,
}: {
  className?: string;
  subtitle?: boolean;
}) {
  return (
    <span className={cn("flex flex-col items-start leading-none", className)}>
      <span className="font-serif text-[1.35rem] font-normal tracking-[0.3em] text-foreground md:text-[1.55rem]">
        ACTDF
      </span>
      {subtitle ? (
        <span className="mt-2 flex w-full items-center gap-2">
          <span className="h-px flex-1 bg-gold/60" aria-hidden="true" />
          <span className="text-[8.5px] font-medium uppercase tracking-[0.34em] text-muted-foreground">
            Kota Doria
          </span>
          <span className="h-px flex-1 bg-gold/60" aria-hidden="true" />
        </span>
      ) : null}
    </span>
  );
}
