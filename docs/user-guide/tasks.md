# Tasks

Tasks are the core of FlickDo. Learn how to create, manage, and organize your tasks effectively.

## Creating Tasks

### Quick Create

The fastest way to create a task:

1. Press `Ctrl+K` to open the command palette
2. Type your task title
3. Press `Enter`

### Detailed Create

For tasks that need more information:

1. Click **"+ New Task"** in the sidebar
2. Fill in the form:
   - **Title** (required)
   - **Description** - Add context, notes, or links
   - **List** - Choose which list to add it to
   - **Due Date** - Set a deadline
   - **Priority** - Low, Medium, or High
   - **Tags** - Add one or more tags
   - **Assigned To** - Delegate to a team member (shared lists only)
3. Click **"Create Task"**

## Task Properties

### Title

Brief description of what needs to be done. Keep it action-oriented (e.g., "Review PR #123" instead of "PR").

### Description

Add more context:

- Detailed instructions
- Links to resources
- Checklist items
- Notes and thoughts

Supports markdown formatting!

### Due Date & Time

Set when the task should be completed:

- Date only
- Date + specific time
- Recurring tasks (coming soon)

### Priority

Three levels to help you focus:

- 🔴 **High** - Urgent and important
- 🟡 **Medium** - Important but not urgent
- 🟢 **Low** - Nice to have

### Tags

Flexible categorization:

- Add multiple tags per task
- Create tags on the fly
- Filter by any combination of tags

### Assigned To

For collaborative lists, assign tasks to team members. They'll receive a notification.

## Managing Tasks

### Edit a Task

**Quick edit:**

- Click on the task title to mark it complete
- Click the edit icon for full form

**Inline edit:**

- Click any field directly to edit it
- Changes save automatically

### Complete a Task

- Click the checkbox next to the task
- Press `Ctrl+Enter` when focused on a task
- Completed tasks appear in the "Completed" tab

### Delete a Task

1. Click the task menu (⋮)
2. Select "Delete"
3. Confirm the deletion

!!! warning "Permanent Deletion"
Deleted tasks cannot be recovered. Consider completing them instead if you want to keep history.

### Duplicate a Task

1. Open the task
2. Click menu (⋮)
3. Select "Duplicate"

Useful for recurring tasks or templates.

## Filtering & Sorting

### Filter Tabs

Built-in filters in the main view:

- **All** - Every task in the list
- **Today** - Due today or overdue
- **Upcoming** - Due in the next 7 days
- **Completed** - Finished tasks

### Tag Filters

Click any tag in the sidebar to show only tasks with that tag. Tags work across all lists.

### Search

Use the search bar to find tasks by:

- Title
- Description content
- Tag names

### Sort Options

Click the sort button to order by:

- **Due Date** - Soonest first
- **Priority** - Highest first
- **Created Date** - Newest or oldest
- **Alphabetical** - A to Z

### Custom Filters

Combine filters for precise views:

1. Select a list
2. Choose a filter tab
3. Click a tag
4. Use search

Example: "Show me high-priority tasks due today in the Work list tagged 'urgent'"

## Batch Actions

Work with multiple tasks at once:

1. Enable selection mode (checkbox icon)
2. Select tasks with checkboxes
3. Choose an action:
   - Complete all
   - Delete all
   - Move to another list
   - Add a tag
   - Change priority

## Task Views

### List View (Default)

Classic task list with all details visible.

### Compact View

Minimal view showing just titles and checkboxes. Great for quick scanning.

### Card View

Visual cards with all metadata. Best for tasks with descriptions and attachments.

Toggle views with the view selector in the toolbar.

## Keyboard Shortcuts

- `n` - New task
- `Space` - Toggle complete
- `e` - Edit task
- `Delete` - Delete task
- `↑/↓` - Navigate tasks
- `Enter` - Open task details
- `/` - Focus search

## Advanced Features

### Subtasks

Break down complex tasks:

1. Open a task
2. Add checklist items in the description:
   ```markdown
   - [ ] Subtask 1
   - [ ] Subtask 2
   - [x] Completed subtask
   ```

### Task Dependencies

Link related tasks:

- Mention other tasks in descriptions: `#123`
- Use tags to group related work
- Create a list for project phases

### Templates

Create task templates:

1. Create a task with all common fields
2. Save it with a special tag like "template"
3. Duplicate and modify when needed

## Integration Features

### Google Classroom Tasks

Tasks from Google Classroom:

- Sync automatically
- Show course name
- Link to assignment in Google Classroom
- Update when modified in Classroom

Cannot be edited in FlickDo - edit in Google Classroom instead.

### Calendar Integration

Tasks appear on your calendar:

- Drag to reschedule
- Color-coded by list
- Quick create from calendar

## Best Practices

!!! tip "Keep Titles Short"
Aim for 3-7 words. Use the description for details.

!!! tip "Set Realistic Due Dates"
Give yourself buffer time. You can always finish early!

!!! tip "Review Weekly"
Every week, review upcoming tasks and adjust priorities.

!!! tip "One Action Per Task"
If a task has multiple steps, break it into separate tasks or use subtasks.

!!! tip "Use Priority Wisely"
Not everything can be high priority. Reserve it for truly urgent items.

## Troubleshooting

**Tasks not saving?**

- Check your internet connection
- Refresh the page
- Check browser console for errors

**Tasks disappeared?**

- Check the "Completed" tab
- Try clearing filters
- Make sure you're in the right list

**Google Classroom sync not working?**

- Reconnect your account in Settings
- Check that you've granted necessary permissions
- Sync can take a few minutes after first connection

---

Next: Learn about [Lists](lists.md) to organize your tasks →
