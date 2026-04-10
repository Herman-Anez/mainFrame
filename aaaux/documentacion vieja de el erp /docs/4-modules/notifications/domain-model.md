# Modelo de Dominio: Notifications

**Bounded Context:** Gestión de Comunicaciones Salientes  
**Responsabilidad Principal:** Enviar, gestionar y rastrear notificaciones de forma confiable y desacoplada.  
**Versión:** 1.0.0

## 📖 1. Lenguaje Ubicuo

| Término           | Definición                                                      | Ejemplo                     |
|-------------------|-----------------------------------------------------------------|-----------------------------|
| Notification      | Registro de un intento de envío                                 | Welcome email               |
| Template          | Plantilla reusable con variables                                | `welcome_email`             |
| Channel           | Medio de entrega                                                | EMAIL, SMS                  |
| Provider          | Servicio externo                                                | SendGrid, AWS SES           |
| DeliveryStatus    | Estado del envío                                                | PENDING, SENT, FAILED       |

## 🏗️ 2. Diseño Táctico (Tactical DDD)

### Aggregate Roots
- **`Notification`** – Entidad principal que audita cada envío.

### Value Objects
- **`Channel`** – EMAIL | SMS | PUSH
- **`Recipient`** – Dirección validada (email, teléfono, etc.)
- **`TemplateData`** – JSON con variables para renderizar

### Domain Events
- `NotificationSent`
- `NotificationFailed`

## ⚙️ 3. Reglas de Negocio (Invariantes y Resiliencia)

1. **Plantilla Requerida:** Toda `Notification` debe estar asociada a una `Template` existente.
2. **Idempotencia:** Los consumidores de eventos (ej. escuchar `UserCreatedIntegrationEvent`) deben verificar si el ID del evento ya fue procesado antes de enviar la notificación. Si ya existe, se ignora (evita correos duplicados).
3. **Reintentos y Circuit Breaker:**
   - Se realizarán máximo 3 reintentos automáticos (con *Exponential Backoff*) si el proveedor (SendGrid/SES) falla.
   - Se aplicará el patrón **Circuit Breaker** a nivel de Provider: si la tasa de fallos supera el umbral, el circuito se abre y las peticiones fallan rápido para evitar saturación de recursos.
4. **Dead Letter Queue (DLQ):** Las notificaciones que fallen de forma definitiva tras agotar los reintentos se moverán a una DLQ para análisis o reprocesamiento manual.
5. **Auditoría:** Se debe registrar siempre el estado (`DeliveryStatus`) para trazabilidad total.

## 🔗 Integración con Otros Contextos
- **Suscrive a:** `UserCreatedIntegrationEvent`, `EmployeeOnboarded`, etc.
- **Publica:** `NotificationSent`, `NotificationFailed`

[back](./readme.md)