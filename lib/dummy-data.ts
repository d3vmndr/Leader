import { Profile, Challenge, Question, LeaderboardEntry, DistrictStat, Badge } from './types';

export const DUMMY_PROFILE: Profile = {
  id: 'user-001',
  full_name: 'Aarav Sharma',
  username: 'aarav_thinks',
  grade: 8,
  school_name: 'Kathmandu Model Secondary School',
  district: 'Kathmandu',
  province: 'Bagmati Province',
  total_score: 14.73,
  national_rank: 47,
  district_rank: 3,
  streak: 5,
  challenges_participated: 12,
  is_admin: false,
  created_at: new Date().toISOString(),
};

export const DUMMY_CHALLENGES: Challenge[] = [
  {
    id: 'ch-001',
    title: 'Monday Minds – Week 18',
    description: 'Test your emotional intelligence and social reasoning in this week\'s Monday challenge!',
    scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    status: 'upcoming',
    duration_minutes: 30,
    total_questions: 20,
    day_type: 'monday',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ch-002',
    title: 'Friday Fire – Week 17',
    description: 'Leadership decisions, ethical choices, and creative thinking. How do you rank?',
    scheduled_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    status: 'results_published',
    duration_minutes: 30,
    total_questions: 20,
    day_type: 'friday',
    created_at: new Date().toISOString(),
  },
];

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q-001',
    challenge_id: 'ch-001',
    question_text: 'Your classmate has been unusually quiet for the entire week. What is your best first step?',
    question_type: 'emotional_intelligence',
    order_index: 1,
    options: [
      { id: 'o-001a', question_id: 'q-001', option_label: 'A', option_text: 'Ask them gently and privately if everything is okay', selection_count: 42, score: 0.42 },
      { id: 'o-001b', question_id: 'q-001', option_label: 'B', option_text: 'Ignore them until they decide to speak up themselves', selection_count: 18, score: 0.18 },
      { id: 'o-001c', question_id: 'q-001', option_label: 'C', option_text: 'Tell the teacher loudly during class to help them', selection_count: 12, score: 0.12 },
      { id: 'o-001d', question_id: 'q-001', option_label: 'D', option_text: 'Make jokes around them to lift the group energy', selection_count: 28, score: 0.28 },
    ],
  },
  {
    id: 'q-002',
    challenge_id: 'ch-001',
    question_text: 'Your project team strongly disagrees on the approach. What is the smartest move?',
    question_type: 'leadership',
    order_index: 2,
    options: [
      { id: 'o-002a', question_id: 'q-002', option_label: 'A', option_text: 'Call a quick vote and go with majority immediately', selection_count: 22, score: 0.22 },
      { id: 'o-002b', question_id: 'q-002', option_label: 'B', option_text: 'Listen to every perspective before making any decision', selection_count: 45, score: 0.45 },
      { id: 'o-002c', question_id: 'q-002', option_label: 'C', option_text: 'Let the smartest student in the group decide for everyone', selection_count: 15, score: 0.15 },
      { id: 'o-002d', question_id: 'q-002', option_label: 'D', option_text: 'Leave the team and work on your own separate idea', selection_count: 18, score: 0.18 },
    ],
  },
  {
    id: 'q-003',
    challenge_id: 'ch-001',
    question_text: 'You find a wallet with Rs. 500 inside near school. What do you do?',
    question_type: 'ethical',
    order_index: 3,
    options: [
      { id: 'o-003a', question_id: 'q-003', option_label: 'A', option_text: 'Hand it to the school administration immediately', selection_count: 38, score: 0.38 },
      { id: 'o-003b', question_id: 'q-003', option_label: 'B', option_text: 'Keep the money but leave the wallet where it is', selection_count: 10, score: 0.10 },
      { id: 'o-003c', question_id: 'q-003', option_label: 'C', option_text: 'Ask around school if anyone lost their wallet', selection_count: 40, score: 0.40 },
      { id: 'o-003d', question_id: 'q-003', option_label: 'D', option_text: 'Keep it for one week and donate to charity if unclaimed', selection_count: 12, score: 0.12 },
    ],
  },
  {
    id: 'q-004',
    challenge_id: 'ch-001',
    question_text: 'A new student joins your class and sits alone during lunch. What do you do?',
    question_type: 'social_reasoning',
    order_index: 4,
    options: [
      { id: 'o-004a', question_id: 'q-004', option_label: 'A', option_text: 'Invite them to sit with your group right away', selection_count: 50, score: 0.50 },
      { id: 'o-004b', question_id: 'q-004', option_label: 'B', option_text: 'Wave from a distance but continue with your friends', selection_count: 25, score: 0.25 },
      { id: 'o-004c', question_id: 'q-004', option_label: 'C', option_text: 'Wait for them to approach first before talking', selection_count: 20, score: 0.20 },
      { id: 'o-004d', question_id: 'q-004', option_label: 'D', option_text: 'Tell your teacher the new student needs attention', selection_count: 5, score: 0.05 },
    ],
  },
  {
    id: 'q-005',
    challenge_id: 'ch-001',
    question_text: 'If you could instantly learn any skill, which would benefit you most in 10 years?',
    question_type: 'curiosity',
    order_index: 5,
    options: [
      { id: 'o-005a', question_id: 'q-005', option_label: 'A', option_text: 'Programming and artificial intelligence', selection_count: 35, score: 0.35 },
      { id: 'o-005b', question_id: 'q-005', option_label: 'B', option_text: 'Public speaking and leadership', selection_count: 28, score: 0.28 },
      { id: 'o-005c', question_id: 'q-005', option_label: 'C', option_text: 'Creative arts and content creation', selection_count: 20, score: 0.20 },
      { id: 'o-005d', question_id: 'q-005', option_label: 'D', option_text: 'Financial literacy and business', selection_count: 17, score: 0.17 },
    ],
  },
];

