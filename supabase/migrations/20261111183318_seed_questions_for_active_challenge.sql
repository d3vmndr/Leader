/*
# Seed questions and options for the active challenge

## Purpose
The challenge page loads the active challenge but finds no questions, so it shows
"No active challenges found right now." This migration seeds 5 sample questions
(with 4 options each) for the existing active challenge so the challenge flow works end-to-end.

## Safety
- Inserts only — no tables, columns, or policies modified.
- Uses the existing active challenge by looking it up (no hardcoded ids).
- ON CONFLICT DO NOTHING so re-running is safe.
*/

DO $$
DECLARE
  active_challenge_id uuid;
  q1_id uuid;
  q2_id uuid;
  q3_id uuid;
  q4_id uuid;
  q5_id uuid;
BEGIN
  SELECT id INTO active_challenge_id FROM challenges WHERE status = 'active' LIMIT 1;
  IF active_challenge_id IS NULL THEN
    RAISE NOTICE 'No active challenge found — skipping seed.';
    RETURN;
  END IF;

  -- Question 1
  INSERT INTO questions (challenge_id, question_text, question_type, order_index)
  VALUES (active_challenge_id, 'Your friend is visibly upset after a poor exam result. What do you do?', 'emotional_intelligence', 1)
  RETURNING id INTO q1_id;

  INSERT INTO options (question_id, option_label, option_text) VALUES
    (q1_id, 'A', 'Give them space and check in later when they seem calmer'),
    (q1_id, 'B', 'Immediately tell them about your good score to cheer them up'),
    (q1_id, 'C', 'Ask them what happened and listen without offering advice right away'),
    (q1_id, 'D', 'Suggest they study harder next time');

  -- Question 2
  INSERT INTO questions (challenge_id, question_text, question_type, order_index)
  VALUES (active_challenge_id, 'A group project member is not contributing. How do you handle it?', 'social_reasoning', 2)
  RETURNING id INTO q2_id;

  INSERT INTO options (question_id, option_label, option_text) VALUES
    (q2_id, 'A', 'Talk to them privately to understand what is going on'),
    (q2_id, 'B', 'Report them to the teacher immediately'),
    (q2_id, 'C', 'Do their share yourself to keep the project on track'),
    (q2_id, 'D', 'Confront them in front of the whole group');

  -- Question 3
  INSERT INTO questions (challenge_id, question_text, question_type, order_index)
  VALUES (active_challenge_id, 'You see a younger student being bullied in the hallway. What is your first move?', 'ethical', 3)
  RETURNING id INTO q3_id;

  INSERT INTO options (question_id, option_label, option_text) VALUES
    (q3_id, 'A', 'Step in and tell the bullies to stop, right there'),
    (q3_id, 'B', 'Walk past — it is not your problem'),
    (q3_id, 'C', 'Find a teacher or staff member and report it'),
    (q3_id, 'D', 'Comfort the younger student afterward but do not intervene directly');

  -- Question 4
  INSERT INTO questions (challenge_id, question_text, question_type, order_index)
  VALUES (active_challenge_id, 'You are curious about a topic not covered in class. What do you do?', 'curiosity', 4)
  RETURNING id INTO q4_id;

  INSERT INTO options (question_id, option_label, option_text) VALUES
    (q4_id, 'A', 'Research it online and read everything you can find'),
    (q4_id, 'B', 'Wait until a teacher mentions it someday'),
    (q4_id, 'C', 'Ask a friend if they know anything about it'),
    (q4_id, 'D', 'Forget about it — if it were important, school would teach it');

  -- Question 5
  INSERT INTO questions (challenge_id, question_text, question_type, order_index)
  VALUES (active_challenge_id, 'Your team is losing a debate competition. How do you rally them?', 'leadership', 5)
  RETURNING id INTO q5_id;

  INSERT INTO options (question_id, option_label, option_text) VALUES
    (q5_id, 'A', 'Remind the team of their strengths and refocus on one strong argument'),
    (q5_id, 'B', 'Tell them to just finish and get it over with'),
    (q5_id, 'C', 'Take over and present all remaining points yourself'),
    (q5_id, 'D', 'Suggest they concede gracefully to save energy');
END $$;
