-- Create storage bucket for activity images
INSERT INTO storage.buckets (id, name, public)
VALUES ('activity-images', 'activity-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload activity images
CREATE POLICY "Admins can upload activity images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'activity-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow public read access to activity images
CREATE POLICY "Activity images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'activity-images');

-- Allow admins to delete activity images
CREATE POLICY "Admins can delete activity images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'activity-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Create site_settings table for admin settings
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read site settings
CREATE POLICY "Site settings are publicly readable"
ON public.site_settings FOR SELECT
USING (true);

-- Only admins can update site settings
CREATE POLICY "Admins can update site settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert site settings
CREATE POLICY "Admins can insert site settings"
ON public.site_settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('org_name', 'Precious Gift CBO'),
  ('org_email', 'preciousgiftcbo@gmail.com'),
  ('org_phone', '+254 712 345 678'),
  ('org_address', 'Siaya County, Kenya'),
  ('org_tagline', 'Keeping Girls in School Through Menstrual Health Support');

-- Create activities table for persistent storage
CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  location text NOT NULL,
  participants integer DEFAULT 0,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Anyone can read activities
CREATE POLICY "Activities are publicly readable"
ON public.activities FOR SELECT
USING (true);

-- Only admins can insert activities
CREATE POLICY "Admins can insert activities"
ON public.activities FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update activities
CREATE POLICY "Admins can update activities"
ON public.activities FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete activities
CREATE POLICY "Admins can delete activities"
ON public.activities FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial activities data
INSERT INTO public.activities (title, description, date, location, participants) VALUES
  ('Menstrual Health Education - Usenge Primary', 'Interactive session teaching girls about menstrual health, proper hygiene practices, and how to manage their periods confidently. Girls learned essential skills to stay in school every day of the month.', '2024-01-15', 'Usenge Primary School, Bondo', 85),
  ('Community Outreach - Ugunja Market', 'Engaged parents and community leaders in discussions about supporting girls with sanitary products. Breaking the stigma around menstruation so girls can attend school without shame.', '2024-01-20', 'Ugunja Market Center', 120),
  ('Teacher Training Program', 'Trained female teachers on how to support students during menstruation, provide emergency sanitary supplies, and create supportive environments that keep girls in class.', '2024-02-05', 'Siaya Teachers College', 45),
  ('Sanitary Pad Distribution - Gem Sub-county', 'Large-scale distribution of sanitary pads to schools in Gem sub-county. Providing girls with the essential supplies they need to attend school every single day without interruption.', '2024-02-12', 'Gem Sub-county Schools', 520);