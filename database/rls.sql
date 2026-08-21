-- Enable RLS on all user-owned tables.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own users" ON public.users
FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own users" ON public.users
FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own users" ON public.users
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own user_settings" ON public.user_settings
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_settings" ON public.user_settings
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_settings" ON public.user_settings
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON public.notifications
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own resume_analysis" ON public.resume_analysis
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resume_analysis" ON public.resume_analysis
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resume_analysis" ON public.resume_analysis
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.resume_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own resume_skills" ON public.resume_skills
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.resume_analysis ra
    WHERE ra.id = resume_skills.resume_id
      AND ra.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own resume_skills" ON public.resume_skills
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.resume_analysis ra
    WHERE ra.id = resume_skills.resume_id
      AND ra.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own resume_skills" ON public.resume_skills
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM public.resume_analysis ra
    WHERE ra.id = resume_skills.resume_id
      AND ra.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.resume_analysis ra
    WHERE ra.id = resume_skills.resume_id
      AND ra.user_id = auth.uid()
  )
);

ALTER TABLE public.linkedin_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own linkedin_analysis" ON public.linkedin_analysis
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own linkedin_analysis" ON public.linkedin_analysis
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own linkedin_analysis" ON public.linkedin_analysis
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own projects" ON public.projects
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own project_technologies" ON public.project_technologies
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.projects p
    WHERE p.id = project_technologies.project_id
      AND p.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own project_technologies" ON public.project_technologies
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.projects p
    WHERE p.id = project_technologies.project_id
      AND p.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own project_technologies" ON public.project_technologies
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM public.projects p
    WHERE p.id = project_technologies.project_id
      AND p.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.projects p
    WHERE p.id = project_technologies.project_id
      AND p.user_id = auth.uid()
  )
);

ALTER TABLE public.project_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own project_analysis" ON public.project_analysis
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.projects p
    WHERE p.id = project_analysis.project_id
      AND p.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own project_analysis" ON public.project_analysis
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.projects p
    WHERE p.id = project_analysis.project_id
      AND p.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own project_analysis" ON public.project_analysis
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM public.projects p
    WHERE p.id = project_analysis.project_id
      AND p.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.projects p
    WHERE p.id = project_analysis.project_id
      AND p.user_id = auth.uid()
  )
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read subjects" ON public.subjects
FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read topics" ON public.topics
FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read questions" ON public.questions
FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read skills" ON public.skills
FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read technologies" ON public.technologies
FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read tags" ON public.tags
FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.question_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read question_tags" ON public.question_tags
FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.user_question_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own user_question_progress" ON public.user_question_progress
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_question_progress" ON public.user_question_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_question_progress" ON public.user_question_progress
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_subject_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own user_subject_progress" ON public.user_subject_progress
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_subject_progress" ON public.user_subject_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_subject_progress" ON public.user_subject_progress
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read domains" ON public.domains
FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.domain_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read domain_topics" ON public.domain_topics
FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.domain_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read domain_questions" ON public.domain_questions
FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.user_domain_question_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own user_domain_question_progress" ON public.user_domain_question_progress
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_domain_question_progress" ON public.user_domain_question_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_domain_question_progress" ON public.user_domain_question_progress
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.user_domain_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own user_domain_progress" ON public.user_domain_progress
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_domain_progress" ON public.user_domain_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_domain_progress" ON public.user_domain_progress
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own interview_sessions" ON public.interview_sessions
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interview_sessions" ON public.interview_sessions
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interview_sessions" ON public.interview_sessions
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own interview_questions" ON public.interview_questions
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_questions.session_id
      AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own interview_questions" ON public.interview_questions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_questions.session_id
      AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own interview_questions" ON public.interview_questions
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_questions.session_id
      AND s.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_questions.session_id
      AND s.user_id = auth.uid()
  )
);

ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own interview_answers" ON public.interview_answers
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.interview_questions iq
    JOIN public.interview_sessions s ON s.id = iq.session_id
    WHERE iq.id = interview_answers.question_id
      AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own interview_answers" ON public.interview_answers
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.interview_questions iq
    JOIN public.interview_sessions s ON s.id = iq.session_id
    WHERE iq.id = interview_answers.question_id
      AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own interview_answers" ON public.interview_answers
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM public.interview_questions iq
    JOIN public.interview_sessions s ON s.id = iq.session_id
    WHERE iq.id = interview_answers.question_id
      AND s.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.interview_questions iq
    JOIN public.interview_sessions s ON s.id = iq.session_id
    WHERE iq.id = interview_answers.question_id
      AND s.user_id = auth.uid()
  )
);

ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own coding_submissions" ON public.coding_submissions
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.interview_answers ia
    JOIN public.interview_questions iq ON iq.id = ia.question_id
    JOIN public.interview_sessions s ON s.id = iq.session_id
    WHERE ia.id = coding_submissions.answer_id
      AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own coding_submissions" ON public.coding_submissions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.interview_answers ia
    JOIN public.interview_questions iq ON iq.id = ia.question_id
    JOIN public.interview_sessions s ON s.id = iq.session_id
    WHERE ia.id = coding_submissions.answer_id
      AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own coding_submissions" ON public.coding_submissions
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM public.interview_answers ia
    JOIN public.interview_questions iq ON iq.id = ia.question_id
    JOIN public.interview_sessions s ON s.id = iq.session_id
    WHERE ia.id = coding_submissions.answer_id
      AND s.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.interview_answers ia
    JOIN public.interview_questions iq ON iq.id = ia.question_id
    JOIN public.interview_sessions s ON s.id = iq.session_id
    WHERE ia.id = coding_submissions.answer_id
      AND s.user_id = auth.uid()
  )
);

