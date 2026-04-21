# [UC-IAM-00] Alta de Nuevo Usuario (Invitación)

**Módulo:** Identity & Access (IAM)
**Actor Principal:** Administrador del Sistema
**Descripción:** Un usuario con privilegios administrativos registra una nueva cuenta de acceso en el sistema y le asigna los roles iniciales para que un nuevo colaborador pueda acceder al ERP.

---

### 1. Pre-condiciones
* El actor principal (Admin) debe estar autenticado.
* El token del Admin debe contener el permiso o *claim* explícito `users:create`.

### 2. Flujo Principal (Happy Path)
1. El Admin envía una petición `POST` a `/users` con el `email`, `nombres` y la lista de `roles` a asignar.
2. El sistema valida que el token del Admin tenga los permisos necesarios.
3. El sistema verifica en la base de datos que el `EmailAddress` no esté registrado previamente.
4. El sistema genera una contraseña temporal segura (o un token de activación).
5. El sistema aplica un cifrado (hash) a la contraseña temporal y la asocia al nuevo `User`.
6. El sistema crea el `User` con el estado `Pending_Activation`.
7. El sistema guarda la entidad en la base de datos.
8. El sistema responde con un `201 Created` y el ID del nuevo usuario.
9. **Trigger:** El sistema emite el evento `UserCreated`.

### 3. Flujos Alternativos / Excepciones

* **A1 - Correo ya registrado:**
  * Si en el paso 3 el email ya existe.
  * El sistema aborta la transacción y devuelve `409 Conflict` con el mensaje: *"El correo electrónico ya está asociado a una cuenta."*
  
* **A2 - Permisos insuficientes:**
  * Si en el paso 2 el Admin no tiene el rol adecuado.
  * El sistema devuelve `403 Forbidden` y registra un intento de acceso no autorizado en la auditoría de seguridad.

### 4. Post-condiciones
* **Éxito:** Se ha reservado el correo en el sistema y existe un identificador único (`User_ID`) listo para ser enlazado con el módulo de Recursos Humanos.
* **Fallo:** La base de datos no sufre ninguna modificación.

### 5. Eventos de Dominio (Domain Events)
* `UserCreated`: Contiene el `User_ID`, el `Email` y el token de activación. Este evento es vital porque **otro servicio** (ej. un microservicio de notificaciones) lo escuchará para enviarle el correo de bienvenida al nuevo empleado sin bloquear el hilo principal de esta petición.