-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.classroom_integrations (
  task_id bigint NOT NULL,
  course_id text NOT NULL,
  course_work_id text NOT NULL,
  alternate_link text,
  last_synced_at timestamp with time zone DEFAULT now(),
  CONSTRAINT classroom_integrations_pkey PRIMARY KEY (task_id),
  CONSTRAINT classroom_integrations_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.event_tasks (
  event_id bigint NOT NULL,
  task_id bigint NOT NULL,
  added_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_tasks_pkey PRIMARY KEY (event_id, task_id),
  CONSTRAINT event_tasks_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT event_tasks_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.events (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  description text,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  location text,
  owner_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.list_members (
  list_id bigint NOT NULL,
  user_id uuid NOT NULL,
  role USER-DEFINED DEFAULT 'viewer'::list_role,
  joined_at timestamp with time zone DEFAULT now(),
  CONSTRAINT list_members_pkey PRIMARY KEY (list_id, user_id),
  CONSTRAINT list_members_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.todo_lists(id),
  CONSTRAINT list_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.list_tags (
  id bigint NOT NULL DEFAULT nextval('list_tags_id_seq'::regclass),
  list_id bigint NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#3B82F6'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT list_tags_pkey PRIMARY KEY (id),
  CONSTRAINT list_tags_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.todo_lists(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.task_assignees (
  task_id bigint NOT NULL,
  user_id uuid NOT NULL,
  assigned_at timestamp with time zone DEFAULT now(),
  CONSTRAINT task_assignees_pkey PRIMARY KEY (task_id, user_id),
  CONSTRAINT task_assignees_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT task_assignees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.task_tags (
  task_id bigint NOT NULL,
  tag_id bigint NOT NULL,
  CONSTRAINT task_tags_pkey PRIMARY KEY (task_id, tag_id),
  CONSTRAINT task_tags_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
  CONSTRAINT task_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.list_tags(id)
);
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
  CONSTRAINT tasks_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.todo_lists(id),
  CONSTRAINT tasks_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.tasks(id),
  CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.todo_lists (
  id bigint NOT NULL DEFAULT nextval('todo_lists_id_seq'::regclass),
  title text NOT NULL,
  owner_id uuid NOT NULL,
  is_archived boolean DEFAULT false,
  configuration jsonb DEFAULT '{"type": "standard", "show_dates": true, "enable_assignments": true, "restrict_editing_to_assignee": false}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  color text DEFAULT '#4f46e5'::text,
  icon text,
  CONSTRAINT todo_lists_pkey PRIMARY KEY (id),
  CONSTRAINT todo_lists_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id)
);