
-- Table for unique visitor UUIDs
CREATE TABLE public.unique_visitors (
  id UUID NOT NULL PRIMARY KEY,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.unique_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read unique visitors" ON public.unique_visitors FOR SELECT USING (true);
CREATE POLICY "Anyone can insert unique visitors" ON public.unique_visitors FOR INSERT WITH CHECK (true);

-- Table for the single counter row
CREATE TABLE public.visitor_count (
  id INTEGER NOT NULL PRIMARY KEY DEFAULT 1,
  count INTEGER NOT NULL DEFAULT 666
);

ALTER TABLE public.visitor_count ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visitor count" ON public.visitor_count FOR SELECT USING (true);

-- Insert the initial row
INSERT INTO public.visitor_count (id, count) VALUES (1, 666);

-- Atomic function: insert visitor if new, increment count, return current count
CREATE OR REPLACE FUNCTION public.register_unique_visitor(p_visitor_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists BOOLEAN;
  v_count INTEGER;
BEGIN
  SELECT EXISTS(SELECT 1 FROM unique_visitors WHERE id = p_visitor_id) INTO v_exists;
  
  IF NOT v_exists THEN
    INSERT INTO unique_visitors (id) VALUES (p_visitor_id);
    UPDATE visitor_count SET count = count + 1 WHERE id = 1;
  END IF;
  
  SELECT count INTO v_count FROM visitor_count WHERE id = 1;
  RETURN v_count;
END;
$$;
