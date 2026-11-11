/*
# Seed initial content for SmartLeague

## Purpose
The database tables exist but are empty, so pages show no content. This migration seeds:
1. All 77 Nepal districts into `district_stats` with zero stats (ready for real data).
2. Three sample challenges (one active, one upcoming, one closed).
3. Four sample blogs.
4. Four sample notices.

## Safety
- All inserts use ON CONFLICT DO NOTHING — re-running is safe and won't create duplicates.
- No user data is touched.
- No tables, columns, or policies are modified.
*/

-- 1. Seed all 77 districts into district_stats
INSERT INTO district_stats (district_name, province, total_students, active_students, total_points, average_score)
SELECT d.name, d.province, 0, 0, 0, 0
FROM (VALUES
  ('Taplejung', 'Koshi Province'), ('Panchthar', 'Koshi Province'), ('Ilam', 'Koshi Province'),
  ('Jhapa', 'Koshi Province'), ('Morang', 'Koshi Province'), ('Sunsari', 'Koshi Province'),
  ('Dhankuta', 'Koshi Province'), ('Terhathum', 'Koshi Province'), ('Sankhuwasabha', 'Koshi Province'),
  ('Bhojpur', 'Koshi Province'), ('Solukhumbu', 'Koshi Province'), ('Okhaldhunga', 'Koshi Province'),
  ('Khotang', 'Koshi Province'), ('Udayapur', 'Koshi Province'),
  ('Saptari', 'Madhesh Province'), ('Siraha', 'Madhesh Province'), ('Dhanusha', 'Madhesh Province'),
  ('Mahottari', 'Madhesh Province'), ('Sarlahi', 'Madhesh Province'), ('Rautahat', 'Madhesh Province'),
  ('Bara', 'Madhesh Province'), ('Parsa', 'Madhesh Province'),
  ('Sindhuli', 'Bagmati Province'), ('Ramechhap', 'Bagmati Province'), ('Dolakha', 'Bagmati Province'),
  ('Sindhupalchok', 'Bagmati Province'), ('Kavrepalanchok', 'Bagmati Province'), ('Lalitpur', 'Bagmati Province'),
  ('Bhaktapur', 'Bagmati Province'), ('Kathmandu', 'Bagmati Province'), ('Nuwakot', 'Bagmati Province'),
  ('Rasuwa', 'Bagmati Province'), ('Dhading', 'Bagmati Province'), ('Makwanpur', 'Bagmati Province'),
  ('Chitwan', 'Bagmati Province'),
  ('Gorkha', 'Gandaki Province'), ('Manang', 'Gandaki Province'), ('Mustang', 'Gandaki Province'),
  ('Myagdi', 'Gandaki Province'), ('Kaski', 'Gandaki Province'), ('Lamjung', 'Gandaki Province'),
  ('Tanahu', 'Gandaki Province'), ('Nawalpur', 'Gandaki Province'), ('Syangja', 'Gandaki Province'),
  ('Parbat', 'Gandaki Province'), ('Baglung', 'Gandaki Province'),
  ('Gulmi', 'Lumbini Province'), ('Palpa', 'Lumbini Province'), ('Nawalparasi East', 'Lumbini Province'),
  ('Rupandehi', 'Lumbini Province'), ('Kapilvastu', 'Lumbini Province'), ('Arghakhanchi', 'Lumbini Province'),
  ('Pyuthan', 'Lumbini Province'), ('Rolpa', 'Lumbini Province'), ('Eastern Rukum', 'Lumbini Province'),
  ('Dang', 'Lumbini Province'), ('Banke', 'Lumbini Province'), ('Bardiya', 'Lumbini Province'),
  ('Dolpa', 'Karnali Province'), ('Mugu', 'Karnali Province'), ('Humla', 'Karnali Province'),
  ('Jumla', 'Karnali Province'), ('Kalikot', 'Karnali Province'), ('Dailekh', 'Karnali Province'),
  ('Jajarkot', 'Karnali Province'), ('Western Rukum', 'Karnali Province'), ('Salyan', 'Karnali Province'),
  ('Surkhet', 'Karnali Province'),
  ('Bajura', 'Sudurpashchim Province'), ('Bajhang', 'Sudurpashchim Province'), ('Achham', 'Sudurpashchim Province'),
  ('Doti', 'Sudurpashchim Province'), ('Kailali', 'Sudurpashchim Province'), ('Kanchanpur', 'Sudurpashchim Province'),
  ('Dadeldhura', 'Sudurpashchim Province'), ('Baitadi', 'Sudurpashchim Province'), ('Darchula', 'Sudurpashchim Province')
) AS d(name, province)
ON CONFLICT (district_name) DO NOTHING;

