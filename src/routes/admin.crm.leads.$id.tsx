import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fmtDate, fmtDateTime, fmtTime, statusClass } from "@/lib/crm";
import { LeadForm, type LeadFormValues } from "@/components/crm/LeadForm";

export const Route = createFileRoute("/admin/crm/leads/$id")({
  validateSearch: (s: Record<string, unknown>): { edit?: boolean } => (s["edit"] ? { edit: true } : {}),
  head: () => ({ meta: [{ title: "Lead — Kota Doria CRM" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: LeadDetail,
});

function LeadDetail() {
  const { id } = Route.useParams();
  const { edit } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: lead, isLoading } = useQuery({
    queryKey: ["crm", "lead", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("crm_leads").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const setEdit = (v: boolean) => navigate({ to: "/admin/crm/leads/$id", params: { id }, search: v ? { edit: true } : {} });

  const update = useMutation({
    mutationFn: async (v: LeadFormValues) => {
      const { error } = await supabase.from("crm_leads").update(v).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lead updated");
      qc.invalidateQueries({ queryKey: ["crm"] });
      setEdit(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("crm_leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lead deleted");
      qc.invalidateQueries({ queryKey: ["crm"] });
      navigate({ to: "/admin/crm/leads" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!lead) return <p className="text-sm">Lead not found. <Link to="/admin/crm/leads" className="underline">Back to leads</Link></p>;

  const rows: [string, React.ReactNode][] = [
    ["Lead ID", lead.lead_code],
    ["Date", fmtDate(lead.lead_date)],
    ["Time", fmtTime(lead.lead_time)],
    ["Name", lead.name],
    ["Phone number", lead.phone ?? "—"],
    ["Email", lead.email ?? "—"],
    ["What is it about?", <span className="whitespace-pre-wrap">{lead.subject ?? "—"}</span>],
    ["Product / Collection", lead.product ?? "—"],
    ["Status", <span className={`px-2 py-0.5 text-xs ${statusClass[lead.status]}`}>{lead.status}</span>],
    ["Notes", <span className="whitespace-pre-wrap">{lead.notes ?? "—"}</span>],
    ["Source", lead.source ?? "—"],
    ["Last contacted", fmtDateTime(lead.last_contacted)],
    ["Next follow-up", fmtDate(lead.next_follow_up)],
    ["Created at", fmtDateTime(lead.created_at)],
    ["Updated at", fmtDateTime(lead.updated_at)],
  ];

  return (
    <div className="max-w-3xl">
      <Link to="/admin/crm/leads" className="text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">← All leads</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl">{lead.name}</h1>
        {!edit ? (
          <div className="flex gap-3">
            <button onClick={() => setEdit(true)} className="bg-primary px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-primary-foreground">Edit</button>
            <button onClick={() => { if (confirm(`Delete lead ${lead.lead_code}?`)) remove.mutate(); }} className="border border-border px-5 py-2.5 text-xs uppercase tracking-[0.18em] hover:text-destructive">Delete</button>
          </div>
        ) : null}
      </div>
      <div className="mt-8 border border-border bg-card p-6">
        {edit ? (
          <LeadForm initial={lead} submitLabel="Save changes" busy={update.isPending} onCancel={() => setEdit(false)} onSubmit={(v) => update.mutate(v)} />
        ) : (
          <dl className="divide-y divide-border">
            {rows.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr]">
                <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{k}</dt>
                <dd className="text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
