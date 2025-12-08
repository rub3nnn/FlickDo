# Lists API

## Get All Lists
Retrieve all todo lists for the authenticated user.

### Request
`GET /lists`

**Headers**
- `Authorization`: `Bearer <token>`

---

## Get List By ID
Retrieve a specific list by its ID.

### Request
`GET /lists/:id`

**Parameters**
- `id`: The ID of the list.

**Headers**
- `Authorization`: `Bearer <token>`

---

## Create List
Create a new todo list.

### Request
`POST /lists`

**Headers**
- `Authorization`: `Bearer <token>`

**Body**
```json
{
  "name": "Proyecto Final",
  "description": "Tareas del proyecto final de la universidad",
  "color": "#3b82f6",
  "icon": "📚"
}
```

---

## Update List
Update an existing list.

### Request
`PUT /lists/:id`

**Parameters**
- `id`: The ID of the list.

**Headers**
- `Authorization`: `Bearer <token>`

**Body**
```json
{
  "name": "Proyecto Final - Actualizado",
  "description": "Tareas del proyecto final (versión actualizada)",
  "color": "#10b981",
  "icon": "✅"
}
```

---

## Delete List
Delete a list permanently.

### Request
`DELETE /lists/:id`

**Parameters**
- `id`: The ID of the list.

**Headers**
- `Authorization`: `Bearer <token>`

---

## Leave List
Leave a shared list.

### Request
`DELETE /lists/:id/leave`

**Parameters**
- `id`: The ID of the list.

**Headers**
- `Authorization`: `Bearer <token>`

---

## Get List Members
Retrieve members of a specific list.

### Request
`GET /lists/:id/members`

**Parameters**
- `id`: The ID of the list.

**Headers**
- `Authorization`: `Bearer <token>`

---

## Add List Member
Add a new member to the list.

### Request
`POST /lists/:id/members`

**Parameters**
- `id`: The ID of the list.

**Headers**
- `Authorization`: `Bearer <token>`

**Body**
```json
{
  "userId": "uuid-of-user",
  "role": "editor"
}
```

---

## Update List Member
Update a member's role in the list.

### Request
`PUT /lists/:id/members/:userId`

**Parameters**
- `id`: The ID of the list.
- `userId`: The ID of the user.

**Headers**
- `Authorization`: `Bearer <token>`

**Body**
```json
{
  "role": "viewer"
}
```

---

## Remove List Member
Remove a member from the list.

### Request
`DELETE /lists/:id/members/:userId`

**Parameters**
- `id`: The ID of the list.
- `userId`: The ID of the user.

**Headers**
- `Authorization`: `Bearer <token>`
