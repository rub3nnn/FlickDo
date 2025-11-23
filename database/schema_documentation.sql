-- ============================================
-- FlickDo Database Schema - Final Version
-- ============================================
-- Last Updated: November 23, 2025
-- WARNING: This schema is for documentation only and is not meant to be run.
-- Table order and constraints may not be valid for direct execution.

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE public.list_role AS ENUM ('owner', 'editor', 'viewer');

-- ============================================
-- TABLES
-- ============================================

-- Profiles Table
-- Stores user profile information synchronized with Supabase Auth
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Todo Lists Table
-- Main table for todo lists with JSON configuration
CREATE TABLE public.todo_lists (
  id bigint NOT NULL DEFAULT nextval('todo_lists_id_seq'::regclass),
  title text NOT NULL,
  owner_id uuid NOT NULL,
  is_archived boolean DEFAULT false,
  configuration jsonb DEFAULT '{"type": "standard", "show_dates": true, "enable_assignments": true, "restrict_editing_to_assignee": false}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT todo_lists_pkey PRIMARY KEY (id),
  CONSTRAINT todo_lists_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- List Members Table
-- Junction table for list sharing and permissions
CREATE TABLE public.list_members (
  list_id bigint NOT NULL,
  user_id uuid NOT NULL,
  role public.list_role DEFAULT 'viewer'::list_role,
  joined_at timestamp with time zone DEFAULT now(),
  CONSTRAINT list_members_pkey PRIMARY KEY (list_id, user_id),
  CONSTRAINT list_members_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.todo_lists(id) ON DELETE CASCADE,
  CONSTRAINT list_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- List Tags Table
-- Tags/labels that can be applied to tasks within a list
CREATE TABLE public.list_tags (
  id bigint NOT NULL DEFAULT nextval('list_tags_id_seq'::regclass),
  list_id bigint NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#3B82F6'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT list_tags_pkey PRIMARY KEY (id),
  CONSTRAINT list_tags_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.todo_lists(id) ON DELETE CASCADE
);

-- Tasks Table
-- Main table for tasks with support for subtasks (parent_id)
CREATE TABLE public.tasks (
  id bigint NOT NULL DEFAULT nextval('tasks_id_seq'::regclass),
  list_id bigint NOT NULL,
  parent_id bigint,
  title text NOT NULL,
  description text,
  is_completed boolean DEFAULT false,
  due_date timestamp with time zone,
  is_all_day boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid NOT NULL,
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.todo_lists(id) ON DELETE CASCADE,
  CONSTRAINT tasks_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.tasks(id) ON DELETE CASCADE,
  CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Task Assignees Table
-- Junction table for assigning tasks to users
CREATE TABLE public.task_assignees (
  task_id bigint NOT NULL,
  user_id uuid NOT NULL,
  assigned_at timestamp with time zone DEFAULT now(),
  CONSTRAINT task_assignees_pkey PRIMARY KEY (task_id, user_id),
  CONSTRAINT task_assignees_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE,
  CONSTRAINT task_assignees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Task Tags Table
-- Junction table for applying tags to tasks
CREATE TABLE public.task_tags (
  task_id bigint NOT NULL,
  tag_id bigint NOT NULL,
  CONSTRAINT task_tags_pkey PRIMARY KEY (task_id, tag_id),
  CONSTRAINT task_tags_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE,
  CONSTRAINT task_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.list_tags(id) ON DELETE CASCADE
);

-- Classroom Integrations Table
-- Stores Google Classroom integration data for tasks
CREATE TABLE public.classroom_integrations (
  task_id bigint NOT NULL,
  course_id text NOT NULL,
  course_work_id text NOT NULL,
  alternate_link text,
  last_synced_at timestamp with time zone DEFAULT now(),
  CONSTRAINT classroom_integrations_pkey PRIMARY KEY (task_id),
  CONSTRAINT classroom_integrations_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES
-- ============================================

-- Recommended indexes for performance optimization
CREATE INDEX idx_tasks_list_id ON public.tasks(list_id);
CREATE INDEX idx_tasks_parent_id ON public.tasks(parent_id);
CREATE INDEX idx_tasks_created_by ON public.tasks(created_by);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_is_completed ON public.tasks(is_completed);

CREATE INDEX idx_list_members_user_id ON public.list_members(user_id);
CREATE INDEX idx_list_tags_list_id ON public.list_tags(list_id);
CREATE INDEX idx_task_assignees_user_id ON public.task_assignees(user_id);
CREATE INDEX idx_task_tags_tag_id ON public.task_tags(tag_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at on tasks
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RELATIONSHIPS SUMMARY
-- ============================================

/*
profiles (1) ----< (N) todo_lists (owner_id)
profiles (1) ----< (N) list_members (user_id)
profiles (1) ----< (N) tasks (created_by)
profiles (1) ----< (N) task_assignees (user_id)

todo_lists (1) ----< (N) list_members (list_id)
todo_lists (1) ----< (N) list_tags (list_id)
todo_lists (1) ----< (N) tasks (list_id)

tasks (1) ----< (N) tasks (parent_id) -- self-referential for subtasks
tasks (1) ----< (N) task_assignees (task_id)
tasks (1) ----< (N) task_tags (task_id)
tasks (1) ---- (1) classroom_integrations (task_id)

list_tags (1) ----< (N) task_tags (tag_id)
*/

-- ============================================
-- CONFIGURATION JSONB STRUCTURE
-- ============================================

/*
todo_lists.configuration default structure:
{
  "type": "standard",                        -- Type of list (standard, project, etc.)
  "show_dates": true,                        -- Display due dates
  "enable_assignments": true,                -- Enable task assignment feature
  "restrict_editing_to_assignee": false     -- Only assignees can edit tasks
}
*/
