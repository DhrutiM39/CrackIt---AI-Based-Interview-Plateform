-- =====================================================
-- PERFORMANCE INDEXES
-- Database: PostgreSQL (Supabase)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_resume_analysis_user_id ON public.resume_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_skills_resume_id ON public.resume_skills(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_skills_skill_id ON public.resume_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_analysis_user_id ON public.linkedin_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_technologies_project_id ON public.project_technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_project_technologies_technology_id ON public.project_technologies(technology_id);
CREATE INDEX IF NOT EXISTS idx_project_analysis_project_id ON public.project_analysis(project_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON public.topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_question_tags_question_id ON public.question_tags(question_id);
CREATE INDEX IF NOT EXISTS idx_question_tags_tag_id ON public.question_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_user_question_progress_user_id ON public.user_question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_question_progress_question_id ON public.user_question_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_user_subject_progress_user_id ON public.user_subject_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subject_progress_subject_id ON public.user_subject_progress(subject_id);
CREATE INDEX IF NOT EXISTS idx_domain_topics_domain_id ON public.domain_topics(domain_id);
CREATE INDEX IF NOT EXISTS idx_domain_questions_topic_id ON public.domain_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_domain_question_progress_user_id ON public.user_domain_question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_domain_question_progress_question_id ON public.user_domain_question_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_user_domain_progress_user_id ON public.user_domain_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_domain_progress_domain_id ON public.user_domain_progress(domain_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON public.interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_started_at ON public.interview_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_interview_questions_session_id ON public.interview_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_answers_question_id ON public.interview_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_coding_submissions_answer_id ON public.coding_submissions(answer_id);
CREATE INDEX IF NOT EXISTS idx_interview_reports_session_id ON public.interview_reports(session_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON public.roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_roadmap_id ON public.roadmap_milestones(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_career_goals_user_id ON public.career_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_gap_radar_career_goal_id ON public.skill_gap_radar(career_goal_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON public.ai_logs(user_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_goal_per_user
ON public.career_goals(user_id)
WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_linkedin_analysis_profile_data_gin 
ON public.linkedin_analysis USING gin (profile_data);
