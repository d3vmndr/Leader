
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://cuuwrqnyorklupknsqwv.supabase.co';
const supabaseAnonKey = 'sb_publishable_H72lgb72cDWLNJBQdYUjMQ_Zg-8pE4p';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          username: string;
          player_type: string;
          school_name: string;
          district: string;
          province: string;
          parent_phone: string;
          total_score: number;
          national_rank: number | null;
          district_rank: number | null;
          streak: number;
          challenges_participated: number;
          is_admin: boolean;
          avatar_url: string;
          created_at: string;
          updated_at: string;
        };
      };
      challenges: {
        Row: {
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
        };
      };
    };
  };
};