-- 2. Seed sample challenges
INSERT INTO challenges (title, description, scheduled_date, end_date, status, duration_minutes, total_questions, day_type)
VALUES
  (
    'Challenge 16: Emotional Intelligence in Action',
    'Face 20 real-life scenarios that test how well you understand emotions — yours and those of others. No wrong answers, only your unique perspective.',
    NOW() - INTERVAL '2 hours',
    NOW() + INTERVAL '22 hours',
    'active',
    30,
    20,
    'monday'
  ),
  (
    'Challenge 17: Social Reasoning Sprint',
    'Navigate tricky social situations and show how you would handle peer pressure, teamwork, and conflict.',
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days 12 hours',
    'upcoming',
    30,
    20,
    'friday'
  ),
  (
    'Challenge 15: Thinking Under Pressure',
    'A completed challenge exploring how students make decisions when the clock is ticking.',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '5 days',
    'closed',
    30,
    20,
    'monday'
  )
ON CONFLICT DO NOTHING;

-- 3. Seed sample blogs
INSERT INTO blogs (title, excerpt, content, author, date, read_time, category, image_url, likes, featured)
VALUES
  (
    'Mastering Emotional Intelligence: A Guide to Better Decision Making',
    'Learn how emotional intelligence can transform your approach to strategic thinking and help you excel in SmartLeague challenges.',
    'Emotional intelligence is the foundation of smart decision-making. In this article, we explore how understanding your emotions — and those of people around you — can help you make better choices in SmartLeague challenges and in life.',
    'Dr. Anil Sharma',
    NOW() - INTERVAL '3 days',
    8,
    'Strategy',
    'https://images.pexels.com/photos/3808517/pexels-photo-3808517.jpeg?auto=compress&cs=tinysrgb&w=600',
    342,
    true
  ),
  (
    'The Psychology Behind Strategic Choices',
    'Dive deep into the psychological principles that influence strategic decision-making and cognitive biases to watch out for.',
    'Every choice you make is shaped by cognitive biases — mental shortcuts that can help or hinder your thinking. Learn to recognize them and make smarter decisions.',
    'Prof. Maya Patel',
    NOW() - INTERVAL '6 days',
    12,
    'Psychology',
    'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600',
    287,
    true
  ),
  (
    'How to Improve Your Ranking: Tips from Top 10 Students',
    'Real strategies from Nepal''s top-ranked SmartLeague students. Find out what separates the leaders from the rest.',
    'We interviewed the top 10 ranked students across Nepal. Here are the habits, strategies, and mindsets they share.',
    'SmartLeague Team',
    NOW() - INTERVAL '9 days',
    6,
    'Tips & Tricks',
    'https://images.pexels.com/photos/3938715/pexels-photo-3938715.jpeg?auto=compress&cs=tinysrgb&w=600',
    512,
    true
  ),
  (
    'Building Consistency: Maintaining Your Winning Streak',
    'Discover the daily habits and mental routines of students who maintain long participation streaks.',
    'Consistency is the secret weapon of top performers. Learn how to build a streak that lasts.',
    'Priya Sharma',
    NOW() - INTERVAL '12 days',
    5,
    'Tips & Tricks',
    'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=600',
    234,
    false
  )
ON CONFLICT DO NOTHING;

-- 4. Seed sample notices
INSERT INTO notices (title, description, type, date, is_pinned)
VALUES
  (
    'Challenge 16 Is Now Live',
    'Today''s emotional intelligence challenge is open! You have 24 hours to complete all 20 scenarios. Good luck!',
    'announcement',
    NOW() - INTERVAL '2 hours',
    true
  ),
  (
    'Challenge 15 Results Are Published',
    'Results for last week''s challenge are now available. Check your ranking and detailed performance breakdown on the Results page.',
    'success',
    NOW() - INTERVAL '1 day',
    true
  ),
  (
    'New Feature: Challenge Replays',
    'You can now review and replay previous challenges to improve your strategy. Access this from your Results page.',
    'info',
    NOW() - INTERVAL '3 days',
    false
  ),
  (
    'District Championship Registration Open',
    'Registration for the Nepal District Championship is now open! Compete with top students from your district for prizes and scholarships.',
    'announcement',
    NOW() - INTERVAL '5 days',
    false
  )
ON CONFLICT DO NOTHING;
