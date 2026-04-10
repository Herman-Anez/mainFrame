# Modelo de Dominio: Human Resources (HR)

**Bounded Context:** Gestión del talento humano y estructura organizacional.
**Responsabilidad:** Administrar el ciclo de vida laboral de los empleados, sus compensaciones legales (contratos) y su ubicación dentro de la jerarquía de la empresa.

---

## 📖 1. Lenguaje Ubicuo (Glosario)
Términos de negocio estrictos para este contexto:

* **Employee (Empleado):** Una persona física que tiene una relación laboral formal con la empresa. *Nota: Se identifica por su número de documento legal, no por su correo electrónico de login.*
* **Contract (Contrato):** El acuerdo legal vinculante entre el Empleado y la empresa que define su salario, puesto y duración.
* **Department (Departamento):** Una unidad organizativa que agrupa a varios empleados y tiene un responsable (Manager).
* **Position (Puesto de Trabajo):** El cargo que ocupa el empleado (Ej. "Desarrollador Senior", "Contador"). *Nota: No confundir con los 'Roles' del módulo IAM (que son permisos de software).*
* **Manager (Responsable):** Un Empleado que tiene a su cargo a otros Empleados (reportes directos).

---

## 🏗️ 2. Diseño Táctico (Tactical DDD)

### Agregados y Raíces de Agregado (Aggregate Roots)
* **`Employee` (Aggregate Root):** Es la entidad central. Toda modificación sobre el estado laboral de la persona, sus datos personales o la firma de un nuevo contrato debe pasar por aquí para garantizar la coherencia legal.
  * *Manejo de Concurrencia (Optimistic Locking):* Posee un atributo `Version` (entero o UUID temporal). Al intentar guardar cambios concurrentes, si la versión en la base de datos difiere de la cargada en memoria, se lanza una `OptimisticConcurrencyException` para prevenir superposición de contratos o estados inconsistentes.
* **`Department` (Aggregate Root):** Gestiona su propio ciclo de vida y presupuesto. Un departamento existe independientemente de si tiene empleados asignados o no en un momento dado.

### Entidades Locales (Entities)
* **`Contract`:** * Identificador: `Contract_ID`
  * Atributos: `Type` (Indefinido, Temporal), `StartDate`, `EndDate` (Opcional).
  * *Ciclo de vida:* Pertenece exclusivamente al agregado `Employee`.

### Objetos de Valor (Value Objects)
Al ser inmutables, nos evitan errores críticos como cruzar monedas o procesar sueldos negativos.
* **`Money` (Dinero):** Encapsula el `Amount` (Cantidad) y la `Currency` (Moneda, ej. USD, EUR). Previene operaciones no válidas (ej. sumar USD con EUR directamente).
* **`TaxId` (Identificador Fiscal):** Encapsula la validación del número de identidad nacional (DNI, SSN, NIF).
* **`DateRange` (Rango de Fechas):** Define el inicio y fin de un contrato o de unas vacaciones. Garantiza que la fecha de fin nunca sea anterior a la fecha de inicio.

---

## ⚙️ 3. Reglas de Negocio (Invariantes del Dominio)

Las reglas que el Agregado `Employee` debe proteger bajo cualquier circunstancia:
1. **Identidad Legal Única:** No pueden existir dos empleados con el mismo `TaxId` en el sistema, incluso si uno está inactivo.
2. **Historial Contractual:** Un empleado no puede tener dos `Contract` activos de tiempo completo simultáneamente.
3. **Jerarquía Acíclica:** Un empleado no puede ser su propio `Manager` ni puede reportar a alguien que, jerárquicamente, le reporta a él (evitar bucles infinitos en el organigrama).
4. **Salario Mínimo:** Al crear un `Contract`, el objeto de valor `Money` del salario no puede ser inferior al salario mínimo legal configurado.

[back](./readme.md)