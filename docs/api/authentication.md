# Authentication API

## Register
Create a new user account.

### Request
`POST /auth/register`

**Body**
```json
{
  "email": "test.user@example.com",
  "password": "SecurePass123!",
  "firstName": "Ana",
  "lastName": "García"
}
```

### Response
Returns the created user object and authentication token.

---

## Login
Authenticate a user and retrieve a token.

### Request
`POST /auth/login`

**Body**
```json
{
  "email": "test.user@example.com",
  "password": "SecurePass123!"
}
```

### Response
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Logout
Invalidate the current session.

### Request
`POST /auth/logout`

**Headers**
- `Authorization`: `Bearer <token>`

---

## OAuth Login
Login using an external provider (Google, GitHub, etc.).

### Request
`POST /auth/oauth/:provider`

**Parameters**
- `provider`: The OAuth provider (e.g., `google`).

**Body**
```json
{
  "accessToken": "ya29.a0AfH6SMBx..."
}
```

---

## OAuth Callback
Handle the callback from an OAuth provider.

### Request
`POST /auth/oauth-callback`

**Body**
```json
{
  "code": "4/0AY0e-g7...",
  "provider": "google"
}
```

---

## Reset Password
Initiate the password reset process.

### Request
`POST /auth/reset-password`

**Body**
```json
{
  "email": "test.user@example.com"
}
```

---

## Update Password
Change the password for the authenticated user.

### Request
`PUT /auth/update-password`

**Headers**
- `Authorization`: `Bearer <token>`

**Body**
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

---

## Get Current User
Retrieve details of the currently authenticated user.

### Request
`GET /auth/me`

**Headers**
- `Authorization`: `Bearer <token>`

---

## Verify Email
Verify a user's email address using a token.

### Request
`POST /auth/verify-email`

**Body**
```json
{
  "token": "verification-token-here"
}
```
