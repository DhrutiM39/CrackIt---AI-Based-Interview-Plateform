-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Database: PostgreSQL (Supabase)
-- =====================================================

-- Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS users_self_access ON public.users;
CREATE POLICY users_self_access ON public.users FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User Settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_settings_self_access ON public.user_settings;
CREATE POLICY user_settings_self_access ON public.user_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS notifications_self_access ON public.notifications;
CREATE POLICY notifications_self_access ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Resume Analysis
ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS resume_analysis_self_access ON public.resume_analysis;
CREATE POLICY resume_analysis_self_access ON public.resume_analysis FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Skills (Public catalog read for authenticated users)
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS skills_read_access ON public.skills;
CREATE POLICY skills_read_access ON public.skills FOR SELECT TO authenticated USING (true);

-- Resume Skills
ALTER TABLE public.resume_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS resume_skills_self_access ON public.resume_skills;
CREATE POLICY resume_skills_self_access ON public.resume_skills FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.resume_analysis ra WHERE ra.id = resume_skills.resume_id AND ra.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.resume_analysis ra WHERE ra.id = resume_skills.resume_id AND ra.user_id = auth.uid()));

-- LinkedIn Analysis
ALTER TABLE public.linkedin_analysis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS linkedin_analysis_self_access ON public.linkedin_analysis;
CREATE POLICY linkedin_analysis_self_access ON public.linkedin_analysis FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS projects_self_access ON public.projects;
CREATE POLICY projects_self_access ON public.projects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Technologies
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS technologies_read_access ON public.technologies;
CREATE POLICY technologies_read_access ON public.technologies FOR SELECT TO authenticated USING (true);

-- Project Technologies
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS project_technologies_self_access ON public.project_technologies;
CREATE POLICY project_technologies_self_access ON public.project_technologies FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_technologies.project_id AND p.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_technologies.project_id AND p.user_id = auth.uid()));

-- Project Analysis
ALTER TABLE public.project_analysis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS project_analysis_self_access ON public.project_analysis;
CREATE POLICY project_analysis_self_access ON public.project_analysis FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_analysis.project_id AND p.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_analysis.project_id AND p.user_id = auth.uid()));

-- Subjects, Topics, Questions, Tags
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS subjects_read_access ON public.subjects;
CREATE POLICY subjects_read_access ON public.subjects FOR SELECT TO authenticated USING (true);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS topics_read_access ON public.topics;
CREATE POLICY topics_read_access ON public.topics FOR SELECT TO authenticated USING (true);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS questions_read_access ON public.questions;
CREATE POLICY questions_read_access ON public.questions FOR SELECT TO authenticated USING (true);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tags_read_access ON public.tags;
CREATE POLICY tags_read_access ON public.tags FOR SELECT TO authenticated USING (true);

ALTER TABLE public.question_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS question_tags_read_access ON public.question_tags;
CREATE POLICY question_tags_read_access ON public.question_tags FOR SELECT TO authenticated USING (true);

-- User Progress
ALTER TABLE public.user_question_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_question_progress_self_access ON public.user_question_progress;
CREATE POLICY user_question_progress_self_access ON public.user_question_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_subject_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_subject_progress_self_access ON public.user_subject_progress;
CREATE POLICY user_subject_progress_self_access ON public.user_subject_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Domains & Progress
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS domains_read_access ON public.domains;
CREATE POLICY domains_read_access ON public.domains FOR SELECT TO authenticated USING (true);

ALTER TABLE public.domain_topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS domain_topics_read_access ON public.domain_topics;
CREATE POLICY domain_topics_read_access ON public.domain_topics FOR SELECT TO authenticated USING (true);

ALTER TABLE public.domain_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS domain_questions_read_access ON public.domain_questions;
CREATE POLICY domain_questions_read_access ON public.domain_questions FOR SELECT TO authenticated USING (true);

ALTER TABLE public.user_domain_question_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_domain_question_progress_self_access ON public.user_domain_question_progress;
CREATE POLICY user_domain_question_progress_self_access ON public.user_domain_question_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_domain_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_domain_progress_self_access ON public.user_domain_progress;
CREATE POLICY user_domain_progress_self_access ON public.user_domain_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Interview Sessions, Questions, Answers, Reports
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS interview_sessions_self_access ON public.interview_sessions;
CREATE POLICY interview_sessions_self_access ON public.interview_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS interview_questions_self_access ON public.interview_questions;
CREATE POLICY interview_questions_self_access ON public.interview_questions FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.interview_sessions isess WHERE isess.id = interview_questions.session_id AND isess.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.interview_sessions isess WHERE isess.id = interview_questions.session_id AND isess.user_id = auth.uid()));

ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS interview_answers_self_access ON public.interview_answers;
CREATE POLICY interview_answers_self_access ON public.interview_answers FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.interview_questions iq JOIN public.interview_sessions isess ON isess.id = iq.session_id WHERE iq.id = interview_answers.question_id AND isess.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.interview_questions iq JOIN public.interview_sessions isess ON isess.id = iq.session_id WHERE iq.id = interview_answers.question_id AND isess.user_id = auth.uid()));

ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS coding_submissions_self_access ON public.coding_submissions;
CREATE POLICY coding_submissions_self_access ON public.coding_submissions FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.interview_answers ia JOIN public.interview_questions iq ON iq.id = ia.question_id JOIN public.interview_sessions isess ON isess.id = iq.session_id WHERE ia.id = coding_submissions.answer_id AND isess.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.interview_answers ia JOIN public.interview_questions iq ON iq.id = ia.question_id JOIN public.interview_sessions isess ON isess.id = iq.session_id WHERE ia.id = coding_submissions.answer_id AND isess.user_id = auth.uid()));

ALTER TABLE public.interview_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS interview_reports_self_access ON public.interview_reports;
CREATE POLICY interview_reports_self_access ON public.interview_reports FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.interview_sessions isess WHERE isess.id = interview_reports.session_id AND isess.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.interview_sessions isess WHERE isess.id = interview_reports.session_id AND isess.user_id = auth.uid()));

-- Performance Metrics, Roadmaps, AI Logs
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS performance_metrics_self_access ON public.performance_metrics;
CREATE POLICY performance_metrics_self_access ON public.performance_metrics FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS roadmaps_self_access ON public.roadmaps;
CREATE POLICY roadmaps_self_access ON public.roadmaps FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS roadmap_milestones_self_access ON public.roadmap_milestones;
CREATE POLICY roadmap_milestones_self_access ON public.roadmap_milestones FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.roadmaps r WHERE r.id = roadmap_milestones.roadmap_id AND r.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.roadmaps r WHERE r.id = roadmap_milestones.roadmap_id AND r.user_id = auth.uid()));

ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS career_goals_self_access ON public.career_goals;
CREATE POLICY career_goals_self_access ON public.career_goals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.skill_gap_radar ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS skill_gap_radar_self_access ON public.skill_gap_radar;
CREATE POLICY skill_gap_radar_self_access ON public.skill_gap_radar FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.career_goals cg WHERE cg.id = skill_gap_radar.career_goal_id AND cg.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.career_goals cg WHERE cg.id = skill_gap_radar.career_goal_id AND cg.user_id = auth.uid()));

ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_logs_self_access ON public.ai_logs;
CREATE POLICY ai_logs_self_access ON public.ai_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
