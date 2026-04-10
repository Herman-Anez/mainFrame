# [UC-IAM-00] Alta de Nuevo Usuario (Invitación)

**Módulo:** Identity & Access (IAM)
**Actor Principal:** Administrador del Sistema
**Descripción:** Un usuario con privilegios administrativos registra una nueva cuenta de acceso en el sistema y le asigna los roles iniciales para que un nuevo colaborador pueda acceder al ERP.

---

### 1. Pre-condiciones

* El actor principal (Admin) debe estar autenticado.
* El token del Admin debe contener el permiso o *claim* explícito `users:create`.

## 2. Flujo Principal (Reacción a Evento)

1. El *Message Broker* entrega el evento `EmployeeHiredIntegrationEvent` al módulo IAM (incluye `EmployeeId` y `EffectiveStartDate`).
2. El consumidor verifica la **Idempotencia**.
3. El sistema evalúa la fecha de inicio (`EffectiveStartDate`):
   * **Si la fecha es Hoy o Pasada:** Crea la entidad `User` en estado `Pending_Activation`, genera el `ActivationToken` y publica el evento `UserActivationRequiredIntegrationEvent` (Flujo inmediato).
   * **Si la fecha es Futura:** Crea la entidad `User` en estado `Scheduled_For_Activation`. No genera el token todavía.
4. Se hace *commit* y se confirma el mensaje (ACK).

## 3. Flujo Programado (Cron Job / Worker de Activación)

* **Trigger:** Un proceso en segundo plano (ej. un Cron Job diario a las 00:01h o un mensaje retrasado en el broker) revisa los usuarios en estado `Scheduled_For_Activation`.
* **Acción:** Si la fecha actual coincide con la `EffectiveStartDate` del usuario, el sistema:
  1. Cambia su estado a `Pending_Activation`.
  2. Genera el `ActivationToken`.
  3. Publica el `UserActivationRequiredIntegrationEvent` para que *Notifications* envíe el correo de bienvenida exactamente en su primer día de trabajo.

### 4. Post-condiciones

* **Éxito:** Se ha reservado el correo en el sistema y existe un identificador único (`User_ID`) listo para ser enlazado con el módulo de Recursos Humanos.
* **Fallo:** La base de datos no sufre ninguna modificación.

### 5. Eventos de Dominio (Domain Events)

* `UserCreated`: Contiene el `User_ID`, el `Email` y el token de activación. Este evento es vital porque **otro servicio** (ej. un microservicio de notificaciones) lo escuchará para enviarle el correo de bienvenida al nuevo empleado sin bloquear el hilo principal de esta petición.
