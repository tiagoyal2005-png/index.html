import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LEAD_STATUSES, fmtDate, fmtTime, statusClass } from "@/lib/crm";

export const Route = createFileRoute("/admin/crm/")({
  head: () => ({ meta: [{ title: "CRM Dashboard — Kota Doria Sarees" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["crm", "leads", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_leads")
        .select("id, lead_code, name, status, lead_date, lead_time, subject")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const counts = Object.fromEntries(LEAD_STATUSES.map((s) => [s, (data ?? []).filter((l) => l.status === s).length]));
  const cards = [{ label: "Total Leads", value: data?.length ?? 0 }, ...LEAD_STATUSES.map((s) => ({ label: s === "New" ? "New Leads" : s, value: counts[s] ?? 0 }))];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl">Dashboard</h1>
        <Link to="/admin/crm/leads" className="bg-primary px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-primary-foreground">View all leads</Link>
      </div>
      {error ? <p className="mt-6 text-sm text-destructive">Could not load leads.</p> : null}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-serif text-4xl">{isLoading ? "–" : c.value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-12 font-serif text-2xl">Latest leads</h2>
      <ul className="mt-4 divide-y divide-border border border-border bg-card">
        {(data ?? []).slice(0, 6).map((l) => (
          <li key={l.id}>
            <Link to="/admin/crm/leads/$id" params={{ id: l.id }} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-muted/50">
              <span className="text-sm">
                <span className="text-muted-foreground">{l.lead_code}</span> · {l.name}
                <span className="ml-2 text-muted-foreground">{fmtDate(l.lead_date)} {fmtTime(l.lead_time)}</span>
              </span>
              <span className={`px-2 py-0.5 text-xs ${statusClass[l.status]}`}>{l.status}</span>
            </Link>
          </li>
        ))}
        {!isLoading && !data?.length ? <li className="p-4 text-sm text-muted-foreground">No leads yet.</li> : null}
      </ul>
    </div>
  );
}
