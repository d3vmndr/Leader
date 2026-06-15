-- Complete SmartLeague Nepal Schema additions
-- This migration adds blogs, notices, and the challenge_results view.

-- Blogs table
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

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to blogs"
  ON blogs FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow admins to manage blogs"
  ON blogs FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Notices table
CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('announcement', 'alert', 'success', 'info')),
  date timestamptz NOT NULL DEFAULT now(),
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to notices"
  ON notices FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow admins to manage notices"
  ON notices FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Challenge Results view (underlying leaderboard_entries)
CREATE OR REPLACE VIEW challenge_results AS
SELECT 
  id,
  user_id,
  challenge_id,
  total_score AS score,
  national_rank AS rank,
  created_at AS completed_at
FROM leaderboard_entries;
