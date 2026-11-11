/*
# Rewards catalog and badge rarity

1. New Tables
- `reward_tiers`: prize tiers shown on the Rewards page (title, icon, requirement, color theme, order).
- `reward_items`: individual prizes belonging to a tier (label, description, order).
- `streak_milestones`: streak badges shown on the Rewards page (weeks required, icon, name, description, color theme, order).

2. Modified Tables
- `badges`: new `rarity` column (Common, Rare, Epic, Legendary). Existing rows are unaffected.

3. Seed Data
- Inserts the current prize tiers, prizes, streak milestones, and badge catalog so the Rewards page keeps its content. Re-running is safe: existing rows are left alone.

4. Security
- Row level security is enabled on all new tables.
- Read-only access (SELECT) is granted to anon and authenticated, because the public Rewards page and the badge catalog are shared content. No public write access is granted.

5. Notes
- Nothing is dropped, renamed, or changed in type.
*/

CREATE TABLE IF NOT EXISTS reward_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  requirement text NOT NULL DEFAULT '',
  theme text NOT NULL DEFAULT 'blue' CHECK (theme IN ('blue', 'emerald', 'amber', 'red')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reward_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id uuid NOT NULL REFERENCES reward_tiers(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (tier_id, label)
);

CREATE INDEX IF NOT EXISTS reward_items_tier_id_idx ON reward_items (tier_id);

CREATE TABLE IF NOT EXISTS streak_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weeks integer UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  theme text NOT NULL DEFAULT 'blue' CHECK (theme IN ('blue', 'orange', 'sky', 'amber')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badges ADD COLUMN IF NOT EXISTS rarity text NOT NULL DEFAULT 'Common';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'badges_rarity_check'
  ) THEN
    ALTER TABLE badges ADD CONSTRAINT badges_rarity_check
      CHECK (rarity IN ('Common', 'Rare', 'Epic', 'Legendary'));
  END IF;
END $$;

ALTER TABLE reward_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_milestones ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON reward_tiers, reward_items, streak_milestones TO anon, authenticated;

DROP POLICY IF EXISTS "public_select_reward_tiers" ON reward_tiers;
CREATE POLICY "public_select_reward_tiers" ON reward_tiers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_reward_items" ON reward_items;
CREATE POLICY "public_select_reward_items" ON reward_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_streak_milestones" ON streak_milestones;
CREATE POLICY "public_select_streak_milestones" ON streak_milestones FOR SELECT
  TO anon, authenticated USING (true);

INSERT INTO reward_tiers (slug, icon, title, requirement, theme, sort_order) VALUES
  ('daily', '🏅', 'Daily Participation', 'Complete any challenge', 'blue', 1),
  ('weekly', '🎖️', 'Weekly Champion', 'Top 1 nationally in any weekly challenge', 'emerald', 2),
  ('monthly', '🏆', 'Monthly Grand Champion', 'Highest total score in a calendar month', 'amber', 3),
  ('annual', '👑', 'Annual Nepal Champion', 'Highest cumulative score for the academic year', 'red', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO reward_items (tier_id, label, description, sort_order)
SELECT t.id, v.label, v.description, v.sort_order
FROM (VALUES
  ('daily', 'Participation Certificate', 'Digital PDF certificate for every challenge completed', 1),
  ('daily', 'Participation Badge', 'Collectible digital badge added to your profile', 2),
  ('daily', 'Score History Entry', 'Permanent record in your SmartLeague portfolio', 3),
  ('weekly', 'Winner Certificate', 'Official SmartLeague Weekly Winner certificate', 1),
  ('weekly', 'Rs. 2,000 Scholarship Credit', 'Credited toward SmartLeague learning resources', 2),
  ('weekly', 'Silver Thinker Badge', 'Exclusive silver badge for weekly winners', 3),
  ('weekly', 'District Trophy Points', '+100 bonus points added to district total', 4),
  ('monthly', 'Laptop (15" Notebook)', 'Brand new laptop for top monthly scorer', 1),
  ('monthly', 'Rs. 15,000 Scholarship', 'Cash scholarship for educational purposes', 2),
  ('monthly', 'Gold Champion Medal', 'Physical engraved medal shipped to your home', 3),
  ('monthly', 'Feature Story', 'Profile featured on SmartLeague website & social media', 4),
  ('monthly', 'Gold Crown Badge', 'Ultra-rare gold crown badge on your profile', 5),
  ('annual', 'Full Academic Scholarship', 'Rs. 1,00,000 scholarship for higher studies', 1),
  ('annual', 'National Recognition Award', 'Award ceremony in Kathmandu', 2),
  ('annual', 'Laptop + Tablet Bundle', 'Premium tech bundle for academic excellence', 3),
  ('annual', 'National Champion Badge', 'Permanent elite badge — only 1 per year', 4),
  ('annual', 'Nepal Media Coverage', 'Feature in national newspapers and media', 5)
) AS v(tier_slug, label, description, sort_order)
JOIN reward_tiers t ON t.slug = v.tier_slug
ON CONFLICT (tier_id, label) DO NOTHING;

INSERT INTO streak_milestones (weeks, icon, name, description, theme, sort_order) VALUES
  (3, '⚡', 'Streak Starter', 'Complete 3 consecutive challenges', 'blue', 1),
  (5, '🔥', 'Fire Streak', 'Complete 5 consecutive challenges', 'orange', 2),
  (10, '💎', 'Diamond Thinker', 'Complete 10 consecutive challenges', 'sky', 3),
  (20, '🌟', 'Legend Status', 'Complete 20 consecutive challenges', 'amber', 4)
ON CONFLICT (weeks) DO NOTHING;

INSERT INTO badges (name, description, icon, badge_type, rarity) VALUES
  ('Social Thinker', 'Score above 0.80 average per question', '🧠', 'achievement', 'Common'),
  ('Sharpshooter', 'Win district rank #1 once', '🎯', 'rank', 'Rare'),
  ('Weekly Champion', 'Win a weekly challenge nationally', '🏆', 'rank', 'Epic'),
  ('Rising Star', 'Enter top 100 nationally', '⭐', 'rank', 'Rare'),
  ('District Hero', 'Lead your district''s points tally', '📍', 'rank', 'Rare'),
  ('Monthly Champion', 'Win monthly leaderboard once', '👑', 'rank', 'Legendary'),
  ('Fair Player', 'Complete 10 challenges with no flags', '🛡️', 'achievement', 'Common'),
  ('Curious Mind', 'Answer all curiosity questions first', '💡', 'achievement', 'Rare')
ON CONFLICT (name) DO NOTHING;
