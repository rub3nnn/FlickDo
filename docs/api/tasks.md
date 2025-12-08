# Tasks API

## Get All User Tasks
Retrieve all tasks assigned to or created by the current user.

### Request
`GET /tasks`

**Headers**
- `Authorization`: `Bearer <token>`

---

## Get Tasks By List
Retrieve all tasks associated with a specific list.

### Request
`GET /lists/:listId/tasks`

**Parameters**
- `listId`: The ID of the list.

**Headers**
- `Authorization`: `Bearer <token>`

---

## Get Task By ID
Retrieve a specific task by its ID.

### Request
`GET /tasks/:id`

**Parameters**
- `id`: The ID of the task.

**Headers**
- `Authorization`: `Bearer <token>`

---

## Create Task
Create a new task within a list.

### Request
`POST /lists/:listId/tasks`

**Parameters**
- `listId`: The ID of the list.

**Headers**
- `Authorization`: `Bearer <token>`

**Body**
```json
{
  "title": "Investigación de mercado",
  "description": "Realizar un análisis completo del mercado objetivo",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-12-15T23:59:59Z",
  "estimatedTime": 240
}
```

---

## Update Task
Update an existing task.

### Request
`PUT /tasks/:id`

**Parameters**
- `id`: The ID of the task.

**Headers**
- `Authorization`: `Bearer <token>`

**Body**
```json
{
  "title": "Investigación de mercado - Completada",
  "status": "done",
  "priority": "medium",
  "completedAt": "2025-12-10T15:30:00Z"
}
```

---

## Delete Task
Delete a task.

### Request
`DELETE /tasks/:id`

**Parameters**
- `id`: The ID of the task.

**Headers**
- `Authorization`: `Bearer <token>`

---

## Get Subtasks
Retrieve subtasks for a specific task.

### Request
`GET /tasks/:id/subtasks`

**Parameters**
- `id`: The ID of the parent task.

**Headers**
- `Authorization`: `Bearer <token>`
