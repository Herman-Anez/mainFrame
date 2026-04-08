#  Notifications

**Bounded Context:** Gestión de comunicaciones salientes.

---

## 📖 1. Lenguaje Ubicuo
* **Notification (Notificación):** La unidad de mensaje enviada (un email, un SMS).
* **Template (Plantilla):** El cuerpo predefinido del mensaje con variables dinámicas (ej: "Hola {{name}}").
* **Recipient (Destinatario):** El contacto al que se envía el mensaje (Email, ID de usuario).
* **Provider (Proveedor):** El servicio externo que entrega el mensaje (SendGrid, AWS SES, Twilio).

## 🏗️ 2. Diseño Táctico
* **`Notification` (Aggregate Root):**
  * ID, Recipient, TemplateID, Data (JSON con las variables), Status (Pending, Sent, Failed).
* **`Channel` (Value Object):** Define si es EMAIL, SMS o PUSH.

## ⚙️ 3. Reglas de Negocio
1. Toda notificación debe estar asociada a una `Template` existente.
2. Si un envío falla por culpa del proveedor, el sistema debe reintentar hasta 3 veces (Retry Policy).
3. Se debe guardar un log de "Visto/Abierto" si el canal lo permite.