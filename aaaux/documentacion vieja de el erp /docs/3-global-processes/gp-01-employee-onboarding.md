# Process E2E 01: Onboarding de Nuevo Empleado

## 1. Descripción del Proceso Global

Este proceso de negocio describe el ciclo de vida completo desde que un candidato es contratado por Recursos Humanos hasta que tiene acceso efectivo al sistema ERP y establece su propia contraseña.

## 2. Participantes (Módulos / Bounded Contexts)

* **Módulo HR (Recursos Humanos):** Dueño del alta legal y contractual.
* **Módulo IAM (Identity & Access):** Dueño de las credenciales y el acceso.
* **Módulo Notifications:** Dueño de la entrega del correo electrónico.

## 3. Flujo Coreografiado (Event-Driven)

### Paso 1: Alta Administrativa (Origen de la Verdad)

* **Actor:** Gestor de Recursos Humanos.
* **Módulo Implicado:** HR.
* **Caso de Uso Extraído:** `UC-HR-01: Contratar Empleado`.
* **Acción:** El Gestor registra los datos personales y el contrato en el módulo HR.
* **Resultado:** Se guarda el empleado y se publica el evento de integración `EmployeeHiredIntegrationEvent`.

### Paso 2: Aprovisionamiento de Identidad (Programado)

* **Actor:** Sistema (Automático).
* **Módulo Implicado:** IAM.
* **Caso de Uso Extraído:** `UC-IAM-00: Aprovisionar Cuenta Automáticamente`.
* **Acción:** IAM escucha el `EmployeeHiredIntegrationEvent`. Si el contrato del empleado empieza en el futuro, IAM crea el `User` en estado `Scheduled_For_Activation` y entra en espera.
* **Resultado:** El sistema queda programado de forma segura. El día exacto en que inicia el contrato del empleado, IAM automáticamente cambia el estado a `Pending_Activation` y dispara el evento para enviar el correo.

### Paso 2: Aprovisionamiento de Identidad (Programado y Diferido)

* **Actor:** Sistema (Automático).
* **Módulo Implicado:** IAM.
* **Casos de Uso Extraídos:
  * * `UC-IAM-00: Aprovisionar Cuenta Automáticamente` (Reacción inmediata al evento de RRHH).
  * * `UC-IAM-07: Procesar Activaciones Programadas` (Tarea programada / Cron Job que libera el acceso).
* **Acción:** IAM escucha el `EmployeeHiredIntegrationEvent`. Si el contrato del empleado empieza en el futuro, IAM crea el `User` mediante el `UC-IAM-00` dejándolo en estado `Scheduled_For_Activation` y entra en espera.
* **Resultado:** El sistema queda programado de forma segura. El día exacto en que inicia el contrato, el `UC-IAM-07` automáticamente cambia el estado a `Pending_Activation` y dispara el evento para enviar el correo de bienvenida.

### Paso 3: Notificación al Usuario

* **Actor:** Sistema (Automático).
* **Módulo Implicado:** Notifications.
* **Caso de Uso Extraído:** `UC-NOT-01: Enviar Email Transaccional`.
* **Acción:** Notifications escucha el `UserActivationRequiredIntegrationEvent`. Construye el email usando la plantilla de "Bienvenida" e inyecta la URL de activación (ej. `https://erp.empresa.com/activate?token=...`).
* **Resultado:** El email se envía al correo personal o corporativo del empleado.

### Paso 4: Activación por parte del Empleado

* **Actor:** Nuevo Empleado.
* **Módulo Implicado:** IAM.
* **Caso de Uso Extraído:** `UC-IAM-02: Activar Cuenta`.
* **Acción:** El empleado hace clic en el enlace, ingresa su nueva contraseña y el token se valida.
* **Resultado:** El estado del usuario en IAM pasa a `Active`. El proceso global finaliza con éxito.

## 🛡️ 4. Manejo de Fallos Distribuidos (Patrón Saga - Coreografía)

Dado que este proceso atraviesa múltiples Bounded Contexts (HR -> IAM -> Notifications), la red o los sistemas pueden fallar. Para garantizar la consistencia eventual, implementamos el **Patrón Saga**.

### 4.1. Trazabilidad (Correlation ID)

Todo el flujo de Onboarding se rige por un `CorrelationId` (UUID) que se genera en el paso 1 (HR). Este ID debe viajar incrustado en la metadata de **todos** los eventos relacionados con este empleado. Si un desarrollador necesita depurar un fallo en Kibana/Datadog, buscará este ID y verá los logs de HR, IAM y Notificaciones unidos.

### 4.2. Estados Temporales en HR

El módulo de Recursos Humanos no marcará al empleado como `ACTIVE` inmediatamente. Usará estados de transición:

1. Al guardar el empleado: Estado `PROVISIONING` (Procesando).
2. Si recibe evento de éxito de IAM (`UserCreated`): Estado pasa a `ACTIVE`.
3. Si recibe evento de fallo de IAM (`UserCreationFailed`): Estado pasa a `REQUIRES_MANUAL_INTERVENTION`.

### 4.3. Flujos de Compensación (Rollbacks Asíncronos)

**Escenario de Fallo A: IAM no puede crear el usuario**

* **Causa:** El correo electrónico ingresado en HR ya existía previamente en la base de datos de IAM, o la contraseña temporal no cumple las políticas.
* **Reacción de IAM:** IAM aborta su proceso local y publica un evento `UserCreationFailedIntegrationEvent` (incluyendo el `CorrelationId` y el motivo del error).
* **Compensación en HR:** El módulo HR está suscrito a los fallos de IAM. Al recibir el evento, cambia el estado del empleado a `REQUIRES_MANUAL_INTERVENTION` y notifica al administrador de RRHH en el frontend: *"El empleado fue guardado, pero no se pudo crear su usuario. Motivo: Correo duplicado"*.

**Escenario de Fallo B: Notifications no puede enviar el correo**

* **Causa:** SendGrid/AWS SES está caído.
* **Reacción de Notifications:** El módulo implementa un patrón de **Retry (Reintentos con retroceso exponencial)**. Intentará enviar el correo 3 veces (ej. al minuto, a los 5 min, a los 15 min).
* **Compensación Final:** Si falla definitivamente, publica `EmailDeliveryFailedIntegrationEvent`. IAM y HR pueden escuchar esto para mostrar un botón en la interfaz gráfica que diga: *"Re-enviar correo de bienvenida"*.

### 4.4. Regla de Idempotencia

Para evitar que un fallo de red o un reintento de RabbitMQ duplique datos:

* **IAM:** Antes de procesar `EmployeeCreated`, verificará en su tabla de "Eventos Procesados" (Inbox Pattern) si ya vio ese `EventId`. Si ya lo vio, descarta el mensaje silenciosamente con un `ACK`.
