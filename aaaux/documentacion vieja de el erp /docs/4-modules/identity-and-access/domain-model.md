# Modelo de Dominio: Identity & Access (IAM)

**Bounded Context:** Gestión de Identidad y Accesos.
**Responsabilidad:** Proteger el ecosistema del ERP, garantizando que solo los usuarios autenticados y autorizados puedan interactuar con los recursos del sistema.

---

## 📖 1. Lenguaje Ubicuo (Glosario)

Términos estrictos que todo el equipo debe usar al referirse a este módulo:

* **User (Usuario):** Un actor técnico (persona o sistema) que tiene credenciales para acceder al ERP. *Nota: No confundir con "Empleado".*
* **Role (Rol):** Una agrupación lógica de permisos (Ej. `Admin`, `HR_Manager`, `Viewer`).
* **Permission / Claim (Permiso):** El derecho específico para ejecutar una acción (Ej. `employees:write`).
* **Credentials (Credenciales):** El conjunto de datos (Email y Contraseña) que un Usuario presenta para demostrar su identidad.
* **Token:** Artefacto de seguridad (JWT) que representa una sesión activa y contiene las Claims del usuario.

---

## 🏗️ 2. Diseño Táctico (Tactical DDD)

### Agregados y Raíz de Agregado (Aggregate Root)

* **`User` (Aggregate Root):** Es la entidad principal. Toda modificación sobre sus roles o credenciales debe pasar por esta entidad para garantizar la consistencia.

### Entidades (Entities)

Tienen identidad única y su estado puede cambiar con el tiempo.

* **`Role`:** * Identificador: `Role_ID`
  * Atributos: `Name`, `Description`, `Permissions` (Lista).
* **`User` (Aggregate Root):** Representa una identidad con acceso al sistema.
  * **Atributos Clave:**
    * `AccountId` (UUID): Identificador único interno en IAM.
    * `EmployeeId` (String/UUID): **[Identity Mapping]** Identificador externo proveniente del módulo Human Resources (Legajo o ID de empleado). Es inmutable y obligatorio para usuarios internos.
    * `EmailAddress` (Value Object): Correo corporativo.
    * `Status (Enum)`: * `Scheduled_For_Activation`: El usuario ha sido aprovisionado, pero su contrato aún no inicia.
  * **Status (Enum):** * `Scheduled_For_Activation`: El usuario ha sido aprovisionado, pero su contrato aún no inicia.
    * `Pending_Activation`: El contrato ya inició y se ha enviado el token, pero el usuario no ha establecido su contraseña.
    * `Active`: Usuario operando normalmente.
    * `Suspended`: Acceso revocado.

### Objetos de Valor (Value Objects)

No tienen identidad propia, son inmutables y se definen por sus atributos. Si un atributo cambia, es un objeto completamente nuevo.

* **`EmailAddress`:** Encapsula la validación del formato del correo electrónico. No es solo un `string`.
* **`PasswordHash`:** Representa la contraseña ya cifrada. Nunca debe almacenar la contraseña en texto plano.
* **`TokenValue`:** Encapsula la lógica de los tokens JWT y su fecha de expiración.
* **`ActivationToken`:** Encapsula el token generado para nuevos usuarios, incluyendo el valor criptográfico y su fecha de expiración (`ExpiresAt`).

---

## ⚙️ 3. Reglas de Negocio (Invariantes del Dominio)

Las reglas que el Agregado `User` debe proteger en todo momento:

1. Un `User` no puede existir sin un `EmailAddress` válido y único.
2. Un `User` recién creado debe estar en estado "Pendiente de Activación" hasta que verifique su correo.
3. Un `User` debe tener al menos un `Role` asignado para poder generar un `Token` válido.
4. Las contraseñas (`PasswordHash`) deben cumplir con políticas de complejidad antes de ser aceptadas.

[back](./readme.md)
