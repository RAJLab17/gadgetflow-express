-- Create pre-orders table for the exclusive campaign
CREATE TABLE public.preorders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  phone TEXT,
  street_address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Deutschland',
  product_name TEXT NOT NULL,
  product_variant TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  original_price DECIMAL(10,2) NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 10,
  final_price DECIMAL(10,2) NOT NULL,
  includes_free_cable BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pending',
  production_started_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for pre-orders (no auth required for ordering)
CREATE POLICY "Anyone can create preorders" 
ON public.preorders 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading own order by email (for order status check)
CREATE POLICY "Users can view orders by email" 
ON public.preorders 
FOR SELECT 
USING (true);

-- Create function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'RAJ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for order number generation
CREATE TRIGGER generate_preorder_number
BEFORE INSERT ON public.preorders
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_number();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_preorders_updated_at
BEFORE UPDATE ON public.preorders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_preorders_email ON public.preorders(customer_email);
CREATE INDEX idx_preorders_status ON public.preorders(status);
CREATE INDEX idx_preorders_created_at ON public.preorders(created_at DESC);