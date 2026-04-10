# Delegación del envío de correos a un módulo dedicado (Notifications)

**Fecha:** 2026-04-05
**Estado:** Aceptado (Reemplaza decisión anterior)

## Contexto
Durante el diseño de la creación de usuarios en IAM, se debatió quién debía enviar los correos transaccionales (como el token de activación). Inicialmente se pensó en acoplarlo a IAM, pero se reconsideró para favorecer la escalabilidad y reutilización en todo el ERP.

## Decisión
Se extraerá la responsabilidad de enviar correos electrónicos y notificaciones a un **Bounded Context separado (Módulo de Notificaciones)**. Los módulos del ERP (como IAM o HR) no enviarán correos directamente, sino que emitirán **Eventos de Integración** (Integration Events) o enviarán comandos asíncronos a este nuevo módulo.

## Consecuencias

### Positivas (+)
* **Alta Cohesión y Bajo Acoplamiento:** IAM se enfoca 100% en seguridad. Notificaciones se enfoca 100% en entregar mensajes.
* **Tolerancia a fallos:** Si el proveedor SMTP falla, el módulo de notificaciones puede implementar políticas de reintento (Retries) sin afectar la transacción original en IAM.
* **Reusabilidad:** El módulo de HR también podrá usar este servicio para notificar nóminas o vacaciones.

### Negativas / Riesgos a mitigar (-)
* **Complejidad de Infraestructura:** Requiere implementar un mecanismo de comunicación asíncrona entre módulos (ej. RabbitMQ, Kafka, AWS SQS o una tabla de Outbox en la base de datos).
* **Consistencia Eventual:** El administrador que crea el usuario recibirá un "OK", pero el correo podría llegar unos segundos (o minutos) más tarde.