export const DUMMY_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'le-001', user_id: 'u1', challenge_id: 'ch-002', total_score: 16.84,
    national_rank: 1, district_rank: 1,
    profile: { id: 'u1', full_name: 'Priya Adhikari', username: 'priya_smart', grade: 9, school_name: 'Bagmati High School', district: 'Lalitpur', province: 'Bagmati Province', total_score: 16.84, national_rank: 1, district_rank: 1, streak: 8, challenges_participated: 18, is_admin: false, created_at: '' },
  },
  {
    id: 'le-002', user_id: 'u2', challenge_id: 'ch-002', total_score: 16.21,
    national_rank: 2, district_rank: 1,
    profile: { id: 'u2', full_name: 'Rohan Thapa', username: 'rohan_reasons', grade: 8, school_name: 'Pokhara Secondary School', district: 'Kaski', province: 'Gandaki Province', total_score: 16.21, national_rank: 2, district_rank: 1, streak: 6, challenges_participated: 15, is_admin: false, created_at: '' },
  },
  {
    id: 'le-003', user_id: 'u3', challenge_id: 'ch-002', total_score: 15.97,
    national_rank: 3, district_rank: 2,
    profile: { id: 'u3', full_name: 'Sita Rai', username: 'sita_analytical', grade: 9, school_name: 'Biratnagar Model School', district: 'Morang', province: 'Koshi Province', total_score: 15.97, national_rank: 3, district_rank: 2, streak: 7, challenges_participated: 20, is_admin: false, created_at: '' },
  },
  {
    id: 'le-004', user_id: 'u4', challenge_id: 'ch-002', total_score: 15.62,
    national_rank: 4, district_rank: 1,
    profile: { id: 'u4', full_name: 'Bikash Gurung', username: 'bikash_g', grade: 8, school_name: 'Chitwan Valley School', district: 'Chitwan', province: 'Bagmati Province', total_score: 15.62, national_rank: 4, district_rank: 1, streak: 4, challenges_participated: 10, is_admin: false, created_at: '' },
  },
  {
    id: 'le-005', user_id: 'u5', challenge_id: 'ch-002', total_score: 15.44,
    national_rank: 5, district_rank: 2,
    profile: { id: 'u5', full_name: 'Nisha Karki', username: 'nisha_thinks', grade: 9, school_name: 'Butwal Secondary School', district: 'Rupandehi', province: 'Lumbini Province', total_score: 15.44, national_rank: 5, district_rank: 2, streak: 5, challenges_participated: 13, is_admin: false, created_at: '' },
  },
  {
    id: 'le-006', user_id: 'u6', challenge_id: 'ch-002', total_score: 15.20,
    national_rank: 6, district_rank: 3,
    profile: { id: 'u6', full_name: 'Aakash Shrestha', username: 'aakash_s', grade: 8, school_name: 'Kathmandu Model School', district: 'Kathmandu', province: 'Bagmati Province', total_score: 15.20, national_rank: 6, district_rank: 3, streak: 3, challenges_participated: 9, is_admin: false, created_at: '' },
  },
  {
    id: 'le-007', user_id: 'u7', challenge_id: 'ch-002', total_score: 14.98,
    national_rank: 7, district_rank: 1,
    profile: { id: 'u7', full_name: 'Dipa Tamang', username: 'dipa_curious', grade: 9, school_name: 'Jhapa Public School', district: 'Jhapa', province: 'Koshi Province', total_score: 14.98, national_rank: 7, district_rank: 1, streak: 6, challenges_participated: 16, is_admin: false, created_at: '' },
  },
  {
    id: 'le-008', user_id: 'user-001', challenge_id: 'ch-002', total_score: 14.73,
    national_rank: 47, district_rank: 3,
    profile: DUMMY_PROFILE,
  },
];

