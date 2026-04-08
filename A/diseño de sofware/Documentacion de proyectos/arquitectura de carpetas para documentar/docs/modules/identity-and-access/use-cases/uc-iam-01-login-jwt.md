# [UC-IAM-01] Autenticación de Usuario (Login con JWT)

**Módulo:** Identity & Access (IAM)
**Actor Principal:** Usuario (no autenticado)
**Descripción:** Un usuario registrado proporciona sus credenciales de acceso para obtener un par de tokens (Access y Refresh) que le permitirán interactuar con los recursos protegidos del ERP.

---

### 1. Pre-condiciones
* El usuario debe estar previamente registrado en el sistema.
* La cuenta del `User` debe encontrarse en estado `Active` (no bloqueada, no pendiente de verificación).
* El canal de comunicación debe ser seguro (HTTPS).

### 2. Flujo Principal (Happy Path)
1. El usuario envía una petición HTTP `POST` a `/auth/login` incluyendo su `email` y su `password` en texto plano en el cuerpo (body) de la solicitud.
2. El sistema busca al `User` en la base de datos utilizando el `EmailAddress`.
3. El sistema valida que el estado del `User` sea `Active`.
4. El sistema compara la contraseña recibida contra el `PasswordHash` almacenado utilizando el algoritmo de derivación de claves correspondiente (Ej. Argon2 o Bcrypt).
5. Tras una verificación exitosa, el sistema construye las *Claims* del usuario (ID, Roles, y Permisos asociados).
6. El sistema genera un `Access Token` (JWT) firmado digitalmente que incluye las *Claims*, con un tiempo de vida corto (ej. 15 minutos).
7. El sistema genera un `Refresh Token` criptográficamente seguro y opaco (guardado en base de datos/Redis), con un tiempo de vida largo (ej. 7 días).
8. El sistema reinicia el contador de intentos fallidos de login del usuario.
9. El sistema retorna un código `200 OK` devolviendo ambos tokens y la información básica de perfil al cliente.

### 3. Flujos Alternativos / Excepciones

* **A1 - Usuario no encontrado o Contraseña incorrecta:**
  * Si el `EmailAddress` no existe o la verificación del `PasswordHash` falla.
  * El sistema incrementa el contador de intentos fallidos del usuario (si el correo existía).
  * El sistema retorna `401 Unauthorized` con un mensaje genérico: *"Las credenciales proporcionadas son inválidas"*. (Evita enumeración de usuarios).

* **A2 - Cuenta Inactiva o Suspendida:**
  * Si en el paso 3 el estado del usuario es `Suspended` o `Pending`.
  * El sistema deniega el acceso y retorna `403 Forbidden` indicando que la cuenta no está activa.

* **A3 - Límite de intentos excedido (Brute Force Protection):**
  * Si el contador de intentos fallidos llega al máximo permitido (ej. 5 intentos).
  * El sistema cambia el estado de la cuenta a `Locked`.
  * El sistema retorna `429 Too Many Requests` o `403 Forbidden` y bloquea intentos adicionales durante un periodo de enfriamiento (