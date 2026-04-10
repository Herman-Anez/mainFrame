# Crear Usuario (Invitación Administrativa)
POST /users
Descripción: Registra un nuevo usuario y envía evento de integración.
Request Body
JSON{
  "email": "nuevo.empleado@tu-erp.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "roles": ["USER", "HR_VIEWER"]
}
Response 201 Created
JSON{
  "userId": "usr_987654321",
  "email": "nuevo.empleado@tu-erp.com",
  "status": "PendingActivation",
  "createdAt": "2026-04-08T12:03:00Z"
}
Eventos emitidos: UserCreatedIntegrationEvent


## 1. Aprovisionamiento de Usuarios (Interno / Event-Driven)
* **Nota Arquitectónica:** No existe un endpoint REST público para crear usuarios. La creación es gestionada internamente por un *Event Handler* que escucha el evento `EmployeeHiredIntegrationEvent` emitido por el módulo HR en el Message Broker.

## 2. Activación de Cuenta (Sustituye a la contraseña temporal)
* **Endpoint:** `POST /auth/activate`
* **Descripción:** Permite a un nuevo empleado establecer su contraseña inicial utilizando el Token de Activación enviado a su correo.
* **Request Body:**

```json
  {
    "activationToken": "eyJhbGciOiJIUzI1NiIsInR5...",
    "newPassword": "MiPasswordSeguro2026!"
  }
```

Respuestas:

200 OK: Contraseña establecida, estado del usuario cambia a Active.

400 Bad Request: Token inválido o expirado / La contraseña no cumple las políticas.

  
[back](../api-spec.md)