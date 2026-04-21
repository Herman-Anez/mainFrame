# [ID-UC] Nombre del Caso de Uso

**Módulo:** [Identity-Access / Human-Resources]
**Actor Principal:** [Ej: Empleado, Admin, Sistema]
**Descripción:** Breve resumen de qué intenta lograr el actor.

---
### 1. Pre-condiciones
* Listado de requisitos previos (ej: El usuario debe estar autenticado).
* El estado previo del sistema.

### 2. Flujo Principal (Happy Path)
1. El actor [realiza acción].
2. El sistema [valida/procesa].
3. El sistema [guarda/notifica].
4. ...

### 3. Flujos Alternativos / Excepciones
* **A1 - [Nombre de error]:** Qué pasa si los datos son inválidos.
* **A2 - [Nombre de error]:** Qué pasa si el usuario no tiene permisos.

### 4. Post-condiciones
* **Éxito:** Qué cambió en la base de datos y qué respuesta recibe el actor.
* **Fallo:** El estado del sistema no debe alterarse (Atomicidad).

### 5. Eventos de Dominio (Crucial para Arquitectura)
* ¿Este caso de uso dispara algo que otros módulos deban saber? 
* *Ej: `EmployeeCreated`, `UserAccessRevoked`.*


Atributo,Contexto: Identity-Access,Contexto: Human-Resources
Responsabilidad,"Autenticación, Seguridad, Sesiones.","Contratos, Nómina, Desempeño."
Entidad Principal,User,Employee
Atributos Clave,"Username, HashedPassword, Roles.","Salary, HireDate, Department."
Identificador,account_id (UUID),employee_number (Legajo)
Lenguaje Ubicuo,"Login, Token, Grant, Claim.","Onboarding, Vacaciones, Ascenso."