# Validar Token (usado por otros módulos)
POST /auth/validate
Headers: Authorization: Bearer <accessToken>
Response 200 OK
JSON{
  "valid": true,
  "userId": "usr_123456789",
  "roles": ["USER"],
  "permissions": ["employees:read"],
  "expiresAt": "2026-04-08T12:18:00Z"
}
Response 401 si el token es inválido o expirado.

[back](../api-spec.md)