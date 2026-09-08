import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { navLinks } from "@/data/site";
import { Wordmark } from "@/components/Wordmark";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { cartCount, wishlist, user } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const iconBtn =
    "inline-flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-primary";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-500",
        scrolled
          ? "border-border bg-background/92 backdrop-blur-md"
          : "border-transparent bg-background",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className="container-page flex h-[68px] items-center justify-between gap-6 md:h-20"
      >
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={iconBtn}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        <Link to="/" aria-label="ACTDF — home" className="lg:flex-none">
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className={iconBtn}
            aria-expanded={searchOpen}
            aria-label="Search sarees and suits"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
          <Link to="/wishlist" className={cn(iconBtn, "relative hidden sm:inline-flex")} aria-label="Wishlist">
            <Heart className="h-[18px] w-[18px]" aria-hidden="true" />
            {wishlist.length > 0 ? <Badge>{wishlist.length}</Badge> : null}
          </Link>
          <Link to="/account" className={cn(iconBtn, "hidden sm:inline-flex")} aria-label={user ? "Your account" : "Sign in"}>
            <User className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
          <Link to="/bag" className={cn(iconBtn, "relative")} aria-label={`Bag, ${cartCount} items`}>
            <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
            {cartCount > 0 ? <Badge>{cartCount}</Badge> : null}
          </Link>
        </div>
      </nav>

      {searchOpen ? (
        <div className="border-t border-border bg-card">
          <form
            className="container-page flex items-center gap-4 py-5"
            onSubmit={(e) => {
              e.preventDefault();
               navigate({ to: "/search", search: { q: term || undefined } });
              setSearchOpen(false);
            }}
          >
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              autoFocus
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search sarees, suits, collections, colours"
              aria-label="Search sarees and suits"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
              Search
            </button>
          </form>
        </div>
      ) : null}

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-border bg-card lg:hidden"
      >
        <ul className="container-page flex flex-col py-3">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="block border-b border-border/60 py-3.5 text-sm uppercase tracking-[0.16em] text-foreground"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="flex gap-6 py-4 text-sm uppercase tracking-[0.16em]">
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/account">Account</Link>
            <Link to="/bag">Bag</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute right-1 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none text-primary-foreground">
      {children}
    </span>
  );
}
