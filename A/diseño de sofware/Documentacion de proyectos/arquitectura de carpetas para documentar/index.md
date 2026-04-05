/docs
├── /architecture
│   ├── adr/                # Architecture Decision Records (Decisiones clave)
│   ├── c4-model/           # Diagramas de Contexto, Contenedores y Componentes
│   └── infrastructure.md   # Explicación de BD, Mensajería (RabbitMQ/Kafka), etc.
├── /modules
│   ├── /identity-access
│   │   ├── use-cases.md    # Casos de uso específicos (los que definimos)
│   │   ├── domain-model.md # Glosario/Lenguaje ubicuo y entidades
│   │   └── api-spec.md     # Definición de endpoints (o enlace a Swagger)
│   └── /human-resources
│       ├── use-cases.md
│       ├── domain-model.md
│       └── api-spec.md
├── /events
│   └── integration-events.md # Catálogo de eventos que conectan los módulos
└── README.md               # Guía rápida del proyecto

Explicación de las Carpetas Clave
1. El Directorio /adr (Architecture Decision Records)

Este es el "diario" de tus decisiones. Si decides usar JWT en lugar de Sessions, o PostgreSQL en lugar de MongoDB, creas un pequeño archivo aquí.

    Por qué: En arquitectura, el porqué decidiste algo es más importante que el qué hiciste.

2. El Directorio /modules

Cada módulo tiene su propia subcarpeta. Esto respeta el principio de Separación de Preocupaciones.

    domain-model.md: Aquí defines tu "Lenguaje Ubicuo". Por ejemplo: "En este sistema, un 'Usuario' es una entidad técnica, mientras que un 'Empleado' es una entidad legal/laboral".

3. El Directorio /events

Como vas a practicar la comunicación entre Identity y HR, necesitas un lugar donde documentar los mensajes que se mandan entre ellos.

    Ejemplo: El evento EmployeeCreated qué datos lleva (ID, email, nombre) y quién lo escucha.

Ejemplo de cómo organizar un archivo de documentación

Si abrimos docs/modules/human-resources/use-cases.md, debería verse así:
Casos de Uso: Human Resources
[UC-HR-01] Onboarding de Empleado

    Estado: Documentado | Prioridad: Alta

Descripción

Permite el registro legal de un nuevo colaborador en la empresa.
Flujo Principal

    El sistema solicita datos personales y contractuales.

    Se valida la unicidad del documento de identidad.

    El sistema persiste al Empleado.

    Trigger: Se emite el evento EmployeeCreated.