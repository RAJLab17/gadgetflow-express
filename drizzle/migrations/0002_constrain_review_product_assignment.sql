ALTER TABLE public.reviews ADD CONSTRAINT reviews_product_assignment CHECK (product_id IN ('nexus', 'matrix', 'airpods-case'));
CREATE OR REPLACE FUNCTION public.reviews_before_insert_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
    NEW.helpful_count := 0;
    NEW.founder_response := NULL;
    NEW.founder_responded_at := NULL;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;