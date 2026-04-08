# ERP Core

Este proyecto es el núcleo de un sistema ERP diseñado bajo los principios de Domain-Driven Design (DDD). El objetivo es construir una arquitectura altamente desacoplada, mantenible y escalable, centrada en la lógica de negocio.

Actualmente, el proyecto se enfoca en dos dominios fundamentales:

    Identity & Access Management (IAM): Seguridad, autenticación y autorización.

    Human Resources (HR): Gestión del ciclo de vida del empleado y estructura organizacional.

## Arquitectura y Patrones

Este proyecto utiliza DDD para separar las preocupaciones técnicas de las reglas de negocio:

* Bounded Contexts: Cada módulo es un contexto independiente con su propio modelo de dominio y base de datos (o esquema).

* Tactical Design: Uso de Entidades, Objetos de Valor (Value Objects), Agregados y Repositorios.

* Comunicación Asíncrona: Integración entre módulos basada en Eventos de Dominio.

## Módulos Actuales

1. Identity & Access (IAM)

Encargado de la identidad técnica y el control de acceso.

* Entidades Clave: User, Role, Permission.

* Responsabilidades: Autenticación (JWT), Gestión de RBAC (Role-Based Access Control) y Auditoría de accesos.

2. Human Resources (HR)

Encargado del empleado como entidad de negocio y su relación laboral.

* Entidades Clave: Employee, Contract, Department.

* Responsabilidades: Onboarding de personal, gestión de contratos, organigrama y ausencias.

🗺️ Mapa de Contextos (Context Map)

Para mantener la integridad del sistema, los módulos se comunican mediante eventos.

Ejemplo de flujo de integración:

* HR registra un nuevo Employee.

* Se dispara un evento de dominio EmployeeOnboarded.

* IAM reacciona a este evento creando un User con los permisos base.