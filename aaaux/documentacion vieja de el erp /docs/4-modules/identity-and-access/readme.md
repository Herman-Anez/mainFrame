# Identity & Access (IAM)

**Bounded Context:** Gestión de Identidad y Acceso  
**Responsabilidad Principal:** Proteger el ecosistema del ERP garantizando autenticación y autorización segura.  
**Versión:** 1.0.0

## 🎯 Objetivo

Controlar quién puede acceder al sistema y qué acciones puede realizar, manteniendo alta seguridad y trazabilidad.

## 📋 Entidades Principales

- **`User`** — Identidad técnica del usuario (no es lo mismo que Employee).
- **`Role`** — Agrupación lógica de permisos (RBAC).
- **`Permission`** — Permiso granular (claim).
- **`RefreshToken`** — Token persistente para renovación de sesión.

## 🔄 Responsabilidades Clave

- Registro de usuarios por invitación administrativa
- Autenticación con JWT (Access + Refresh Token)
- Gestión de Roles y Permisos (RBAC)
- Bloqueo de cuentas por fuerza bruta y auditoría de seguridad

## 🔗 Integración con Otros Contextos

- **Suscrive a:** `EmployeeOnboarded` (desde HR)
- **Publica:** `UserCreatedIntegrationEvent`, `UserAccountLockedIntegrationEvent`

## 📍 Enlaces Importantes

- [Domain Model](./domain-model.md)
- [Requirements](./requirements.md)
- [API Specification](./api-spec.md)
- [Use Cases](./use-cases/index.md)

[back](../../readme.md)