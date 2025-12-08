# Tags

Tags provide flexible, cross-cutting organization for your tasks. Unlike lists, a task can have multiple tags, making them perfect for categorization by type, status, context, or any other dimension.

## Overview

Tags let you:

- Categorize tasks across multiple lists
- Filter tasks by multiple criteria
- Track common themes or patterns
- Organize without rigid hierarchies

## Creating Tags

### While Creating a Task

1. Open the task creation form
2. Click in the "Tags" field
3. Type a tag name
4. Press `Enter` to create

### From the Tags Manager

1. Click "Tags" in the sidebar
2. Click "+ New Tag"
3. Enter tag name and choose a color
4. Click "Create"

## Tag Properties

### Name

Keep tag names:

- Short (1-2 words)
- Lowercase
- Consistent
- Descriptive

Examples: `urgent`, `waiting`, `quick-win`, `research`

### Color

Assign colors for visual scanning:

- 🔴 Red - Urgent or blocked
- 🟠 Orange - In progress
- 🟡 Yellow - Waiting/pending
- 🟢 Green - Approved/ready
- 🔵 Blue - Research/planning
- 🟣 Purple - Creative work

## Common Tag Strategies

### By Status

- `todo`
- `in-progress`
- `blocked`
- `review`
- `done`

### By Time

- `urgent`
- `this-week`
- `someday`
- `quick-win` (< 15 min)

### By Context

- `phone` - Calls to make
- `computer` - Need a computer
- `email` - Email tasks
- `errands` - Out of office

### By Energy Level

- `high-energy` - Complex, creative work
- `low-energy` - Routine, simple tasks
- `deep-work` - Focus required

### By Role

- `manager`
- `developer`
- `designer`
- `client-facing`

### By Project Phase

- `planning`
- `design`
- `development`
- `testing`
- `deployment`

## Using Tags

### Add Tags to Tasks

**During creation:**
Type in the tags field and press Enter

**After creation:**

1. Open the task
2. Click "Add tag"
3. Select existing or create new

**Bulk tagging:**

1. Select multiple tasks
2. Click "Add tag" in batch actions
3. Choose tag to apply to all

### Remove Tags

**From a task:**
Click the × on the tag badge

**Delete tag entirely:**

1. Go to Tags manager
2. Click tag menu (⋮)
3. Select "Delete"

!!! warning
Deleting a tag removes it from all tasks.

## Filtering by Tags

### Single Tag Filter

Click any tag in the sidebar to see all tasks with that tag across all lists.

### Multiple Tag Filters

Combine tags for precise filtering:

1. Click first tag
2. Hold `Ctrl` (Windows) or `Cmd` (Mac)
3. Click additional tags
4. See tasks matching ALL selected tags

### Tag + Other Filters

Combine with:

- List selection
- Date filters (Today, Upcoming)
- Priority filters
- Search terms

Example: High-priority tasks tagged "urgent" due today in the Work list.

## Managing Tags

### Edit a Tag

1. Go to Tags manager
2. Click tag name
3. Edit name or color
4. Save

Changes apply to all tasks with that tag.

### Merge Tags

Consolidate similar tags:

1. Select tags to merge
2. Click "Merge"
3. Choose which tag name to keep
4. Confirm

All tasks get the kept tag.

### Tag Statistics

View tag usage:

- Number of tasks per tag
- Completion rate by tag
- Most used tags
- Inactive tags (no tasks)

Access: Tags manager → Statistics

## Tag Best Practices

!!! tip "Start Simple"
Begin with 5-10 tags. Add more as you identify patterns.

!!! tip "Be Consistent"
Use the same tag for the same type of task. `urgent` vs `high-priority` - pick one!

!!! tip "Review Regularly"
Monthly, review tag usage. Delete unused tags, merge duplicates.

!!! tip "Lowercase Everything"
Prevents duplicates like `Urgent` vs `urgent` vs `URGENT`

!!! tip "Avoid Redundancy"
If a tag applies to every task in a list, consider it part of the list instead.

!!! tip "Use Sparingly"
2-3 tags per task is usually enough. Too many defeats the purpose.

## Tag Systems

### GTD (Getting Things Done)

- `@phone` - Phone calls
- `@computer` - Computer tasks
- `@errands` - Outside office
- `@waiting` - Waiting on someone
- `@someday` - Someday/maybe items

### Eisenhower Matrix

- `urgent-important`
- `important-not-urgent`
- `urgent-not-important`
- `neither`

### Agile/Scrum

- `backlog`
- `sprint`
- `in-progress`
- `review`
- `done`

### Personal Productivity

- `deep-work` - Focused, uninterrupted
- `shallow-work` - Administrative
- `quick-win` - < 15 minutes
- `energy-drain` - Difficult/unpleasant

## Advanced Features

### Tag Hierarchy (Coming Soon)

Create parent-child relationships:

- `dev` → `dev/frontend`, `dev/backend`
- `client` → `client/acme`, `client/techco`

### Auto-tagging Rules

Automatically tag tasks based on:

- Keywords in title
- List assignment
- Due date
- Creator

Example: Tasks in "Work" list with "meeting" in title auto-get `meeting` tag.

### Tag Templates

Save tag combinations for quick reuse:

- Create a "Bug Fix" template: `bug`, `urgent`, `dev`
- Apply all three tags at once

### Tag Dependencies

Set rules like:

- If tagged `review`, must also have `done`
- If tagged `urgent`, must have a due date
- If tagged `client-facing`, must be assigned

## Tag Analytics

Track productivity patterns:

**Completion Velocity**

- How fast you complete tasks by tag
- Identify bottlenecks

**Time Tracking**

- Average time per tag type
- Plan realistic schedules

**Patterns**

- Most productive tags
- Tags that correlate with delays
- Tag combinations that work well

## Keyboard Shortcuts

- `t` - Add tag to focused task
- `Ctrl+Click` - Multi-select tags
- `Ctrl+T` - Open tag manager

## Troubleshooting

**Tag not filtering correctly?**

- Ensure spelling is exact
- Check if you're using AND vs OR filtering
- Clear other filters

**Too many tags?**

- Archive tags you haven't used in 3 months
- Merge similar tags
- Be more selective when tagging

**Tags vs Lists confusion?**

- Lists = single category/project
- Tags = multiple characteristics
- Use both: task in "Work" list tagged `urgent` + `email`

---

Next: Learn about the [Calendar](calendar.md) view →
