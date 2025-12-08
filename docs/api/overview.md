# API Overview

FlickDo provides a RESTful API for integrating with external tools and building custom clients.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All API requests require authentication using Supabase JWT tokens.

### Getting a Token

Tokens are automatically handled by the Supabase client:

```javascript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password",
});

// Token is in data.session.access_token
const token = data.session.access_token;
```

### Using the Token

Include the token in the Authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Example Request

```javascript
fetch("http://localhost:3000/api/tasks", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## HTTP Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 201  | Created                              |
| 400  | Bad Request - Invalid input          |
| 401  | Unauthorized - Invalid/missing token |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource doesn't exist   |
| 409  | Conflict - Duplicate resource        |
| 422  | Validation Error - Invalid data      |
| 500  | Internal Server Error                |

## Rate Limiting

- **Authenticated users**: 100 requests per minute
- **Unauthenticated**: 20 requests per minute

Rate limit headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Pagination

List endpoints support pagination:

```http
GET /api/tasks?page=1&limit=20
```

**Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Filtering

Most list endpoints support filtering:

```http
GET /api/tasks?status=pending&priority=high&tag=urgent
```

Common filters:

- `status` - Filter by status
- `priority` - Filter by priority
- `tag` - Filter by tag name
- `list` - Filter by list ID
- `assignee` - Filter by assignee ID

## Sorting

Use the `sort` parameter:

```http
GET /api/tasks?sort=-createdAt,title
```

- Prefix with `-` for descending
- No prefix for ascending
- Comma-separated for multiple fields

## Field Selection

Request only specific fields:

```http
GET /api/tasks?fields=id,title,dueDate
```

Reduces response size and improves performance.

## Expanding Relations

Include related data:

```http
GET /api/tasks?expand=list,tags,assignee
```

Returns nested objects instead of IDs.

## Bulk Operations

Some endpoints support bulk operations:

```http
POST /api/tasks/bulk
Content-Type: application/json

{
  "action": "complete",
  "ids": [1, 2, 3, 4]
}
```

## Webhooks

Subscribe to events:

1. Create a webhook in Settings → Integrations
2. Provide a URL to receive POST requests
3. Select events to subscribe to

**Event Format:**

```json
{
  "event": "task.created",
  "timestamp": "2025-12-08T10:30:00Z",
  "data": {
    // Event-specific data
  }
}
```

**Available Events:**

- `task.created`
- `task.updated`
- `task.completed`
- `task.deleted`
- `list.created`
- `list.shared`

## API Versioning

The API uses URL versioning:

```
/api/v1/tasks  (current)
/api/v2/tasks  (future)
```

Current version: **v1** (default, no version in URL required)

## SDK & Client Libraries

### JavaScript/TypeScript

```bash
npm install @flickdo/sdk
```

```javascript
import FlickDo from "@flickdo/sdk";

const client = new FlickDo({
  apiUrl: "http://localhost:3000",
  token: "YOUR_JWT_TOKEN",
});

// Use the client
const tasks = await client.tasks.list();
```

### Python

```bash
pip install flickdo
```

```python
from flickdo import FlickDoClient

client = FlickDoClient(
    api_url='http://localhost:3000',
    token='YOUR_JWT_TOKEN'
)

tasks = client.tasks.list()
```

## Postman Collection

Import our Postman collection for testing:

1. Download `FlickDo.postman_collection.json` from the repo
2. Import into Postman
3. Set environment variables:
   - `base_url`
   - `token`

## GraphQL API (Coming Soon)

A GraphQL endpoint will be available at `/api/graphql`

## API Playground

Interactive API documentation and testing:

```
http://localhost:3000/api/docs
```

Built with Swagger/OpenAPI.

## Best Practices

!!! tip "Use Field Selection"
Only request fields you need to reduce bandwidth and improve performance.

!!! tip "Implement Retry Logic"
Handle rate limits and transient errors with exponential backoff.

!!! tip "Cache Responses"
Cache data when appropriate. Use ETags for conditional requests.

!!! tip "Batch Requests"
Use bulk operations instead of multiple individual requests.

!!! tip "Validate Input"
Validate data client-side before sending to reduce errors.

## Error Handling Example

```javascript
async function getTasks() {
  try {
    const response = await fetch("/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Refresh token or redirect to login
      } else if (response.status === 429) {
        // Rate limited - wait and retry
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
}
```

## Next Steps

- [Authentication API](authentication.md)
- [Tasks API](tasks.md)
- [Lists API](lists.md)
- [Tags API](tags.md)
- [Users API](users.md)
