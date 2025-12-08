# Collaboration

FlickDo enables teams to work together by sharing lists and assigning tasks.

## Sharing Lists

### Share a List

1. Open the list you want to share
2. Click settings icon (⚙️)
3. Select "Share List"
4. Enter collaborator's email address
5. Choose their permission level
6. Click "Send Invite"

The user receives an email invitation.

### Permission Levels

**Viewer** 👁️

- View all tasks in the list
- Cannot create, edit, or delete
- Cannot invite others
- Read-only access

**Editor** ✏️

- View all tasks
- Create new tasks
- Edit existing tasks
- Complete/delete tasks
- Cannot manage members or list settings
- Cannot invite others

**Admin** 👑

- Full access to everything
- Manage list settings
- Invite/remove members
- Delete the list
- Change permissions

### Accepting Invitations

When someone shares a list with you:

1. Check your email for the invitation
2. Click "Accept Invitation"
3. The list appears in your sidebar
4. You can now collaborate according to your permission level

## Managing Members

### View Members

1. Open the shared list
2. Settings → "Members"
3. See all current members and their roles

### Change Member Role

Admin only:

1. List settings → Members
2. Click on a member's current role
3. Select new role from dropdown
4. Changes apply immediately

### Remove Member

Admin only:

1. List settings → Members
2. Click "Remove" next to member name
3. Confirm removal
4. Member loses access immediately

### Transfer Ownership

Original owner can transfer ownership:

1. Promote another member to Admin
2. Settings → "Transfer Ownership"
3. Select new owner
4. Confirm transfer

!!! warning
This cannot be undone. The new owner has full control.

## Assigning Tasks

### Assign to Team Member

When creating or editing a task in a shared list:

1. Click the "Assign to" field
2. Select a member from the dropdown
3. Save the task

The assigned member receives a notification.

### Unassign Task

1. Open the task
2. Click the × next to assignee name
3. Task becomes unassigned

### View My Assignments

See all tasks assigned to you:

1. Use the "Assigned to Me" smart filter
2. Or filter by your name in any shared list

## Notifications

### What Triggers Notifications

You're notified when:

- Someone assigns a task to you
- Someone mentions you in a comment (coming soon)
- You're added to a shared list
- A task you created is completed by someone else
- List settings change (if you're admin)

### Notification Settings

Control your notifications:

1. Settings → Notifications
2. Toggle each notification type
3. Choose email vs in-app
4. Set quiet hours

## Collaboration Features

### Real-time Sync

Changes appear instantly:

- Task updates
- New tasks
- Completions
- Member changes

Powered by Supabase Realtime.

### Activity Log

See who did what:

1. Open any shared list
2. Click "Activity" tab
3. View chronological history:
   - Task created by [user]
   - Task completed by [user]
   - Member added/removed
   - Settings changed

### Presence Indicators

See who's currently viewing the list:

- Small avatars appear in the header
- Shows active collaborators
- Updates in real-time

## Team Workflows

### Project Collaboration

**Setup:**

1. Create a list for the project
2. Invite team members as Editors
3. Assign tasks to specific people
4. Use tags for task types

**Example: Software Project**

- List: "Website Redesign"
- Tags: `frontend`, `backend`, `design`, `review`
- Assign: specific features to developers
- Track: progress in Statistics

### Client Work

**Setup:**

1. Create a list per client
2. Invite internal team as Admins/Editors
3. Optionally invite client as Viewer
4. Use tags for status: `pending-approval`, `in-progress`, `done`

### Educational Groups

**Setup:**

1. Create list for group project
2. Invite classmates as Editors
3. Assign sections to different members
4. Track completion before deadline

## Best Practices

!!! tip "Clear Assignments"
Always assign tasks to specific people. Unassigned tasks in shared lists often get ignored.

!!! tip "Consistent Permissions"
Give most team members Editor access. Reserve Admin for project leads.

!!! tip "Use Tags for Status"
Create tags like `in-progress`, `review`, `blocked` to track workflow state.

!!! tip "Regular Check-ins"
Review the Activity log weekly to see progress and identify blockers.

!!! tip "Archive Completed Projects"
When a project ends, archive the list to keep your workspace clean.

## Advanced Collaboration

### Templates for Teams

Create list templates:

1. Set up a list with standard structure
2. Save as template
3. Team members duplicate for new projects
4. Consistent workflow across projects

### Integration with External Tools

Connect shared lists to:

- Slack - notifications for updates
- Discord - activity feed
- Email - digest of daily changes
- Webhooks - custom integrations

Access: Settings → Integrations

### Bulk Assignment

Assign multiple tasks at once:

1. Select tasks with checkboxes
2. Batch actions → "Assign to"
3. Choose team member
4. All selected tasks assigned

## Permissions Summary

| Action             | Viewer | Editor | Admin |
| ------------------ | ------ | ------ | ----- |
| View tasks         | ✅     | ✅     | ✅    |
| Create tasks       | ❌     | ✅     | ✅    |
| Edit tasks         | ❌     | ✅     | ✅    |
| Delete tasks       | ❌     | ✅     | ✅    |
| Assign tasks       | ❌     | ✅     | ✅    |
| Invite members     | ❌     | ❌     | ✅    |
| Remove members     | ❌     | ❌     | ✅    |
| Edit list settings | ❌     | ❌     | ✅    |
| Delete list        | ❌     | ❌     | ✅    |
| Change permissions | ❌     | ❌     | ✅    |

## Troubleshooting

### Can't Share List

- Verify you're an Admin or Owner
- Check that email is valid
- Ensure user has a FlickDo account

### Changes Not Syncing

- Check internet connection
- Refresh the page
- Verify you have edit permissions

### Member Can't See List

- Check they accepted the invitation
- Verify email was correct
- Try removing and re-inviting

### Accidental Changes

- Check Activity log to see who made changes
- Tasks can't be undeleted (yet)
- Consider changing member to Viewer

---

Next: Learn about [Statistics](statistics.md) and productivity insights →
