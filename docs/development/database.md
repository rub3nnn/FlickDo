# Database Schema

The database is built on PostgreSQL (via Supabase). Below is the structure of the main tables.

## Profiles (`profiles`)
Stores user profile information, linked to Supabase Auth `auth.users`.
- `id` (uuid, PK): References `auth.users(id)`.
- `email` (text): User's email.
- `first_name` (text): User's first name.
- `last_name` (text): User's last name.
- `avatar_url` (text): URL to the user's avatar.
- `updated_at` (timestamp): Last update timestamp.

## Todo Lists (`todo_lists`)
Container for tasks.
- `id` (bigint, PK): List ID.
- `title` (text): List title.
- `owner_id` (uuid, FK): references `profiles(id)`.
- `is_archived` (boolean): Archived status.
- `configuration` (jsonb): Settings for the list (e.g., enable assignments).
- `color` (text): Color code.
- `icon` (text): Icon identifier.
- `created_at` (timestamp).

## List Members (`list_members`)
Many-to-many relationship managing users in lists.
- `list_id` (bigint, PK, FK): References `todo_lists(id)`.
- `user_id` (uuid, PK, FK): References `profiles(id)`.
- `role` (enum): Role in the list (e.g., 'viewer', 'editor').
- `joined_at` (timestamp).

## Tasks (`tasks`)
Individual tasks within a list.
- `id` (bigint, PK): Task ID.
- `list_id` (bigint, FK): References `todo_lists(id)`.
- `parent_id` (bigint, FK): References `tasks(id)` for subtasks.
- `title` (text): Task title.
- `description` (text): Task description.
- `is_completed` (boolean): Completion status.
- `due_date` (timestamp): Due date.
- `is_all_day` (boolean): All day flag.
- `created_by` (uuid, FK): References `profiles(id)`.
- `created_at` (timestamp).
- `updated_at` (timestamp).

## Task Assignees (`task_assignees`)
Users assigned to a task.
- `task_id` (bigint, PK, FK): References `tasks(id)`.
- `user_id` (uuid, PK, FK): References `profiles(id)`.
- `assigned_at` (timestamp).

## List Tags (`list_tags`)
Tags available within a list.
- `id` (bigint, PK): Tag ID.
- `list_id` (bigint, FK): References `todo_lists(id)`.
- `name` (text): Tag name.
- `color` (text): Tag color.
- `created_at` (timestamp).

## Task Tags (`task_tags`)
Association between tasks and tags.
- `task_id` (bigint, PK, FK): References `tasks(id)`.
- `tag_id` (bigint, PK, FK): References `list_tags(id)`.

## Events (`events`)
Calendar events.
- `id` (bigint, PK): Event ID.
- `title` (text): Event title.
- `description` (text): Event description.
- `start_time` (timestamp).
- `end_time` (timestamp).
- `location` (text).
- `owner_id` (uuid, FK): References `profiles(id)`.
- `created_at` (timestamp).
- `updated_at` (timestamp).

## Event Tasks (`event_tasks`)
Link between calendar events and tasks.
- `event_id` (bigint, PK, FK): References `events(id)`.
- `task_id` (bigint, PK, FK): References `tasks(id)`.
- `added_at` (timestamp).

## Classroom Integrations (`classroom_integrations`)
Stores links to Google Classroom coursework.
- `task_id` (bigint, PK, FK): References `tasks(id)`.
- `course_id` (text): Google Classroom Course ID.
- `course_work_id` (text): Google Classroom CourseWork ID.
- `alternate_link` (text): Deep link to Classroom.
- `last_synced_at` (timestamp).
