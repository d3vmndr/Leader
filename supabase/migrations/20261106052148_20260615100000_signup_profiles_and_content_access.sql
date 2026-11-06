/*
# Signup profile creation, profile safety, and content tables

1. New Tables
- `blogs` (id, title, excerpt, content, author, date, read_time, category, image_url, likes, featured, created_at) for the blog page.
- `notices` (id, title, description, type, date, is_pinned, created_at) for the notice board.

2. Changes
- `profiles` gets a `player_type` column (Student or Teacher), defaulting to Student. Existing rows are unaffected.
- A database trigger creates the matching `profiles` row automatically when a new account is created by sign-up, using the name, username, school, district, province and phone the user entered. Sign-up no longer depends on the browser having a session at the moment the profile is written.
- `challenge_results` view is recreated to run with the caller's permissions, so leaderboard row-level security is respected, and is granted to signed-in users.

3. Security
- Blogs and notices: anyone can read; only admins (profiles.is_admin = true) can create, edit or delete. Policies are split per action.
- Profiles: anonymous visitors get no direct access. Signed-in users can read profiles and edit their own profile fields, but cannot set `is_admin` or ranks on their own row.
- The profile-creation function cannot be called directly by app users.

4. Important notes
- No existing data is removed or rewritten. Only additive columns, tables, grants, policies and triggers are changed.
- Profile creation happens in the trigger; the sign-up page no longer inserts the profile itself.
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS player_type text NOT NULL DEFAULT 'Student';

CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT '',
  date timestamptz NOT NULL DEFAULT now(),
  read_time integer NOT NULL DEFAULT 5,
  category text NOT NULL DEFAULT 'Strategy',
  image_url text NOT NULL DEFAULT '',
  likes integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('announcement', 'alert', 'success', 'info')),
  date timestamptz NOT NULL DEFAULT now(),
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, full_name, username, player_type, school_name, district, province, parent_phone
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', ''),
    COALESCE(NEW.raw_user_meta_data->>'player_type', 'Student'),
    COALESCE(NEW.raw_user_meta_data->>'school_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'district', ''),
    COALESCE(NEW.raw_user_meta_data->>'province', ''),
    COALESCE(NEW.raw_user_meta_data->>'parent_phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE ALL ON profiles FROM anon, authenticated;
GRANT SELECT ON profiles TO authenticated;
GRANT UPDATE (
  full_name, username, player_type, school_name, district, province, parent_phone,
  avatar_url, total_score, streak, challenges_participated, updated_at
) ON profiles TO authenticated;

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

GRANT SELECT ON blogs, notices TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON blogs, notices TO authenticated;

DROP POLICY IF EXISTS "Allow public read access to blogs" ON blogs;
CREATE POLICY "Allow public read access to blogs" ON blogs FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow admins to manage blogs" ON blogs;
DROP POLICY IF EXISTS "Allow admins to insert blogs" ON blogs;
DROP POLICY IF EXISTS "Allow admins to update blogs" ON blogs;
DROP POLICY IF EXISTS "Allow admins to delete blogs" ON blogs;
CREATE POLICY "Allow admins to insert blogs" ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Allow admins to update blogs" ON blogs FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Allow admins to delete blogs" ON blogs FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Allow public read access to notices" ON notices;
CREATE POLICY "Allow public read access to notices" ON notices FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Allow admins to manage notices" ON notices;
DROP POLICY IF EXISTS "Allow admins to insert notices" ON notices;
DROP POLICY IF EXISTS "Allow admins to update notices" ON notices;
DROP POLICY IF EXISTS "Allow admins to delete notices" ON notices;
CREATE POLICY "Allow admins to insert notices" ON notices FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Allow admins to update notices" ON notices FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Allow admins to delete notices" ON notices FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE OR REPLACE VIEW challenge_results WITH (security_invoker = true) AS
SELECT
  id,
  user_id,
  challenge_id,
  total_score AS score,
  national_rank AS rank,
  created_at AS completed_at
FROM leaderboard_entries;

GRANT SELECT ON challenge_results TO authenticated;
