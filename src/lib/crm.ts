import type { Database } from "@/integrations/supabase/types";

export type Lead = Database["public"]["Tables"]["crm_leads"]["Row"];
export type LeadInsert = Database["public"]["Tables"]["crm_leads"]["Insert"];
export type LeadStatus = Database["public"]["Enums"]["lead_status"];

export const LEAD_STATUSES: LeadStatus[] = ["New", "Contacted", "Follow-up", "Converted", "Closed"];

export const statusClass: Record<LeadStatus, string> = {
  New: "bg-primary/10 text-primary",
  Contacted: "bg-secondary text-secondary-foreground",
  "Follow-up": "bg-accent/30 text-foreground",
  Converted: "bg-foreground text-background",
  Closed: "bg-muted text-muted-foreground",
};

export function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d.length === 10 ? d + "T00:00:00" : d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function fmtTime(t: string | null) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  const d = new Date();
  d.setHours(h ?? 0, m ?? 0);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export function fmtDateTime(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}