export const DUMMY_DISTRICT_STATS: DistrictStat[] = [
  { id: 'ds-001', district_name: 'Kathmandu', province: 'Bagmati Province', total_students: 842, active_students: 721, total_points: 9847.23, average_score: 11.69, national_rank: 1 },
  { id: 'ds-002', district_name: 'Lalitpur', province: 'Bagmati Province', total_students: 534, active_students: 478, total_points: 6234.55, average_score: 11.67, national_rank: 2 },
  { id: 'ds-003', district_name: 'Kaski', province: 'Gandaki Province', total_students: 412, active_students: 387, total_points: 4891.34, average_score: 11.87, national_rank: 3 },
  { id: 'ds-004', district_name: 'Morang', province: 'Koshi Province', total_students: 389, active_students: 345, total_points: 4234.90, average_score: 10.89, national_rank: 4 },
  { id: 'ds-005', district_name: 'Chitwan', province: 'Bagmati Province', total_students: 356, active_students: 312, total_points: 3987.67, average_score: 11.19, national_rank: 5 },
  { id: 'ds-006', district_name: 'Rupandehi', province: 'Lumbini Province', total_students: 298, active_students: 267, total_points: 3234.55, average_score: 10.85, national_rank: 6 },
  { id: 'ds-007', district_name: 'Jhapa', province: 'Koshi Province', total_students: 287, active_students: 254, total_points: 3019.88, average_score: 10.52, national_rank: 7 },
  { id: 'ds-008', district_name: 'Bhaktapur', province: 'Bagmati Province', total_students: 245, active_students: 221, total_points: 2854.23, average_score: 11.64, national_rank: 8 },
  { id: 'ds-009', district_name: 'Sunsari', province: 'Koshi Province', total_students: 234, active_students: 198, total_points: 2234.45, average_score: 9.54, national_rank: 9 },
  { id: 'ds-010', district_name: 'Dang', province: 'Lumbini Province', total_students: 198, active_students: 167, total_points: 1934.56, average_score: 9.77, national_rank: 10 },
];

export const DUMMY_BADGES: Badge[] = [
  { id: 'b-001', name: 'Bronze Thinker', description: 'Complete your first challenge', icon: 'award', badge_type: 'participation' },
  { id: 'b-002', name: 'Silver Analyst', description: 'Complete 5 challenges', icon: 'award', badge_type: 'achievement' },
  { id: 'b-003', name: 'Gold Champion', description: 'Complete 10 challenges', icon: 'trophy', badge_type: 'achievement' },
  { id: 'b-004', name: 'Streak Master', description: 'Maintain a 3-week streak', icon: 'zap', badge_type: 'streak' },
  { id: 'b-005', name: 'Rising Star', description: 'Enter national top 100', icon: 'star', badge_type: 'rank' },
];

export const USER_BADGES_EARNED = ['b-001', 'b-002', 'b-004', 'b-005'];

export const RECENT_CHALLENGES = [
  { challenge: 'Friday Fire – Week 17', score: 14.73, rank: 47, date: '5 days ago' },
  { challenge: 'Monday Minds – Week 17', score: 13.92, rank: 63, date: '8 days ago' },
  { challenge: 'Friday Fire – Week 16', score: 15.21, rank: 31, date: '12 days ago' },
  { challenge: 'Monday Minds – Week 16', score: 12.88, rank: 89, date: '15 days ago' },
];
