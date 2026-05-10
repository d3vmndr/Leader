
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