ALTER TABLE public.interview_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own interview_reports" ON public.interview_reports
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_reports.session_id
      AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own interview_reports" ON public.interview_reports
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_reports.session_id
      AND s.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own interview_reports" ON public.interview_reports
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_reports.session_id
      AND s.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.interview_sessions s
    WHERE s.id = interview_reports.session_id
      AND s.user_id = auth.uid()
  )
);

ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own career_goals" ON public.career_goals
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own career_goals" ON public.career_goals
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own career_goals" ON public.career_goals
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.skill_gap_radar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own skill_gap_radar" ON public.skill_gap_radar
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.career_goals cg
    WHERE cg.id = skill_gap_radar.career_goal_id
      AND cg.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own skill_gap_radar" ON public.skill_gap_radar
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.career_goals cg
    WHERE cg.id = skill_gap_radar.career_goal_id
      AND cg.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own skill_gap_radar" ON public.skill_gap_radar
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM public.career_goals cg
    WHERE cg.id = skill_gap_radar.career_goal_id
      AND cg.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.career_goals cg
    WHERE cg.id = skill_gap_radar.career_goal_id
      AND cg.user_id = auth.uid()
  )
);

ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own performance_metrics" ON public.performance_metrics
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own performance_metrics" ON public.performance_metrics
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own performance_metrics" ON public.performance_metrics
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roadmaps" ON public.roadmaps
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roadmaps" ON public.roadmaps
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roadmaps" ON public.roadmaps
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roadmap_milestones" ON public.roadmap_milestones
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.roadmaps r
    WHERE r.id = roadmap_milestones.roadmap_id
      AND r.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own roadmap_milestones" ON public.roadmap_milestones
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.roadmaps r
    WHERE r.id = roadmap_milestones.roadmap_id
      AND r.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own roadmap_milestones" ON public.roadmap_milestones
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM public.roadmaps r
    WHERE r.id = roadmap_milestones.roadmap_id
      AND r.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.roadmaps r
    WHERE r.id = roadmap_milestones.roadmap_id
      AND r.user_id = auth.uid()
  )
);

ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ai_logs" ON public.ai_logs
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai_logs" ON public.ai_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ai_logs" ON public.ai_logs
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
