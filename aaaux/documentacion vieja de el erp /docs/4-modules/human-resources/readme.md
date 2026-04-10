# Process E2E 01: Onboarding de Nuevo Empleado

## 1. Descripción del Proceso Global
Este proceso de negocio describe el ciclo de vida completo desde que un candidato es contratado por Recursos Humanos hasta que tiene acceso efectivo al sistema ERP y establece su propia contraseña.

## 2. Participantes (Módulos / Bounded Contexts)
* **Módulo HR (Recursos Humanos):** Dueño del alta legal y contractual.
* **Módulo IAM (Identity & Access):** Dueño de las credenciales y el acceso.
* **Módulo Notifications:** Dueño de la entrega del correo electrónico de forma resiliente .

## 3. Flujo Coreografiado (Event-Driven y Asíncrono)

### Paso 1: Alta Administrativa (Origen de la Verdad)
* **Actor:** Gestor de Recursos Humanos.
* **Módulo Implicado:** HR.
* **Caso de Uso Extraído:** `UC-HR-01: Contratar Empleado`.
* **Acción:** El Gestor registra los datos personales y el contrato en el módulo HR.
* **Resultado:** Se guarda el empleado y se publica el evento de integración `EmployeeHiredIntegrationEvent`.

### Paso 2: Aprovisionamiento de Identidad (Delay Queues / Eventos Diferidos)
* **Actor:** Sistema (Automático).
* **Módulo Implicado:** IAM.
* **Caso de Uso Extraído:** `UC-IAM-00: Aprovisionar Cuenta Automáticamente`.
* **Acción:** IAM escucha el `EmployeeHiredIntegrationEvent`. Si el contrato empieza en el futuro, IAM crea el `User` en estado `Scheduled_For_Activation` y envía un mensaje a una **Delay Queue** (ej. RabbitMQ Delayed Message o AWS EventBridge) configurada para desencadenarse la fecha exacta de inicio del contrato.
* **Resultado:** Al cumplirse la fecha, IAM procesa su propio mensaje diferido, cambia el estado del usuario a `Pending_Activation` y emite el evento `UserPendingActivationEvent`.

### Paso 3: Notificación al Usuario (Reacción Reactiva)
* **Actor:** Sistema (Automático).
* **Módulo Implicado:** Notifications.
* **Caso de Uso Extraído:** `UC-NOT-01: Enviar Email Transaccional`.
* **Acción:** Notifications escucha el `UserPendingActivationEvent`. Para generar la url, hace una llamada síncrona interna a IAM solicitando un Token Efímero. Luego, construye el email usando la plantilla de "Bienvenida" e inyecta la URL de activación.
* **Resultado:** El email se envía al correo personal o corporativo del empleado. Si el proveedor SMTP falla, se implementan políticas de reintento locales.

### Paso 4: Activación por parte del Empleado
* **Actor:** Nuevo Empleado.
* **Módulo Implicado:** IAM.
* **Caso de Uso Extraído:** `UC-IAM-02: Activar Cuenta`.
* **Acción:** El empleado hace clic en el enlace, ingresa su nueva contraseña y el token se valida.
* **Resultado:** El estado del usuario en IAM pasa a `Active`. El proceso global finaliza con éxito.