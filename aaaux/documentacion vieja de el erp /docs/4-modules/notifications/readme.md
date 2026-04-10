# Notifications

**Bounded Context:** Gestión de Comunicaciones Salientes  
**Responsabilidad Principal:** Enviar y rastrear notificaciones de forma confiable, desacoplada y reusable.  
**Versión:** 1.0.0

## 🎯 Objetivo

Proporcionar un servicio centralizado de notificaciones (email, SMS, push) que pueda ser utilizado por cualquier módulo del ERP.

## 📋 Entidades Principales

- **`Notification`** — Registro de cada intento de envío.
- **`Template`** — Plantilla reusable con variables.
- **`Channel`** — Canal de entrega (EMAIL, SMS, PUSH).
- **`Provider`** — Servicio externo (SendGrid, AWS SES, etc.).

## 🔄 Responsabilidades Clave

- Procesar Integration Events
- Renderizado de plantillas
- Políticas de retry y manejo de fallos
- Tracking y logging de entregas

## 🔗 Integración con Otros Contextos

- **Suscrive a:** `UserCreatedIntegrationEvent`, `EmployeeOnboarded`, etc.
- **Publica:** `NotificationSent`, `NotificationFailed`

## 📍 Enlaces Importantes

- [Domain Model](./domain-model.md)
- [Requirements](./requirements.md)
- [API Specification](./api-spec.md)
- [Use Cases](./use-cases/index.md)

[back](../../readme.md)