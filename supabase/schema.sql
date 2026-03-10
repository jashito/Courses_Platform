-- SQL to create the schema, enable RLS, add policies and a trigger for profiles on auth.users insert.

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Create tables
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE,
    role VARCHAR(50) DEFAULT 'student'
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    published BOOLEAN DEFAULT FALSE
);

CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    module_id INT REFERENCES modules ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lessons ON DELETE CASCADE,
    resource_link TEXT NOT NULL
);

CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lessons ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quizzes ON DELETE CASCADE,
    question_text TEXT NOT NULL
);

CREATE TABLE quiz_answers (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES quiz_questions ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN
);

CREATE TABLE quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    quiz_id INT REFERENCES quizzes ON DELETE CASCADE,
    score INT
);

CREATE TABLE progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    course_id INT REFERENCES courses ON DELETE CASCADE,
    completion_status BOOLEAN
);

-- Row Level Security Policies
-- Profiles
CREATE POLICY select_own_profile ON profiles
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY update_own_profile ON profiles
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY select_all_profiles ON profiles
    FOR SELECT TO admin; -- assuming 'admin' role exists

-- Courses, Modules, Lessons, Resources, Quizzes, Quiz Questions, Quiz Answers
CREATE POLICY select_published ON courses, modules, lessons, resources, quizzes, quiz_questions, quiz_answers
    FOR SELECT USING (published = true);
CREATE POLICY manage_courses ON courses, modules, lessons, resources, quizzes, quiz_questions, quiz_answers
    FOR INSERT, UPDATE, DELETE TO admin;

-- Progress and Quiz Attempts
CREATE POLICY select_own_progress ON progress
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY insert_own_progress ON progress
    FOR INSERT USING (user_id = auth.uid());
CREATE POLICY update_own_progress ON progress
    FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY select_all_progress ON progress
    FOR SELECT TO admin;

CREATE POLICY select_own_quiz_attempt ON quiz_attempts
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY insert_own_quiz_attempt ON quiz_attempts
    FOR INSERT USING (user_id = auth.uid());
CREATE POLICY select_all_quiz_attempt ON quiz_attempts
    FOR SELECT TO admin;

-- Helper function
CREATE FUNCTION public.is_admin(uid UUID) RETURNS BOOLEAN AS $$
    BEGIN
        RETURN EXISTS(SELECT 1 FROM auth.users WHERE id = uid AND role = 'admin');
    END;
$$ LANGUAGE plpgsql;

-- Trigger function for new users
CREATE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on auth.users
CREATE TRIGGER insert_profile_on_user_creation
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();