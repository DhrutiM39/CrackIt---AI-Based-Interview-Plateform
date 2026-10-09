-- Interview lifecycle hardening.
-- Applies only to the existing interview_sessions, interview_questions,
-- and interview_answers tables defined in database/schema.sql.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'interview_questions_session_sequence_unique'
    ) THEN
        ALTER TABLE public.interview_questions
            ADD CONSTRAINT interview_questions_session_sequence_unique
            UNIQUE (session_id, sequence_no);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'interview_answers_question_unique'
    ) THEN
        ALTER TABLE public.interview_answers
            ADD CONSTRAINT interview_answers_question_unique
            UNIQUE (question_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'interview_answers_score_range'
    ) THEN
        ALTER TABLE public.interview_answers
            ADD CONSTRAINT interview_answers_score_range
            CHECK (ai_score IS NULL OR (ai_score >= 0 AND ai_score <= 100));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_status
    ON public.interview_sessions (user_id, status);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_started_at
    ON public.interview_sessions (user_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_interview_questions_session_sequence
    ON public.interview_questions (session_id, sequence_no);

CREATE INDEX IF NOT EXISTS idx_interview_answers_question_id
    ON public.interview_answers (question_id);

CREATE INDEX IF NOT EXISTS idx_interview_reports_session_id
    ON public.interview_reports (session_id);
