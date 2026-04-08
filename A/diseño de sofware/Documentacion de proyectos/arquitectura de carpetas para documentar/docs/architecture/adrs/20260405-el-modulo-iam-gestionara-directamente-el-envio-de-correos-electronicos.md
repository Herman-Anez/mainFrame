# El módulo IAM gestionará directamente el envío de correos electrónicos

**Fecha:** 2026-04-05
**Estado:** Aceptado

## Contexto
Durante el diseño del caso de uso de "Alta de Nuevo Usuario", surgió la necesidad de notificar al usuario sus credenciales temporales o enlace de activación. Debíamos decidir si el envío del correo electrónico sería responsabilidad directa del módulo Identity & Access (IAM) o si se delegaría a un servicio/módulo de notificaciones genérico a través de eventos de dominio.

## Decisión
Se ha decidido que **el módulo IAM integrará directamente un cliente de correo electrónico (SMTP/API)** y será el responsable de enviar los correos transaccionales relacionados con la seguridad (bienvenida, recuperación de contraseña, alertas de seguridad).

## Consecuencias

### Positivas (+)
* **Simplicidad arquitectónica:** No necesitamos levantar ni mantener un servicio de notificaciones separado ni una cola de mensajes (RabbitMQ/Kafka) en esta etapa temprana del ERP.
* **Flujo cohesivo:** Toda la lógica de "ciclo de vida de la cuenta" (incluyendo la comunicación con el usuario sobre su cuenta) reside en un solo lugar.

### Negativas / Riesgos a mitigar (-)
* **Acoplamiento a infraestructura externa:** El módulo IAM ahora depende de la disponibilidad del proveedor de correo.
* **Riesgo de latencia:** El envío de correos puede tardar varios segundos. 
* **Mitigación obligatoria:** El envío del correo **debe** realizarse de forma asíncrona dentro de IAM (por ejemplo, en un hilo secundario, "background job" o corrutina) para no bloquear la respuesta HTTP `201 Created` que espera el administrador. No debemos fallar la creación del usuario solo porque el correo tardó en enviarse.