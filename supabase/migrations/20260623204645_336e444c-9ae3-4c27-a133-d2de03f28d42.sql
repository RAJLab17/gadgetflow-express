CREATE OR REPLACE FUNCTION public.reviews_before_insert_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
    NEW.helpful_count := 0;
    NEW.founder_response := NULL;
    NEW.founder_responded_at := NULL;
    IF EXISTS (
      SELECT 1 FROM public.preorders
      WHERE LOWER(customer_email) = LOWER(NEW.customer_email)
    ) THEN
      NEW.verified_purchase := true;
    ELSE
      NEW.verified_purchase := false;
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$function$;