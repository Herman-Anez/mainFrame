# Catálogo de Eventos de Integración (Integration Events)

**Versión:** 1.0.0
**Descripción:** Este documento define los contratos (payloads) de los eventos asíncronos que viajan entre los diferentes Bounded Contexts (Módulos) del ERP a través del bus de mensajes (ej. RabbitMQ, Kafka o AWS EventBridge).

---

## 1. Reglas Globales de los Eventos
* Todo evento debe tener un identificador único (`eventId`) para garantizar la idempotencia (evitar procesar el mismo mensaje dos veces).
* Todo evento debe incluir un `occurredOn` en formato ISO 8601 UTC.
* Los eventos de integración deben llevar solo la información necesaria (Data Transfer Objects) y no exponer la estructura interna de la base de datos de origen.

---

## 2. Eventos del Módulo: Identity & Access (IAM)

### `UserCreatedIntegrationEvent`
Emitido cuando un administrador da de alta a un nuevo usuario en el sistema. Este evento es utilizado para notificar a otros sistemas que una nueva identidad digital existe.

* **Productor:** `identity-and-access`
* **Topic / Routing Key:** `iam.user.created`
* **Consumidores Conocidos:** * `notifications` (Para enviar el correo de bienvenida y token de activación).

**Payload (JSON Schema / Ejemplo):**
```json
{
  "eventId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "eventType": "UserCreatedIntegrationEvent",
  "occurredOn": "2026-04-05T16:15:18Z",
  "data": {
    "userId": "usr_987654321",
    "email": "nuevo.empleado@tu-erp.com",
    "activationToken": "abc123xyz890",
    "assignedRoles": ["USER"]
  }
}
```
## UserAccountLockedIntegrationEvent

Emitido cuando una cuenta es bloqueada temporalmente por exceder los intentos fallidos de login (Protección contra fuerza bruta).

    Productor: identity-and-access

    Topic / Routing Key: iam.user.locked

    Consumidores Conocidos:

        notifications (Para alertar al usuario por correo de un posible intento de hackeo).

Payload (JSON Schema / Ejemplo):
JSON

{
  "eventId": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "eventType": "UserAccountLockedIntegrationEvent",
  "occurredOn": "2026-04-05T18:20:00Z",
  "data": {
    "userId": "usr_123456789",
    "email": "admin@tu-erp.com",
    "lockoutDurationMinutes": 15,
    "ipAddress": "192.168.1.50"
  }
}

Con esto, si el desarrollador encargado de programar el módulo de `notifications` necesita saber qué datos le van a llegar para armar el correo electrónico, no tiene que ir a leer el código fuente de IAM, solo consulta este documento.

Para mantener nuestro avance, ¿qué pieza del rompecabezas te gustaría encajar a continuación: definir las especificaciones de la API de IAM (`api-spec.md`) para el Frontend, o iniciar el diseño táctico del Modelo de Dominio (`domain-model.md`) para el módulo de Recursos Humanos?