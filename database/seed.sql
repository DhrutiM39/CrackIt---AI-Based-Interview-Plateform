-- =====================================================
-- SEED DATA
-- SUBJECTS
-- =====================================================

INSERT INTO public.subjects (subject_name, icon, difficulty, tags)
VALUES
(
'Data Structures & Algorithms',
'code',
'Hard',
ARRAY['DSA','Coding','Problem Solving']
),
(
'Database Management System',
'database',
'Medium',
ARRAY['DBMS','SQL','Database']
),
(
'Operating System',
'cpu',
'Medium',
ARRAY['OS','Process','Memory']
),
(
'Computer Networks',
'network',
'Medium',
ARRAY['Networking','TCP/IP','HTTP']
),
(
'Object Oriented Programming',
'boxes',
'Easy',
ARRAY['OOP','Java','Concepts']
),
(
'SQL',
'table',
'Easy',
ARRAY['SQL','Queries','Database']
),
(
'Aptitude',
'calculator',
'Easy',
ARRAY['Math','Reasoning','Quantitative']
),
(
'HR Interview',
'users',
'Easy',
ARRAY['HR','Behavioral','Communication']
)
ON CONFLICT (subject_name) DO NOTHING;

-- =====================================================
-- TAGS
-- =====================================================

INSERT INTO public.tags (tag_name)
VALUES
('Array'),
('String'),
('Linked List'),
('Stack'),
('Queue'),
('Tree'),
('Binary Tree'),
('Binary Search Tree'),
('Heap'),
('Hashing'),
('Graph'),
('Dynamic Programming'),
('Greedy'),
('Recursion'),
('Backtracking'),
('Sorting'),
('Searching'),
('Bit Manipulation'),
('Two Pointer'),
('Sliding Window'),
('SQL'),
('Normalization'),
('Joins'),
('Indexing'),
('Transactions'),
('Concurrency'),
('Process Management'),
('Threads'),
('Deadlock'),
('Memory Management'),
('CPU Scheduling'),
('Paging'),
('Segmentation'),
('TCP/IP'),
('UDP'),
('HTTP'),
('HTTPS'),
('DNS'),
('OSI Model'),
('Routing'),
('Switching'),
('Java'),
('Python'),
('OOP'),
('Exception Handling'),
('Collections'),
('Behavioral'),
('Communication'),
('Leadership'),
('Problem Solving'),
('Time Management'),
('Quantitative Aptitude'),
('Logical Reasoning'),
('Verbal Ability')
ON CONFLICT (tag_name) DO NOTHING;

-- =====================================================
-- DOMAINS
-- =====================================================

INSERT INTO public.domains (domain_name, icon)
VALUES
('Frontend Development', 'monitor'),
('Backend Development', 'server'),
('Full Stack Development', 'layers'),
('AI & Machine Learning', 'brain'),
('Data Science', 'bar-chart'),
('Cloud Computing', 'cloud'),
('DevOps', 'settings'),
('Cyber Security', 'shield'),
('Mobile App Development', 'smartphone'),
('Software Testing', 'check-circle'),
('Blockchain', 'link'),
('UI/UX Design', 'palette')
ON CONFLICT (domain_name) DO NOTHING;

-- =====================================================
-- TOPICS
-- =====================================================

-- Ensure the unique constraint exists so ON CONFLICT (subject_id, topic_name) can work.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        JOIN pg_namespace n ON n.oid = t.relnamespace
        WHERE c.conname = 'unique_subject_topic'
          AND n.nspname = 'public'
    ) THEN
        DELETE FROM public.topics
        WHERE id IN (
            SELECT id
            FROM (
                SELECT id,
                       ROW_NUMBER() OVER (PARTITION BY subject_id, topic_name ORDER BY id) AS rn
                FROM public.topics
            ) dups
            WHERE rn > 1
        );

        ALTER TABLE public.topics
            ADD CONSTRAINT unique_subject_topic UNIQUE (subject_id, topic_name);
    END IF;
END
$$;

