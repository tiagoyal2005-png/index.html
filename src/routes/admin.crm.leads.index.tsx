import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LEAD_STATUSES, fmtDate, fmtTime, statusClass, type LeadStatus } from "@/lib/crm";
import { LeadForm, type LeadFormValues } from "@/components/crm/LeadForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/crm/leads/")({
  head: () => ({ meta: [{ title: "Leads — Kota Doria CRM" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: LeadsPage,
});

function LeadsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | LeadStatus>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [adding, setAdding] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["crm", "leads", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("crm_leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter((l) => {
      if (status && l.status !== status) return false;
      if (from && l.lead_date < from) return false;
      if (to && l.lead_date > to) return false;
      if (!term) return true;
      return [l.lead_code, l.name, l.phone, l.email, l.subject, l.product].some((v) => v?.toLowerCase().includes(term));
    });
  }, [data, q, status, from, to]);

  const create = useMutation({
    mutationFn: async (v: LeadFormValues) => {
      const { data, error } = await supabase.from("crm_leads").insert(v).select("id").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Lead added");
      setAdding(false);
      qc.invalidateQueries({ queryKey: ["crm"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("crm_leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lead deleted");
      qc.invalidateQueries({ queryKey: ["crm"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const ctl = "border border-border bg-card px-3 py-2 text-sm outline-none focus:border-foreground";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl">Leads</h1>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, email…" aria-label="Search leads" className={`${ctl} min-w-[220px] flex-1`} />
        <select value={status} onChange={(e) => setStatus(e.target.value as "" | LeadStatus)} aria-label="Filter by status" className={ctl}>
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={ctl} /></label>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={ctl} /></label>
      </div>

      {error ? <p className="mt-6 text-sm text-destructive">Could not load leads.</p> : null}

      <div className="mt-6 overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              {["Date", "Time", "Name", "Phone", "Email", "What is it about?", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((l) => (
              <tr key={l.id} className="align-top">
                <td className="whitespace-nowrap px-4 py-3">{fmtDate(l.lead_date)}</td>
                <td className="whitespace-nowrap px-4 py-3">{fmtTime(l.lead_time)}</td>
                <td className="px-4 py-3">{l.name}<div className="text-xs text-muted-foreground">{l.lead_code}</div></td>
                <td className="whitespace-nowrap px-4 py-3">{l.phone ?? "—"}</td>
                <td className="px-4 py-3">{l.email ?? "—"}</td>
                <td className="max-w-[260px] px-4 py-3"><span className="line-clamp-2">{l.subject ?? "—"}</span></td>
                <td className="px-4 py-3"><span className={`whitespace-nowrap px-2 py-0.5 text-xs ${statusClass[l.status]}`}>{l.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Link to="/admin/crm/leads/$id" params={{ id: l.id }} aria-label="View lead" className="p-1.5 hover:text-primary"><Eye className="h-4 w-4" /></Link>
                    <button aria-label="Edit lead" onClick={() => navigate({ to: "/admin/crm/leads/$id", params: { id: l.id }, search: { edit: true } })} className="p-1.5 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                    <button aria-label="Delete lead" onClick={() => { if (confirm(`Delete lead ${l.lead_code}?`)) remove.mutate(l.id); }} className="p-1.5 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && rows.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No leads found.</td></tr>
            ) : null}
            {isLoading ? <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr> : null}
          </tbody>
        </table>
      </div>

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>Add lead</DialogTitle></DialogHeader>
          <LeadForm submitLabel="Add lead" busy={create.isPending} onCancel={() => setAdding(false)} onSubmit={(v) => create.mutate(v)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
