# Requisitos: Identity & Access (IAM)

## 📝 Requisitos Funcionales (RF)
* **RF-IAM-01:** Registro de usuarios mediante invitación administrativa.
* **RF-IAM-02:** Autenticación basada en JWT (Access Token + Refresh Token).
* **RF-IAM-03:** Gestión de Roles y Permisos (RBAC) granular.
* **RF-IAM-04:** Bloqueo automático de cuenta tras 5 intentos fallidos.
* **RF-IAM-05:** Endpoint de validación de token para otros módulos.

## 🏗️ Requisitos No Funcionales (RNF)
* **RNF-IAM-S1 (Seguridad):** Las contraseñas deben cifrarse con **Argon2id**.
* **RNF-IAM-S2 (Privacidad):** Los tokens JWT no deben contener información sensible (PII) como teléfonos o direcciones, solo IDs y roles.
* **RNF-IAM-P1 (Rendimiento):** El tiempo de respuesta para la validación de un token debe ser < 20ms.
* **RNF-IAM-A1 (Disponibilidad):** Este módulo debe ser altamente disponible; si cae, el ERP queda inhabilitado.

[back](./readme.md)