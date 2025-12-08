# Google Classroom Integration

FlickDo integrates with Google Classroom to automatically sync your assignments as tasks.

## Setup

### Connect Your Account

1. Go to **Settings** → **Integrations**
2. Click **"Connect Google Classroom"**
3. Sign in with your Google account
4. Grant permissions:
   - View your courses
   - View course work and assignments
   - View your profile

### Permissions Required

FlickDo needs read-only access to:

- List your courses
- View assignments and due dates
- Access course metadata (names, teachers)

!!! note "Privacy"
FlickDo NEVER modifies your Classroom data. It's read-only access.

## How It Works

### Automatic Sync

Once connected:

- Syncs every 15 minutes
- New assignments appear as tasks
- Updates reflect within minutes
- Completed assignments can be marked in FlickDo

### Synced Information

Each Classroom assignment becomes a task with:

- **Title** - Assignment name
- **Description** - Assignment details and instructions
- **Due Date** - When it's due
- **Course Badge** - Which class it's for
- **Link** - Direct link to the assignment in Classroom

### Visual Identification

Classroom tasks have:

- 🎓 Special badge
- Course name displayed
- Different card style
- Locked editing (edit in Classroom instead)

## Managing Classroom Tasks

### View Assignments

Classroom tasks appear:

- In your main task list
- On the calendar
- In "Today" and "Upcoming" views
- Mixed with regular tasks

### Complete Assignments

1. Click the checkbox in FlickDo
2. Task is marked complete
3. Stays in FlickDo for records
4. Does NOT mark complete in Classroom

!!! warning "Two-Way Sync Not Supported"
Completing in FlickDo doesn't update Classroom. Submit your work in Classroom!

### Cannot Edit

You cannot edit Classroom tasks in FlickDo:

- Title, description, due date are synced
- To change them, edit in Google Classroom
- Changes sync automatically to FlickDo

### Add Tags

You CAN add tags to Classroom tasks:

- Organize by subject, priority, etc.
- Tags are FlickDo-only, don't affect Classroom
- Useful for filtering

## Filtering Classroom Tasks

### View Only Classroom Tasks

1. Use the filter in task view
2. Select "Classroom Only"
3. See all synced assignments

### By Course

Filter by specific courses:

1. Use the course filter dropdown
2. Select one or more courses
3. See only those assignments

### Combined Filters

Combine with other filters:

- Classroom tasks due today
- High-priority Classroom tasks
- Classroom tasks tagged "study"

## Sync Status

### Check Sync Status

Settings → Integrations → Google Classroom shows:

- Last sync time
- Number of courses
- Number of assignments synced
- Sync errors (if any)

### Manual Sync

Force a sync:

1. Settings → Integrations
2. Click "Sync Now"
3. Wait for completion

Usually not needed as auto-sync runs every 15 minutes.

### Sync Issues

If assignments aren't appearing:

1. Check that you granted all permissions
2. Verify courses have assignments
3. Try manual sync
4. Disconnect and reconnect

## Disconnecting

### Remove Integration

1. Settings → Integrations
2. Click "Disconnect Google Classroom"
3. Confirm disconnection

**What happens:**

- Existing Classroom tasks remain in FlickDo
- No new assignments sync
- Can reconnect anytime

### Revoke Permissions

To fully revoke access:

1. Go to [Google Account Permissions](https://myaccount.google.com/permissions)
2. Find FlickDo
3. Click "Remove Access"

## Privacy & Security

### Data Storage

- Only assignment metadata is stored
- No student data or grades
- Stored in your FlickDo database
- Not shared with third parties

### Permissions

FlickDo requests minimal permissions:

- Read-only access
- No write access to Classroom
- No access to other Google services

### Revoking Access

You can disconnect anytime without affecting your Classroom account.

## Troubleshooting

### Assignments Not Syncing

**Check permissions:**

1. Google Account → Security → Third-party apps
2. Verify FlickDo has access
3. Re-grant if needed

**Check course status:**

- Only active courses sync
- Archived courses are ignored
- Private courses may not sync

**Try manual sync:**
Settings → Integrations → Sync Now

### Duplicate Assignments

If you see duplicates:

1. Settings → Integrations → Disconnect
2. Wait 1 minute
3. Reconnect
4. Duplicates should resolve

### Assignment Details Wrong

- Edit in Google Classroom
- Wait up to 15 minutes for sync
- Or force manual sync

### "Permission Denied" Error

1. Disconnect integration
2. Revoke permissions in Google Account
3. Reconnect and re-grant permissions

## Best Practices

!!! tip "Tag by Subject"
Add subject tags to Classroom tasks for better filtering: `math`, `history`, `science`

!!! tip "Set Reminders"
While due dates sync, add your own reminder dates for important assignments.

!!! tip "Use Calendar View"
Visualize all assignments on the calendar to plan study time.

!!! tip "Combine with Regular Tasks"
Create related tasks for studying, reviewing, etc. Link with tags.

## Limitations

**Current limitations:**

- Read-only (can't modify Classroom from FlickDo)
- Completing in FlickDo doesn't update Classroom
- No access to grades or submissions
- No support for Classroom announcements

**Planned features:**

- Two-way sync for completion status
- Submission status indicator
- Grade integration
- Announcement sync

## Use Cases

### For Students

**Track All Coursework:**

- See all assignments in one place
- Plan study time on calendar
- Prioritize by due date and difficulty

**Study Planning:**

1. Sync Classroom assignments
2. Create related tasks: "Study for test", "Review notes"
3. Tag by subject
4. Schedule on calendar

### For Teachers

**Monitor Multiple Classes:**

- See all assignments you've created
- Track upcoming deadlines
- Plan assignment distribution

---

Next: Learn about [Collaboration](collaboration.md) features →
