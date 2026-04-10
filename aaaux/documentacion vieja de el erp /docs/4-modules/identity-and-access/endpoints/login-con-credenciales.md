# Login con Credenciales
POST /auth/login
Request Body
JSON{
  "email": "usuario@tu-erp.com",
  "password": "Temporal123!"
}
Response 200 OK
JSON{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "a1b2c3d4...",
  "expiresIn": 900,
  "user": {
    "userId": "usr_123456789",
    "email": "usuario@tu-erp.com",
    "roles": ["USER", "HR_MANAGER"]
  }
}
[back](../api-spec.md)