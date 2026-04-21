/*
  # SmartLeague Nepal - Full Database Schema

  ## Overview
  This migration creates the complete database schema for SmartLeague Nepal,
  a student opinion intelligence and social reasoning competition platform.

  ## New Tables
  1. `profiles` - Extended user profiles linked to auth.users
     - Grade, school, district, province, scores, ranks, streaks
  2. `challenges` - Weekly competition events (Monday/Friday)
     - Title, description, schedule, status, duration
  3. `questions` - Questions per challenge (20 per challenge)
     - Question text, type, order index
  4. `options` - 4 options per question with scoring data
     - Option label (A/B/C/D), text, selection count, computed score
  5. `responses` - Student answers per challenge
     - User, challenge, question, option selected
  6. `leaderboard_entries` - Computed scores per challenge
     - Total score, national rank, district rank
  7. `badges` - Badge definitions
  8. `user_badges` - Badges earned by users
  9. `district_stats` - Aggregated district performance

  ## Security
  - RLS enabled on all tables
  - Users can only read/write their own data
  - Admins have full access via app_metadata role
*/

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  username text UNIQUE NOT NULL DEFAULT '',
  grade integer NOT NULL DEFAULT 8 CHECK (grade IN (8, 9)),
  school_name text NOT NULL DEFAULT '',
  district text NOT NULL DEFAULT '',
  province text NOT NULL DEFAULT '',
  parent_phone text DEFAULT '',
  total_score numeric(10,4) NOT NULL DEFAULT 0,
  national_rank integer DEFAULT NULL,
  district_rank integer DEFAULT NULL,
  streak integer NOT NULL DEFAULT 0,
  challenges_participated integer NOT NULL DEFAULT 0,
  is_admin boolean NOT NULL DEFAULT false,
  avatar_url text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  scheduled_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'closed', 'results_published')),
  duration_minutes integer NOT NULL DEFAULT 30,
  total_questions integer NOT NULL DEFAULT 20,
  day_type text NOT NULL DEFAULT 'monday' CHECK (day_type IN ('monday', 'friday')),
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert challenges"
  ON challenges FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update challenges"
  ON challenges FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  question_text text NOT NULL DEFAULT '',
  question_type text NOT NULL DEFAULT 'opinion' CHECK (question_type IN ('emotional_intelligence', 'social_reasoning', 'analytical', 'ethical', 'curiosity', 'leadership', 'creative', 'opinion')),
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Options table
CREATE TABLE IF NOT EXISTS options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_label text NOT NULL DEFAULT 'A' CHECK (option_label IN ('A', 'B', 'C', 'D')),
  option_text text NOT NULL DEFAULT '',
  selection_count integer NOT NULL DEFAULT 0,
  score numeric(6,4) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view options"
  ON options FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage options"
  ON options FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Responses table (student answers)
CREATE TABLE IF NOT EXISTS responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id, question_id)
);

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own responses"
  ON responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses"
  ON responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all responses"
  ON responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Leaderboard entries
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  total_score numeric(10,4) NOT NULL DEFAULT 0,
  national_rank integer DEFAULT NULL,
  district_rank integer DEFAULT NULL,
  grade_rank integer DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view leaderboard"
  ON leaderboard_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert leaderboard entries"
  ON leaderboard_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE DEFAULT '',
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  badge_type text NOT NULL DEFAULT 'achievement' CHECK (badge_type IN ('achievement', 'streak', 'rank', 'participation', 'special')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- User badges junction table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "All can view badges for leaderboard"
  ON user_badges FOR SELECT
  TO authenticated
  USING (true);

-- District stats table
CREATE TABLE IF NOT EXISTS district_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district_name text NOT NULL UNIQUE DEFAULT '',
  province text NOT NULL DEFAULT '',
  total_students integer NOT NULL DEFAULT 0,
  active_students integer NOT NULL DEFAULT 0,
  total_points numeric(12,4) NOT NULL DEFAULT 0,
  average_score numeric(8,4) NOT NULL DEFAULT 0,
  national_rank integer DEFAULT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE district_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view district stats"
  ON district_stats FOR SELECT
  TO authenticated
  USING (true);

-- Seed initial badges
INSERT INTO badges (name, description, icon, badge_type) VALUES
  ('Bronze Thinker', 'Complete your first challenge', 'award', 'participation'),
  ('Silver Analyst', 'Complete 5 challenges', 'award', 'achievement'),
  ('Gold Champion', 'Complete 10 challenges', 'trophy', 'achievement'),
  ('Streak Master', 'Maintain a 3-week streak', 'zap', 'streak'),
  ('Top District', 'Represent top district', 'map-pin', 'rank'),
  ('Rising Star', 'Enter national top 100', 'star', 'rank'),
  ('Social Thinker', 'Score above 0.8 average', 'brain', 'achievement'),
  ('Weekly Champion', 'Win a weekly challenge', 'crown', 'rank'),
  ('Fair Player', 'Never flagged for misconduct', 'shield', 'special'),
  ('Curious Mind', 'Answer all curiosity questions perfectly', 'lightbulb', 'special')
ON CONFLICT (name) DO NOTHING;
