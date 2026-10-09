import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const topics = [
  "Choosing a saree",
  "An existing order",
  "Made to order & bridal",
  "Care & repair",
  "Wholesale or press",
] as const;

/** Client care enquiry form — each submission becomes a CRM lead. */
export function ContactForm({ product }: { product?: string }) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="grid gap-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const d = new FormData(form);
        const get = (k: string) => String(d.get(k) ?? "").trim();
        const topic = get("topic");
        const message = get("message");
        setSubmitting(true);
        const { error } = await supabase.rpc("submit_website_inquiry", {
          _name: get("name").slice(0, 120),
          _email: get("email").slice(0, 255),
          _phone: get("phone").slice(0, 30),
          _subject: `${topic}: ${message}`.slice(0, 4000),
          _product: (product ?? "").slice(0, 200),
        });
        setSubmitting(false);
        if (error) {
          toast.error("Something went wrong", { description: "Please try again or reach us on WhatsApp." });
          return;
        }
        form.reset();
        toast.success("Message received", {
          description: "Our client care team replies within one working day.",
        });
      }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Name">
          <input id="name" name="name" required maxLength={120} autoComplete="name" className={inputClass} />
        </Field>
        <Field id="email" label="Email">
          <input id="email" name="email" type="email" required maxLength={255} autoComplete="email" className={inputClass} />
        </Field>
      </div>

      <Field id="phone" label="Phone (optional)">
        <input id="phone" name="phone" type="tel" maxLength={30} autoComplete="tel" className={inputClass} />
      </Field>

      <Field id="topic" label="What is this about?">
        <select id="topic" name="topic" className={inputClass} defaultValue={topics[0]}>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Message">
        <textarea id="message" name="message" required rows={5} className={inputClass} />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="justify-self-start bg-primary px-10 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full border-b border-border bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-foreground";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
