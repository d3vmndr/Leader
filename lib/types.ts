export interface Profile {
  id: string;
  full_name: string;
  username: string;
  school_name: string;
  district: string;
  province: string;
  parent_phone?: string;
  total_score: number;
  national_rank?: number;
  district_rank?: number;
  streak: number;
  challenges_participated: number;
  is_admin: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  scheduled_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'closed' | 'results_published';
  duration_minutes: number;
  total_questions: number;
  day_type: 'monday' | 'friday';
  created_at: string;
}

export interface Question {
  id: string;
  challenge_id: string;
  question_text: string;
  question_type: 'emotional_intelligence' | 'social_reasoning' | 'analytical' | 'ethical' | 'curiosity' | 'leadership' | 'creative' | 'opinion';
  order_index: number;
  options: Option[];
}

export interface Option {
  id: string;
  question_id: string;
  option_label: 'A' | 'B' | 'C' | 'D';
  option_text: string;
  selection_count: number;
  score: number;
}

export interface Response {
  id: string;
  user_id: string;
  challenge_id: string;
  question_id: string;
  option_id: string;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  challenge_id: string;
  total_score: number;
  national_rank?: number;
  district_rank?: number;
  profile?: Profile;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge_type: 'achievement' | 'streak' | 'rank' | 'participation' | 'special';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface RewardItem {
  id: string;
  tier_id: string;
  label: string;
  description: string;
  sort_order: number;
}

export interface RewardTier {
  id: string;
  slug: string;
  icon: string;
  title: string;
  requirement: string;
  theme: 'blue' | 'emerald' | 'amber' | 'red';
  sort_order: number;
  reward_items: RewardItem[];
}

export interface StreakMilestone {
  id: string;
  weeks: number;
  icon: string;
  name: string;
  description: string;
  theme: 'blue' | 'orange' | 'sky' | 'amber';
  sort_order: number;
}

export interface DistrictStat {
  id: string;
  district_name: string;
  province: string;
  total_students: number;
  active_students: number;
  total_points: number;
  average_score: number;
  national_rank?: number;
}

export interface UserAnswer {
  question_id: string;
  option_id: string;
  option_label: string;
}

export interface ChallengeResult {
  challenge_id: string;
  total_score: number;
  national_rank: number;
  district_rank: number;
  answers: {
    question: Question;
    selected_option: Option;
    earned_score: number;
  }[];
}
