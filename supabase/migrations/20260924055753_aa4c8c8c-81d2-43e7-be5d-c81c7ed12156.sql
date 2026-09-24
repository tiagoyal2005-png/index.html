CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Grants admin only to the owner's verified email
CREATE OR REPLACE FUNCTION public.claim_owner_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _email text;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT email INTO _email FROM auth.users WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL;
  IF lower(_email) = 'tiagoyal2005@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN public.has_role(auth.uid(), 'admin');
END; $$;
REVOKE EXECUTE ON FUNCTION public.claim_owner_admin() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.claim_owner_admin() TO authenticated;

CREATE TYPE public.lead_status AS ENUM ('New', 'Contacted', 'Follow-up', 'Converted', 'Closed');
CREATE SEQUENCE public.crm_lead_seq;
CREATE TABLE public.crm_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_code text NOT NULL UNIQUE DEFAULT ('KD-' || lpad(nextval('public.crm_lead_seq')::text, 5, '0')),
  lead_date date NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Kolkata')::date,
  lead_time time NOT NULL DEFAULT date_trunc('second', (now() AT TIME ZONE 'Asia/Kolkata')::time),
  name text NOT NULL,
  phone text,
  email text,
  subject text,
  product text,
  status public.lead_status NOT NULL DEFAULT 'New',
  notes text,
  source text,
  last_contacted timestamptz,
  next_follow_up date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT USAGE ON SEQUENCE public.crm_lead_seq TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_leads TO authenticated;
GRANT ALL ON public.crm_leads TO service_role;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage leads" ON public.crm_leads FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER crm_leads_touch BEFORE UPDATE ON public.crm_leads FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX crm_leads_created_idx ON public.crm_leads (created_at DESC);