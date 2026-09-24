import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/lib/crm";

export type LeadFormValues = {
  name: string;
  phone: string | null;
  email: string | null;
  subject: string | null;
  product: string | null;
  status: LeadStatus;
  notes: string | null;
  source: string | null;
  last_contacted: string | null;
  next_follow_up: string | null;
};

const input = "mt-1.5 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground";

function toLocalInput(ts: string | null | undefined) {
  if (!ts) return "";
  const d = new Date(ts);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

export function LeadForm({
  initial,
  onSubmit,
  onCancel,
  busy,
  submitLabel,
}: {
  initial?: Partial<Lead>;
  onSubmit: (v: LeadFormValues) => void;
  onCancel: () => void;
  busy?: boolean;
  submitLabel: string;
}) {
  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const s = (k: string) => {
          const v = String(d.get(k) ?? "").trim();
          return v === "" ? null : v;
        };
        const lc = s("last_contacted");
        onSubmit({
          name: s("name") ?? "",
          phone: s("phone"),
          email: s("email"),
          subject: s("subject"),
          product: s("product"),
          status: (s("status") as LeadStatus) ?? "New",
          notes: s("notes"),
          source: s("source"),
          last_contacted: lc ? new Date(lc).toISOString() : null,
          next_follow_up: s("next_follow_up"),
        });
      }}
    >
      <F label="Name *"><input name="name" required maxLength={120} defaultValue={initial?.name ?? ""} className={input} /></F>
      <F label="Phone number"><input name="phone" maxLength={30} defaultValue={initial?.phone ?? ""} className={input} /></F>
      <F label="Email"><input name="email" type="email" maxLength={255} defaultValue={initial?.email ?? ""} className={input} /></F>
      <F label="Product / Collection"><input name="product" maxLength={200} defaultValue={initial?.product ?? ""} className={input} /></F>
      <div className="sm:col-span-2">
        <F label="What is it about?"><textarea name="subject" rows={3} maxLength={4000} defaultValue={initial?.subject ?? ""} className={input} /></F>
      </div>
      <F label="Status">
        <select name="status" defaultValue={initial?.status ?? "New"} className={input}>
          {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </F>
      <F label="Source"><input name="source" maxLength={100} placeholder="Website, WhatsApp, Instagram…" defaultValue={initial?.source ?? ""} className={input} /></F>
      <F label="Last contacted"><input name="last_contacted" type="datetime-local" defaultValue={toLocalInput(initial?.last_contacted)} className={input} /></F>
      <F label="Next follow-up"><input name="next_follow_up" type="date" defaultValue={initial?.next_follow_up ?? ""} className={input} /></F>
      <div className="sm:col-span-2">
        <F label="Notes"><textarea name="notes" rows={4} maxLength={4000} defaultValue={initial?.notes ?? ""} className={input} /></F>
      </div>
      <div className="flex gap-3 sm:col-span-2">
        <button disabled={busy} className="bg-primary px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-60">
          {busy ? "Saving…" : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="border border-border px-6 py-2.5 text-xs uppercase tracking-[0.18em]">Cancel</button>
      </div>
    </form>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs uppercase tracking-[0.12em] text-muted-foreground">
      {label}
      <div className="normal-case tracking-normal text-foreground">{children}</div>
    </label>
  );
}
