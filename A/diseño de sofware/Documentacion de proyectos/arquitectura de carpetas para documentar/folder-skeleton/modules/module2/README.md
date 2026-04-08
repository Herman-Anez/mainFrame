# Identity & Access (IAM)

Objetivo: Controlar quién entra y qué puede tocar.
Entidades Principales (Data Schema)

* User: id, email, password_hash, is_active, mfa_secret.

* Role: id, name (ej. "HR_MANAGER"), description.

* Permission: id, code (ej. "employee:create"), description.

* UserRoles: Tabla intermedia para asignar roles a usuarios.