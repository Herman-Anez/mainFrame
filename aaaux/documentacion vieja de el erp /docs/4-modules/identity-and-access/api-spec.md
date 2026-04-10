# API Specification - Identity & Access (IAM)

**Bounded Context:** Identity & Access  
**Versión:** 1.0.0  
**Formato:** OpenAPI 3.1.0  
**Base URL:** `/api/iam`

## Autenticación

Todas las rutas protegidas requieren **JWT Bearer Token**.

```yaml
security:
  - bearerAuth: []
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## Endpoints

- **[Crear Usuario (Invitación)](./endpoints/crear-usuario.md)**
- **[Login con Credenciales](./endpoints/login-con-credenciales.md)**
- **[Refresh Token](./endpoints/refresh-token.md)**
- **[Validar Token](./endpoints/validar-token.md)**
- **[Logout](./endpoints/logout.md)**

## Seguridad y Reglas

- Contraseñas almacenadas con Argon2id
- Bloqueo automático tras 5 intentos fallidos
- Refresh Token rotación y persistencia
- Rate limiting en login (5/minuto por IP)
- Todos los endpoints bajo HTTPS


[back](./readme.md)
