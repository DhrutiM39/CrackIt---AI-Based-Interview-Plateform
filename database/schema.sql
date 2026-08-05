-- =====================================================
-- Indus3 Database Schema
-- Database: PostgreSQL (Supabase)
-- =====================================================

-- =====================================================
-- USERS MODULE
-- =====================================================

-- =====================================================
-- USERS MODULE
-- =====================================================

CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,

    profile_photo TEXT,

    target_job_role TEXT,

    experience_level VARCHAR(20)
        CHECK (experience_level IN ('Fresher','Student','0-1 Years','1-3 Years','3-5 Years','5+ Years')),

    streak_count INTEGER NOT NULL DEFAULT 0 CHECK (streak_count >= 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.user_settings (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL UNIQUE
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    theme VARCHAR(20) DEFAULT 'light'
        CHECK (theme IN ('light','dark','system')),

    language VARCHAR(20) DEFAULT 'en',

    email_notifications BOOLEAN DEFAULT TRUE,

    push_notifications BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

-- ==========================================
-- UPDATED FOR NOTIFICATIONS MODULE
-- ==========================================

CREATE TABLE public.notifications (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    notification_type VARCHAR(50) NOT NULL,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RESUME ANALYZER MODULE
-- =====================================================

CREATE TABLE public.resume_analysis (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    resume_file_url TEXT NOT NULL,

    parsed_text TEXT,

    ats_score NUMERIC(5,2)
        CHECK (ats_score >= 0 AND ats_score <= 100),

    ai_feedback TEXT,

    uploaded_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.skills (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    skill_name VARCHAR(100) UNIQUE NOT NULL,

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.resume_skills (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    resume_id BIGINT NOT NULL
        REFERENCES public.resume_analysis(id)
        ON DELETE CASCADE,

    skill_id BIGINT NOT NULL
        REFERENCES public.skills(id)
        ON DELETE CASCADE,

    confidence_score NUMERIC(5,2)
        CHECK (confidence_score >= 0 AND confidence_score <= 100),

    UNIQUE(resume_id, skill_id),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- UPDATED FOR LINKEDIN AND PROJECT MODULES
-- ==========================================

CREATE TABLE public.linkedin_analysis (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    linkedin_url TEXT NOT NULL,

    profile_data JSONB,

    analysis_score NUMERIC(5,2)
        CHECK (analysis_score >= 0 AND analysis_score <= 100),

    ai_suggestions TEXT,

    analyzed_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROJECT ANALYZER MODULE
-- =====================================================

CREATE TABLE public.projects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    project_title VARCHAR(255) NOT NULL,

    description TEXT,

    github_url TEXT,

    live_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.technologies (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    technology_name VARCHAR(100) UNIQUE NOT NULL,

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.project_technologies (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    project_id BIGINT NOT NULL
        REFERENCES public.projects(id)
        ON DELETE CASCADE,

    technology_id BIGINT NOT NULL
        REFERENCES public.technologies(id)
        ON DELETE CASCADE,

    UNIQUE(project_id, technology_id),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.project_analysis (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    project_id BIGINT NOT NULL UNIQUE
        REFERENCES public.projects(id)
        ON DELETE CASCADE,

    ai_score NUMERIC(5,2)
        CHECK (ai_score >= 0 AND ai_score <= 100),

    strengths TEXT,

    weaknesses TEXT,

    suggestions TEXT,

    analyzed_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUBJECT PREPARATION MODULE
-- =====================================================

-- ==========================================
-- UPDATED FOR SUBJECTS MODULE
-- ==========================================

CREATE TABLE public.subjects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    subject_name VARCHAR(100) NOT NULL UNIQUE,

    icon TEXT,

    difficulty VARCHAR(20)
        CHECK (difficulty IN ('Easy','Medium','Hard')),

    tags TEXT[],

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.topics (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    subject_id BIGINT NOT NULL
        REFERENCES public.subjects(id)
        ON DELETE CASCADE,

    topic_name VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.questions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    topic_id BIGINT NOT NULL
        REFERENCES public.topics(id)
        ON DELETE CASCADE,

    question TEXT NOT NULL,

    answer TEXT,

    difficulty VARCHAR(20)
        CHECK (difficulty IN ('Easy','Medium','Hard')),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    tag_name VARCHAR(100) UNIQUE NOT NULL,

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.question_tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    question_id BIGINT NOT NULL
        REFERENCES public.questions(id)
        ON DELETE CASCADE,

    tag_id BIGINT NOT NULL
        REFERENCES public.tags(id)
        ON DELETE CASCADE,

    UNIQUE(question_id, tag_id),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.user_question_progress (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    question_id BIGINT NOT NULL
        REFERENCES public.questions(id)
        ON DELETE CASCADE,

    completed BOOLEAN DEFAULT FALSE,

    score NUMERIC(5,2),

    solved_at TIMESTAMPTZ,

    UNIQUE(user_id, question_id),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.user_subject_progress (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    subject_id BIGINT NOT NULL
        REFERENCES public.subjects(id)
        ON DELETE CASCADE,

    completed_questions INTEGER DEFAULT 0,

    total_questions INTEGER DEFAULT 0,

    completion_percentage NUMERIC(5,2) DEFAULT 0,

    streak INTEGER DEFAULT 0,

    UNIQUE(user_id, subject_id),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DOMAIN PREPARATION MODULE
-- =====================================================

-- ==========================================
-- UPDATED FOR DOMAIN MODULE
-- ==========================================

CREATE TABLE public.domains (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    domain_name VARCHAR(100) NOT NULL UNIQUE,

    icon TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.domain_topics (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    domain_id BIGINT NOT NULL
        REFERENCES public.domains(id)
        ON DELETE CASCADE,

    topic_name VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.domain_questions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    topic_id BIGINT NOT NULL
        REFERENCES public.domain_topics(id)
        ON DELETE CASCADE,

    question TEXT NOT NULL,

    answer TEXT,

    difficulty VARCHAR(20)
        CHECK (difficulty IN ('Easy','Medium','Hard')),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.user_domain_question_progress (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    question_id BIGINT NOT NULL
        REFERENCES public.domain_questions(id)
        ON DELETE CASCADE,

    completed BOOLEAN DEFAULT FALSE,

    score NUMERIC(5,2),

    solved_at TIMESTAMPTZ,

    UNIQUE(user_id, question_id),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.user_domain_progress (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    domain_id BIGINT NOT NULL
        REFERENCES public.domains(id)
        ON DELETE CASCADE,

    completed_questions INTEGER DEFAULT 0,

    total_questions INTEGER DEFAULT 0,

    completion_percentage NUMERIC(5,2) DEFAULT 0,

    streak INTEGER DEFAULT 0,

    UNIQUE(user_id, domain_id),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MOCK INTERVIEW MODULE - PART 1
-- =====================================================

-- ==========================================
-- UPDATED FOR INTERVIEW SESSIONS MODULE
-- ==========================================

CREATE TABLE public.interview_sessions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    interview_type VARCHAR(30)
        CHECK (interview_type IN ('HR','Technical','Behavioral')),

    target_role VARCHAR(100),

    difficulty VARCHAR(20)
        CHECK (difficulty IN ('Easy','Medium','Hard')),

    status VARCHAR(20)
        CHECK (
            status IN
            ('in_progress','completed','abandoned')
        )
        DEFAULT 'in_progress',

    started_at TIMESTAMPTZ DEFAULT NOW(),

    ended_at TIMESTAMPTZ,

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.interview_questions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    session_id BIGINT NOT NULL
        REFERENCES public.interview_sessions(id)
        ON DELETE CASCADE,

    question_text TEXT NOT NULL,

    sequence_no INTEGER NOT NULL,

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.interview_answers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    question_id BIGINT NOT NULL
        REFERENCES public.interview_questions(id)
        ON DELETE CASCADE,

    answer_type VARCHAR(20)
        CHECK (answer_type IN ('text','audio','video','code')),

    answer_text TEXT,

    audio_url TEXT,

    video_url TEXT,

    ai_score NUMERIC(5,2),

    ai_feedback TEXT,

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MOCK INTERVIEW MODULE - PART 2
-- =====================================================

CREATE TABLE public.coding_submissions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    answer_id BIGINT NOT NULL UNIQUE
        REFERENCES public.interview_answers(id)
        ON DELETE CASCADE,

    language VARCHAR(50) NOT NULL,

    source_code TEXT NOT NULL,

    execution_result TEXT,

    compiler_output TEXT,

    passed_testcases INTEGER DEFAULT 0,

    total_testcases INTEGER DEFAULT 0,

    time_taken NUMERIC(10,2),

    memory_used NUMERIC(10,2),

    submitted_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

CREATE TABLE public.interview_reports (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    session_id BIGINT NOT NULL UNIQUE
        REFERENCES public.interview_sessions(id)
        ON DELETE CASCADE,

    overall_score NUMERIC(5,2)
        CHECK (overall_score >= 0 AND overall_score <= 100),

    strengths TEXT,

    weaknesses TEXT,

    recommendations TEXT,

    pdf_url TEXT,

    generated_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- NEW TABLE
-- ==========================================

CREATE TABLE public.career_goals (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    target_role VARCHAR(100) NOT NULL,

    icon TEXT,

    color VARCHAR(30),

    target_companies TEXT[],

    current_skill_level VARCHAR(20)
        CHECK (
            current_skill_level IN
            ('Beginner','Intermediate','Advanced','Expert')
        ),

    interview_readiness_percentage NUMERIC(5,2)
        CHECK (
            interview_readiness_percentage BETWEEN 0 AND 100
        ),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

-- ==========================================
-- NEW TABLE
-- ==========================================

CREATE TABLE public.skill_gap_radar (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    career_goal_id BIGINT NOT NULL
        REFERENCES public.career_goals(id)
        ON DELETE CASCADE,

    skill_name VARCHAR(100),

    current_level NUMERIC(5,2)
        CHECK (current_level BETWEEN 0 AND 100),

    target_level NUMERIC(5,2)
        CHECK (target_level BETWEEN 0 AND 100),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DASHBOARD
-- =====================================================

CREATE TABLE public.performance_metrics (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    communication_score NUMERIC(5,2),

    technical_score NUMERIC(5,2),

    confidence_score NUMERIC(5,2),

    problem_solving_score NUMERIC(5,2),

    aptitude_score NUMERIC(5,2),

    interview_score NUMERIC(5,2),

    recorded_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROADMAP
-- =====================================================

CREATE TABLE public.roadmaps (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    roadmap_title VARCHAR(255),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------

-- ==========================================
-- UPDATED FOR ROADMAP MODULE
-- ==========================================

CREATE TABLE public.roadmap_milestones (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    roadmap_id BIGINT NOT NULL
        REFERENCES public.roadmaps(id)
        ON DELETE CASCADE,

    title VARCHAR(255),

    description TEXT,

    status VARCHAR(20)
        CHECK(status IN ('pending','in_progress','completed')),

    due_date DATE,

    completed_at TIMESTAMPTZ,

    progress_percentage NUMERIC(5,2)
        DEFAULT 0
        CHECK (progress_percentage BETWEEN 0 AND 100),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AI LOGS
-- =====================================================

CREATE TABLE public.ai_logs (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES public.users(id)
        ON DELETE CASCADE,

    feature_name VARCHAR(100),

    prompt TEXT,

    response TEXT,

    model_name VARCHAR(100),

    processing_time_ms INTEGER,

    tokens_used INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- NEW INDEXES
-- ==========================================

CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_resume_analysis_user_id ON public.resume_analysis(user_id);
CREATE INDEX idx_resume_skills_resume_id ON public.resume_skills(resume_id);
CREATE INDEX idx_resume_skills_skill_id ON public.resume_skills(skill_id);
CREATE INDEX idx_linkedin_analysis_user_id ON public.linkedin_analysis(user_id);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_project_technologies_project_id ON public.project_technologies(project_id);
CREATE INDEX idx_project_technologies_technology_id ON public.project_technologies(technology_id);
CREATE INDEX idx_project_analysis_project_id ON public.project_analysis(project_id);
CREATE INDEX idx_topics_subject_id ON public.topics(subject_id);
CREATE INDEX idx_questions_topic_id ON public.questions(topic_id);
CREATE INDEX idx_question_tags_question_id ON public.question_tags(question_id);
CREATE INDEX idx_question_tags_tag_id ON public.question_tags(tag_id);
CREATE INDEX idx_user_question_progress_user_id ON public.user_question_progress(user_id);
CREATE INDEX idx_user_question_progress_question_id ON public.user_question_progress(question_id);
CREATE INDEX idx_user_subject_progress_user_id ON public.user_subject_progress(user_id);
CREATE INDEX idx_user_subject_progress_subject_id ON public.user_subject_progress(subject_id);
CREATE INDEX idx_domain_topics_domain_id ON public.domain_topics(domain_id);
CREATE INDEX idx_domain_questions_topic_id ON public.domain_questions(topic_id);
CREATE INDEX idx_user_domain_question_progress_user_id ON public.user_domain_question_progress(user_id);
CREATE INDEX idx_user_domain_question_progress_question_id ON public.user_domain_question_progress(question_id);
CREATE INDEX idx_user_domain_progress_user_id ON public.user_domain_progress(user_id);
CREATE INDEX idx_user_domain_progress_domain_id ON public.user_domain_progress(domain_id);
CREATE INDEX idx_interview_sessions_user_id ON public.interview_sessions(user_id);
CREATE INDEX idx_interview_sessions_started_at ON public.interview_sessions(started_at);
CREATE INDEX idx_interview_questions_session_id ON public.interview_questions(session_id);
CREATE INDEX idx_interview_answers_question_id ON public.interview_answers(question_id);
CREATE INDEX idx_coding_submissions_answer_id ON public.coding_submissions(answer_id);
CREATE INDEX idx_interview_reports_session_id ON public.interview_reports(session_id);
CREATE INDEX idx_performance_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX idx_roadmaps_user_id ON public.roadmaps(user_id);
CREATE INDEX idx_roadmap_milestones_roadmap_id ON public.roadmap_milestones(roadmap_id);
CREATE INDEX idx_career_goals_user_id ON public.career_goals(user_id);
CREATE INDEX idx_skill_gap_radar_career_goal_id ON public.skill_gap_radar(career_goal_id);
CREATE INDEX idx_ai_logs_user_id ON public.ai_logs(user_id);

-- ==========================================
-- NEW UNIQUE INDEX FOR ACTIVE CAREER GOAL
-- ==========================================

CREATE UNIQUE INDEX idx_one_active_goal_per_user
ON public.career_goals(user_id)
WHERE is_active = TRUE;

-- ==========================================
-- NEW RLS POLICIES
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_self_access
ON public.users
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_settings_self_access
ON public.user_settings
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_self_access
ON public.notifications
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY resume_analysis_self_access
ON public.resume_analysis
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY skills_read_access
ON public.skills
FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.resume_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY resume_skills_self_access
ON public.resume_skills
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.resume_analysis ra
        WHERE ra.id = resume_skills.resume_id
          AND ra.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.resume_analysis ra
        WHERE ra.id = resume_skills.resume_id
          AND ra.user_id = auth.uid()
    )
);

ALTER TABLE public.linkedin_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY linkedin_analysis_self_access
ON public.linkedin_analysis
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY projects_self_access
ON public.projects
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
CREATE POLICY technologies_read_access
ON public.technologies
FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
CREATE POLICY project_technologies_self_access
ON public.project_technologies
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_technologies.project_id
          AND p.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_technologies.project_id
          AND p.user_id = auth.uid()
    )
);

ALTER TABLE public.project_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY project_analysis_self_access
ON public.project_analysis
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_analysis.project_id
          AND p.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.projects p
        WHERE p.id = project_analysis.project_id
          AND p.user_id = auth.uid()
    )
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY subjects_read_access
ON public.subjects
FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY topics_read_access
ON public.topics
FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY questions_read_access
ON public.questions
FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY tags_read_access
ON public.tags
FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.question_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY question_tags_read_access
ON public.question_tags
FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.user_question_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_question_progress_self_access
ON public.user_question_progress
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_subject_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_subject_progress_self_access
ON public.user_subject_progress
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY domains_read_access
ON public.domains
FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.domain_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY domain_topics_read_access
ON public.domain_topics
FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.domain_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY domain_questions_read_access
ON public.domain_questions
FOR SELECT
TO authenticated
USING (true);

ALTER TABLE public.user_domain_question_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_domain_question_progress_self_access
ON public.user_domain_question_progress
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_domain_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_domain_progress_self_access
ON public.user_domain_progress
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY interview_sessions_self_access
ON public.interview_sessions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY interview_questions_self_access
ON public.interview_questions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.interview_sessions isess
        WHERE isess.id = interview_questions.session_id
          AND isess.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.interview_sessions isess
        WHERE isess.id = interview_questions.session_id
          AND isess.user_id = auth.uid()
    )
);

ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY interview_answers_self_access
ON public.interview_answers
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.interview_questions iq
        JOIN public.interview_sessions isess ON isess.id = iq.session_id
        WHERE iq.id = interview_answers.question_id
          AND isess.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.interview_questions iq
        JOIN public.interview_sessions isess ON isess.id = iq.session_id
        WHERE iq.id = interview_answers.question_id
          AND isess.user_id = auth.uid()
    )
);

ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY coding_submissions_self_access
ON public.coding_submissions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.interview_answers ia
        JOIN public.interview_questions iq ON iq.id = ia.question_id
        JOIN public.interview_sessions isess ON isess.id = iq.session_id
        WHERE ia.id = coding_submissions.answer_id
          AND isess.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.interview_answers ia
        JOIN public.interview_questions iq ON iq.id = ia.question_id
        JOIN public.interview_sessions isess ON isess.id = iq.session_id
        WHERE ia.id = coding_submissions.answer_id
          AND isess.user_id = auth.uid()
    )
);

ALTER TABLE public.interview_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY interview_reports_self_access
ON public.interview_reports
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.interview_sessions isess
        WHERE isess.id = interview_reports.session_id
          AND isess.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.interview_sessions isess
        WHERE isess.id = interview_reports.session_id
          AND isess.user_id = auth.uid()
    )
);

ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY performance_metrics_self_access
ON public.performance_metrics
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY roadmaps_self_access
ON public.roadmaps
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY roadmap_milestones_self_access
ON public.roadmap_milestones
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.roadmaps r
        WHERE r.id = roadmap_milestones.roadmap_id
          AND r.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.roadmaps r
        WHERE r.id = roadmap_milestones.roadmap_id
          AND r.user_id = auth.uid()
    )
);

ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY career_goals_self_access
ON public.career_goals
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.skill_gap_radar ENABLE ROW LEVEL SECURITY;
CREATE POLICY skill_gap_radar_self_access
ON public.skill_gap_radar
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.career_goals cg
        WHERE cg.id = skill_gap_radar.career_goal_id
          AND cg.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.career_goals cg
        WHERE cg.id = skill_gap_radar.career_goal_id
          AND cg.user_id = auth.uid()
    )
);

ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_logs_self_access
ON public.ai_logs
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);