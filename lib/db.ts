'use client';

import { supabase } from './supabase';
import { Profile, Badge, Challenge } from './types';

export const db = {
  // ---------- CHALLENGES CRUD ----------
  async getChallenges() {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('scheduled_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createChallenge(val: any) {
    const { data, error } = await supabase
      .from('challenges')
      .insert({
        status: 'upcoming',
        ...val
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateChallenge(id: string, val: any) {
    const { data, error } = await supabase
      .from('challenges')
      .update(val)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteChallenge(id: string) {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---------- QUESTIONS & OPTIONS CRUD ----------
  async getQuestions(challengeId?: string) {
    let query = supabase.from('questions').select('*, options(*)').order('order_index');
    if (challengeId) {
      query = query.eq('challenge_id', challengeId);
    }
    const { data, error } = await query;
    if (error) throw error;

    return data?.map(q => ({
      ...q,
      options: q.options || [],
      question_options: q.options || []
    })) || [];
  },

  async createQuestion(val: any, options: { option_label: 'A' | 'B' | 'C' | 'D', option_text: string, score: number }[]) {
    // Insert question
    const { data: qData, error: qErr } = await supabase
      .from('questions')
      .insert({
        challenge_id: val.challenge_id,
        question_text: val.question_text,
        question_type: val.question_type,
        order_index: val.order_index || 0
      })
      .select()
      .single();
    if (qErr) throw qErr;

    // Insert options
    const newOpts = options.map(opt => ({
      question_id: qData.id,
      selection_count: 0,
      ...opt
    }));
    const { data: optData, error: optErr } = await supabase
      .from('options')
      .insert(newOpts)
      .select();
    if (optErr) throw optErr;

    return { ...qData, options: optData, question_options: optData };
  },

  async updateQuestion(id: string, val: any, options?: any[]) {
    const { data: qData, error: qErr } = await supabase
      .from('questions')
      .update(val)
      .eq('id', id)
      .select()
      .single();
    if (qErr) throw qErr;

    if (options) {
      for (const opt of options) {
        await supabase
          .from('options')
          .update({
            option_text: opt.option_text,
            score: opt.score
          })
          .eq('id', opt.id);
      }
    }
    return qData;
  },

  async deleteQuestion(id: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---------- BLOGS CRUD ----------
  async getBlogs() {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createBlog(val: any) {
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        likes: 0,
        ...val
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateBlog(id: string, val: any) {
    const { data, error } = await supabase
      .from('blogs')
      .update(val)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteBlog(id: string) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---------- NOTICES CRUD ----------
  async getNotices() {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createNotice(val: any) {
    const { data, error } = await supabase
      .from('notices')
      .insert(val)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateNotice(id: string, val: any) {
    const { data, error } = await supabase
      .from('notices')
      .update(val)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteNotice(id: string) {
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ---------- PROFILES ----------
  async getProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('total_score', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, val: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(val)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ---------- RESPONSES & SUBMISSIONS ----------
  async submitAnswers(userId: string, challengeId: string, answers: Record<string, string>) {
    const responseRows = Object.entries(answers).map(([qId, oId]) => ({
      user_id: userId,
      challenge_id: challengeId,
      question_id: qId,
      option_id: oId
    }));

    const { error: resErr } = await supabase.from('responses').insert(responseRows);
    if (resErr) throw resErr;

    // Increment selection counts in option rows
    for (const oId of Object.values(answers)) {
      const { data: opt } = await supabase
        .from('options')
        .select('selection_count')
        .eq('id', oId)
        .single();
      if (opt) {
        await supabase
          .from('options')
          .update({ selection_count: (opt.selection_count || 0) + 1 })
          .eq('id', oId);
      }
    }

    // Fetch question options to compute score
    const optionIds = Object.values(answers);
    const { data: selectedOptions } = await supabase
      .from('options')
      .select('score')
      .in('id', optionIds);
    const totalScore = (selectedOptions || []).reduce((sum, opt) => sum + (Number(opt.score) || 0), 0);

    // Insert leaderboard entries
    const newEntry = {
      user_id: userId,
      challenge_id: challengeId,
      total_score: totalScore,
    };
    await supabase.from('leaderboard_entries').upsert(newEntry, { onConflict: 'user_id,challenge_id' });

    // Update user profile total score
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_score, challenges_participated, streak')
      .eq('id', userId)
      .single();
    if (profile) {
      await supabase
        .from('profiles')
        .update({
          total_score: (profile.total_score || 0) + totalScore,
          challenges_participated: (profile.challenges_participated || 0) + 1,
          streak: (profile.streak || 0) + 1
        })
        .eq('id', userId);
    }

    return { score: totalScore };
  },

  async getRecentResults(userId: string) {
    const { data, error } = await supabase
      .from('challenge_results')
      .select(`
        score,
        rank,
        completed_at,
        challenges (title)
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data || [];
  },

  // ---------- DISTRICT STATS ----------
  async getDistrictStats() {
    const { data, error } = await supabase
      .from('district_stats')
      .select('*')
      .order('average_score', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // ---------- BADGES ----------
  async getBadges(): Promise<Badge[]> {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('order_index');
    if (error) throw error;
    return data || [];
  },

  async getUserBadges(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  },

  // ---------- UPCOMING CHALLENGE ----------
  async getUpcomingChallenge(): Promise<Challenge | null> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('status', 'upcoming')
      .gte('scheduled_date', new Date().toISOString())
      .order('scheduled_date', { ascending: true })
      .limit(1);
    if (error) throw error;
    return data?.[0] || null;
  },

  // ---------- LEADERBOARD RESULTS ----------
  async getLeaderboardResults(sinceDate: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('challenge_results')
      .select('user_id, score, profiles(full_name, school_name, district, streak)')
      .gte('completed_at', sinceDate)
      .not('score', 'is', null);
    if (error) throw error;
    return data || [];
  },

  // ---------- SCORING ENGINE (ADMIN) ----------
  async calculateScores() {
    // 1. Fetch closed challenges
    const { data: closedChallenges } = await supabase
      .from('challenges')
      .select('id')
      .eq('status', 'closed');
    if (!closedChallenges || closedChallenges.length === 0) {
      return { message: 'No closed challenges to process.' };
    }

    let processedCount = 0;
    for (const ch of closedChallenges) {
      // 2. Fetch all responses for this challenge
      const { data: responses } = await supabase
        .from('responses')
        .select('user_id, question_id, option_id')
        .eq('challenge_id', ch.id);
      if (!responses || responses.length === 0) continue;

      // 3. Fetch all questions for this challenge
      const { data: questions } = await supabase
        .from('questions')
        .select('id')
        .eq('challenge_id', ch.id);
      if (!questions) continue;

      // Update options scores based on selection counts
      for (const q of questions) {
        const qResponses = responses.filter(r => r.question_id === q.id);
        const total = qResponses.length;
        if (total === 0) continue;

        const { data: options } = await supabase
          .from('options')
          .select('id')
          .eq('question_id', q.id);
        if (options) {
          for (const opt of options) {
            const count = qResponses.filter(r => r.option_id === opt.id).length;
            const score = count / total;
            await supabase
              .from('options')
              .update({ selection_count: count, score })
              .eq('id', opt.id);
          }
        }
      }

      // 4. Calculate individual user totals
      const userIds = Array.from(new Set(responses.map(r => r.user_id)));
      const scoresList: { userId: string, score: number }[] = [];

      for (const uId of userIds) {
        const uResponses = responses.filter(r => r.user_id === uId);
        let userScore = 0;

        for (const res of uResponses) {
          const { data: opt } = await supabase
            .from('options')
            .select('score')
            .eq('id', res.option_id)
            .single();
          if (opt) {
            userScore += Number(opt.score) || 0;
          }
        }
        scoresList.push({ userId: uId, score: userScore });
      }

      // 5. Update leaderboard_entries
      scoresList.sort((a, b) => b.score - a.score);
      for (let i = 0; i < scoresList.length; i++) {
        const rank = i + 1;
        await supabase.from('leaderboard_entries').upsert({
          user_id: scoresList[i].userId,
          challenge_id: ch.id,
          total_score: scoresList[i].score,
          national_rank: rank
        }, { onConflict: 'user_id,challenge_id' });
      }
      processedCount++;
    }

    // 6. Update global profile ranks based on sum of scores
    const { data: profiles } = await supabase.from('profiles').select('id');
    if (profiles) {
      const globalScores: { id: string, total: number }[] = [];
      for (const p of profiles) {
        const { data: entries } = await supabase
          .from('leaderboard_entries')
          .select('total_score')
          .eq('user_id', p.id);
        const total = (entries || []).reduce((sum, e) => sum + (Number(e.total_score) || 0), 0);
        globalScores.push({ id: p.id, total });
      }

      globalScores.sort((a, b) => b.total - a.total);
      for (let i = 0; i < globalScores.length; i++) {
        await supabase
          .from('profiles')
          .update({
            total_score: globalScores[i].total,
            national_rank: i + 1
          })
          .eq('id', globalScores[i].id);
      }
    }

    return { message: `Scoring complete! Calculated scores across ${processedCount} challenges.` };
  }
};