INSERT INTO public.topics (subject_id, topic_name)
SELECT s.id, t.topic_name
FROM public.subjects s
JOIN (
    VALUES
    ('Data Structures & Algorithms','Arrays'),
    ('Data Structures & Algorithms','Strings'),
    ('Data Structures & Algorithms','Linked Lists'),
    ('Data Structures & Algorithms','Stacks'),
    ('Data Structures & Algorithms','Queues'),
    ('Data Structures & Algorithms','Trees'),
    ('Data Structures & Algorithms','Binary Search Trees'),
    ('Data Structures & Algorithms','Heaps'),
    ('Data Structures & Algorithms','Hashing'),
    ('Data Structures & Algorithms','Graphs'),
    ('Data Structures & Algorithms','Sorting'),
    ('Data Structures & Algorithms','Searching'),
    ('Data Structures & Algorithms','Recursion'),
    ('Data Structures & Algorithms','Backtracking'),
    ('Data Structures & Algorithms','Greedy Algorithms'),
    ('Data Structures & Algorithms','Dynamic Programming'),

    ('Database Management System','Introduction to DBMS'),
    ('Database Management System','ER Model'),
    ('Database Management System','Relational Model'),
    ('Database Management System','Normalization'),
    ('Database Management System','SQL'),
    ('Database Management System','Transactions'),
    ('Database Management System','Concurrency Control'),
    ('Database Management System','Indexing'),

    ('Operating System','Process Management'),
    ('Operating System','Threads'),
    ('Operating System','CPU Scheduling'),
    ('Operating System','Deadlocks'),
    ('Operating System','Memory Management'),
    ('Operating System','Paging'),
    ('Operating System','Segmentation'),
    ('Operating System','File Systems'),

    ('Computer Networks','OSI Model'),
    ('Computer Networks','TCP/IP'),
    ('Computer Networks','HTTP & HTTPS'),
    ('Computer Networks','DNS'),
    ('Computer Networks','Routing'),
    ('Computer Networks','Switching'),
    ('Computer Networks','Network Security'),

    ('Object Oriented Programming','Classes & Objects'),
    ('Object Oriented Programming','Inheritance'),
    ('Object Oriented Programming','Polymorphism'),
    ('Object Oriented Programming','Abstraction'),
    ('Object Oriented Programming','Encapsulation'),
    ('Object Oriented Programming','Exception Handling'),

    ('SQL','DDL'),
    ('SQL','DML'),
    ('SQL','DCL'),
    ('SQL','TCL'),
    ('SQL','Joins'),
    ('SQL','Views'),
    ('SQL','Stored Procedures'),
    ('SQL','Triggers'),

    ('Aptitude','Quantitative Aptitude'),
    ('Aptitude','Logical Reasoning'),
    ('Aptitude','Verbal Ability'),

    ('HR Interview','Self Introduction'),
    ('HR Interview','Strengths & Weaknesses'),
    ('HR Interview','HR Scenario Questions'),
    ('HR Interview','Behavioral Questions')
) AS t(subject_name, topic_name)
ON s.subject_name = t.subject_name
ON CONFLICT (subject_id, topic_name) DO NOTHING;

-- =====================================================
-- DOMAIN TOPICS
-- =====================================================

-- Ensure the unique constraint exists so ON CONFLICT (domain_id, topic_name) can work.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        JOIN pg_namespace n ON n.oid = t.relnamespace
        WHERE c.conname = 'unique_domain_topic'
          AND n.nspname = 'public'
    ) THEN
        DELETE FROM public.domain_topics
        WHERE id IN (
            SELECT id
            FROM (
                SELECT id,
                       ROW_NUMBER() OVER (PARTITION BY domain_id, topic_name ORDER BY id) AS rn
                FROM public.domain_topics
            ) dups
            WHERE rn > 1
        );

        ALTER TABLE public.domain_topics
            ADD CONSTRAINT unique_domain_topic UNIQUE (domain_id, topic_name);
    END IF;
END
$$;

INSERT INTO public.domain_topics (domain_id, topic_name)
SELECT d.id, t.topic_name
FROM public.domains d
JOIN (
    VALUES
    ('Frontend Development','HTML'),
    ('Frontend Development','CSS'),
    ('Frontend Development','JavaScript'),
    ('Frontend Development','TypeScript'),
    ('Frontend Development','React'),
    ('Frontend Development','Next.js'),
    ('Frontend Development','State Management'),
    ('Frontend Development','Responsive Design'),

    ('Backend Development','Node.js'),
    ('Backend Development','Express.js'),
    ('Backend Development','FastAPI'),
    ('Backend Development','REST API'),
    ('Backend Development','Authentication'),
    ('Backend Development','Authorization'),
    ('Backend Development','Database Integration'),

    ('Full Stack Development','Frontend Integration'),
    ('Full Stack Development','Backend Integration'),
    ('Full Stack Development','Authentication'),
    ('Full Stack Development','Deployment'),

    ('AI & Machine Learning','Python'),
    ('AI & Machine Learning','NumPy'),
    ('AI & Machine Learning','Pandas'),
    ('AI & Machine Learning','Scikit-learn'),
    ('AI & Machine Learning','TensorFlow'),
    ('AI & Machine Learning','PyTorch'),
    ('AI & Machine Learning','LLMs'),
    ('AI & Machine Learning','Prompt Engineering'),

    ('Data Science','Data Cleaning'),
    ('Data Science','Data Visualization'),
    ('Data Science','Statistics'),
    ('Data Science','Machine Learning'),

    ('Cloud Computing','AWS'),
    ('Cloud Computing','Azure'),
    ('Cloud Computing','Google Cloud'),
    ('Cloud Computing','Cloud Storage'),

    ('DevOps','Git'),
    ('DevOps','GitHub'),
    ('DevOps','Docker'),
    ('DevOps','Kubernetes'),
    ('DevOps','CI/CD'),

    ('Cyber Security','Network Security'),
    ('Cyber Security','OWASP'),
    ('Cyber Security','Authentication'),
    ('Cyber Security','Encryption'),

    ('Mobile App Development','Flutter'),
    ('Mobile App Development','React Native'),
    ('Mobile App Development','Android'),
    ('Mobile App Development','iOS'),

    ('Software Testing','Manual Testing'),
    ('Software Testing','Automation Testing'),
    ('Software Testing','Selenium'),
    ('Software Testing','API Testing'),

    ('Blockchain','Ethereum'),
    ('Blockchain','Smart Contracts'),
    ('Blockchain','Solidity'),

    ('UI/UX Design','Figma'),
    ('UI/UX Design','Wireframing'),
    ('UI/UX Design','Prototyping'),
    ('UI/UX Design','User Research')

) AS t(domain_name, topic_name)
ON d.domain_name = t.domain_name
ON CONFLICT (domain_id, topic_name) DO NOTHING;