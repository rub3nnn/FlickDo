# Tags API

## Get All Tags
Retrieve all tags associated with a specific list.

### Request
`GET /lists/:listId/tags`

**Parameters**
- `listId`: The ID of the list.

**Headers**
- `Authorization`: `Bearer <token>`

---

## Get Tag By ID
Retrieve a specific tag by its ID.

### Request
`GET /lists/:listId/tags/:tagId`

**Parameters**
- `listId`: The ID of the list.
- `tagId`: The ID of the tag.

**Headers**
- `Authorization`: `Bearer <token>`

---

## Create Tag
Create a new tag for a list.

### Request
`POST /lists/:listId/tags`

**Parameters**
- `listId`: The ID of the list.

**Headers**
- `Authorization`: `Bearer <token>`

**Body**
```json
{
  "name": "Urgente",
  "color": "#ef4444"
}
```
