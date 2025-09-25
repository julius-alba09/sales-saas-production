-- Setup Storage Buckets and Policies
-- This migration creates storage buckets for user avatars and organization logos

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, '{"image/png","image/jpeg","image/gif","image/webp"}'),
  ('organization-logos', 'organization-logos', true, 5242880, '{"image/png","image/jpeg","image/gif","image/webp","image/svg+xml"}')
ON CONFLICT (id) DO NOTHING;

-- Create policies for avatars bucket
-- Note: RLS is already enabled on storage.objects by default
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create policies for organization logos bucket
CREATE POLICY "Anyone can view organization logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'organization-logos');

CREATE POLICY "Managers can upload organization logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'organization-logos' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'manager'
      AND organization_id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Managers can update organization logos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'organization-logos' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'manager'
      AND organization_id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Managers can delete organization logos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'organization-logos' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'manager'
      AND organization_id::text = (storage.foldername(name))[1]
    )
  );