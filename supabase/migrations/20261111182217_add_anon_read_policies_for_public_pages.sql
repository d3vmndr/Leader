/*
# Add public read access for anonymous visitors

## Problem
The homepage, leaderboard, rewards, and districts pages load data without requiring sign-in.
However, tables like profiles, district_stats, challenges, badges, leaderboard_entries, questions, and options
only had SELECT policies for `authenticated` users. Anonymous visitors (anon role) got zero rows,
making public pages appear empty or error out.

## Changes
1. Adds SELECT policies for `anon` role on publicly-visible content tables:
   - `profiles` — leaderboard and homepage display names, scores, districts
   - `district_stats` — district preview on homepage and districts page
   - `challenges` — challenge count on homepage and challenge listing
   - `badges` — badge catalog on rewards page
   - `leaderboard_entries` — leaderboard data (via challenge_results view)
   - `questions` — challenge questions shown when taking a challenge
   - `options` — answer options for challenge questions
   - `user_badges` — badge counts for leaderboard display

2. No write access is granted to anon — all inserts/updates/deletes remain admin-only or authenticated-only.

3. Existing policies are preserved (drop + recreate pattern for idempotency).

## Security Notes
- All data exposed is intentionally public competition content (scores, rankings, districts, challenges).
- No sensitive data (emails, passwords, parent phone numbers) is in these tables' public-facing columns.
- profiles has column-level UPDATE restricted already (no phone/email columns are updatable by users).
- Write operations remain restricted to authenticated/admin users via existing policies.
*/

-- profiles: allow anon to read public profile info (leaderboard display)
DROP POLICY IF EXISTS "anon_view_profiles" ON profiles;
CREATE POLICY "anon_view_profiles" ON profiles FOR SELECT
  TO anon USING (true);

-- district_stats: allow anon to read district statistics
DROP POLICY IF EXISTS "anon_view_district_stats" ON district_stats;
CREATE POLICY "anon_view_district_stats" ON district_stats FOR SELECT
  TO anon USING (true);

-- challenges: allow anon to read challenge listings
DROP POLICY IF EXISTS "anon_view_challenges" ON challenges;
CREATE POLICY "anon_view_challenges" ON challenges FOR SELECT
  TO anon USING (true);

-- badges: allow anon to read badge catalog
DROP POLICY IF EXISTS "anon_view_badges" ON badges;
CREATE POLICY "anon_view_badges" ON badges FOR SELECT
  TO anon USING (true);

-- leaderboard_entries: allow anon to read leaderboard data
DROP POLICY IF EXISTS "anon_view_leaderboard" ON leaderboard_entries;
CREATE POLICY "anon_view_leaderboard" ON leaderboard_entries FOR SELECT
  TO anon USING (true);

-- questions: allow anon to read challenge questions
DROP POLICY IF EXISTS "anon_view_questions" ON questions;
CREATE POLICY "anon_view_questions" ON questions FOR SELECT
  TO anon USING (true);

-- options: allow anon to read answer options
DROP POLICY IF EXISTS "anon_view_options" ON options;
CREATE POLICY "anon_view_options" ON options FOR SELECT
  TO anon USING (true);

-- user_badges: allow anon to read badge awards (for leaderboard display)
DROP POLICY IF EXISTS "anon_view_user_badges" ON user_badges;
CREATE POLICY "anon_view_user_badges" ON user_badges FOR SELECT
  TO anon USING (true);
