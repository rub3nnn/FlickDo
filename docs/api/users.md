# Users API

## Get Current User
Retrieve the profile information of the currently authenticated user.

### Request
`GET /auth/me`

**Headers**
- `Authorization`: `Bearer <token>`

### Response
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": "https://..."
  }
}
```
