CREATE OR REPLACE FUNCTION public.submit_website_inquiry(
  _name text, _email text, _phone text, _subject text, _product text
) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _code text;
BEGIN
  IF coalesce(length(trim(_name)),0) = 0 OR length(_name) > 120 THEN RAISE EXCEPTION 'Invalid name'; END IF;
  IF length(coalesce(_email,'')) > 255 OR length(coalesce(_phone,'')) > 30
     OR length(coalesce(_subject,'')) > 4000 OR length(coalesce(_product,'')) > 200 THEN
    RAISE EXCEPTION 'Input too long';
  END IF;
  IF coalesce(trim(_email),'') = '' AND coalesce(trim(_phone),'') = '' THEN RAISE EXCEPTION 'Email or phone required'; END IF;
  INSERT INTO public.crm_leads (name, email, phone, subject, product, status, source)
  VALUES (trim(_name), nullif(trim(_email),''), nullif(trim(_phone),''), nullif(trim(_subject),''), nullif(trim(_product),''), 'New', 'Website')
  RETURNING lead_code INTO _code;
  RETURN _code;
END; $$;
REVOKE EXECUTE ON FUNCTION public.submit_website_inquiry(text,text,text,text,text) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_website_inquiry(text,text,text,text,text) TO anon, authenticated;