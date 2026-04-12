
CREATE TABLE public.visitor_counter (
  id integer PRIMARY KEY DEFAULT 1,
  count bigint NOT NULL DEFAULT 657,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO public.visitor_counter (id, count) VALUES (1, 657);

ALTER TABLE public.visitor_counter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visitor count"
ON public.visitor_counter FOR SELECT
USING (true);

CREATE POLICY "Anyone can update visitor count"
ON public.visitor_counter FOR UPDATE
USING (true)
WITH CHECK (true);
