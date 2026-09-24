import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin CRM — Kota Doria Sarees" },
      { name: "description", content: "Private lead management for Kota Doria Sarees." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

type Gate = "loading" | "signed-out" | "not-admin" | "admin";

function AdminLayout() {
  const [gate, setGate] = useState<Gate>("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) {
        setUser(null);
        setGate("signed-out");
        return;
      }
      setUser(data.user);
      const { data: isAdmin } = await supabase.rpc("claim_owner_admin");
      if (active) setGate(isAdmin ? "admin" : "not-admin");
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") check();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (gate === "loading") {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (gate === "signed-out") return <AdminSignIn />;
  if (gate === "not-admin") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <h1 className="font-serif text-3xl">Access restricted</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {user?.email} does not have administrator access.
          </p>
          <button onClick={signOut} className="mt-6 border border-border px-6 py-2.5 text-xs uppercase tracking-[0.2em]">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/admin/crm" className="font-serif text-xl">KD · CRM</Link>
            <nav className="flex gap-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <Link to="/admin/crm" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Dashboard</Link>
              <Link to="/admin/crm/leads" activeProps={{ className: "text-foreground" }}>Leads</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden text-muted-foreground sm:inline">{user?.email}</span>
            <button onClick={signOut} className="uppercase tracking-[0.16em] hover:text-primary">Sign out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

function AdminSignIn() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const input = "mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm outline-none focus:border-foreground";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        className="w-full max-w-sm space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const email = String(d.get("email"));
          const password = String(d.get("password"));
          setBusy(true);
          const { error } =
            mode === "signin"
              ? await supabase.auth.signInWithPassword({ email, password })
              : await supabase.auth.signUp({
                  email,
                  password,
                  options: { emailRedirectTo: `${window.location.origin}/admin/crm` },
                });
          setBusy(false);
          if (error) return toast.error(error.message);
          if (mode === "signup") toast.success("Check your email to confirm your account, then sign in.");
        }}
      >
        <div>
          <p className="eyebrow">Kota Doria Sarees</p>
          <h1 className="mt-2 font-serif text-3xl">{mode === "signin" ? "Admin sign in" : "Create admin account"}</h1>
        </div>
        <label className="block">
          <span className="eyebrow">Email</span>
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className="block">
          <span className="eyebrow">Password</span>
          <input name="password" type="password" required minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} className={input} />
        </label>
        <button disabled={busy} className="w-full bg-primary py-3.5 text-xs uppercase tracking-[0.22em] text-primary-foreground disabled:opacity-60">
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "First time? Create the admin account" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
