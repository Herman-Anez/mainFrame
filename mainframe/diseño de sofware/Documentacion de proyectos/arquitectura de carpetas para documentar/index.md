```bash
/docs
├── requirements-index.md* # <---  Requisitos Globales (Funcionales y No Funcionales)
├── /global-architecture
│   ├── adr/                # Architecture Decision Records (Decisiones clave)
│   ├── c4-model/           # Diagramas de Contexto, Contenedores y Componentes
│   └── infrastructure.md   # Explicación de BD, Mensajería (RabbitMQ/Kafka), etc.
├── /modules
│   ├── /module1
│   │   ├──/architecture # Definición de endpoints (o enlace a Swagger)
│   │   │  ├── quality-attributes.md # <--- OPCIONAL: Profundización en los No Funcionales
│   │   │  ├── /c4-model           # Diagramas de Contexto, Contenedores y Componentes
│   │   │  └── infrastructure.md # Explicación de BD, Mensajería (RabbitMQ/Kafka), etc.
│   │   ├── /use-cases   # Casos de uso específicos (los que definimos)
│   │   │   └── use-case.md
│   │   ├── domain-model.md # Glosario/Lenguaje ubicuo y entidades
│   │   └── api-spec.md    
│   └── /module2
├── /events
│   └── integration-events.md # Catálogo de eventos que conectan los módulos
└── README.md               # Guía rápida del proyecto
```

```bash
✔ tree docs
docs
├── standards
│   ├── coding-conventions.md
│   ├── documentation-guidelines.md
│   ├── git-workflow.md
│   └── templates
│       └── domain-model.md
├── architecture
│   ├── adrs
│   │   ├── index.md
│   │   ├── README.md
│   │   └── template.md
│   ├── c4-model
│   │   └── infrastructure.md
│   ├── infrastructure.md
│   └── quality-attributes.md
├── events
│   └── integration-events.md
├── modules
│   └── module
│       ├── api-spec.md
│       ├── architecture
│       │   ├── c4-model
│       │   │   └── infrastructure.md
│       │   ├── infrastructure.md
│       │   └── quality-attributes.md
│       ├── domain-model.md
│       ├── requirements.md
│       └── use-cases
│           ├── uc-iam-00-create-user.md
│           └── uc-iam-01-login-jwt.md
├── README.md
├── requirements-index.md

```

Explicación de las Carpetas Clave
1. El Directorio /adr (Architecture Decision Records)

Este es el "diario" de tus decisiones. Si decides usar JWT en lugar de Sessions, o PostgreSQL en lugar de MongoDB, creas un pequeño archivo aquí.

* Por qué: En arquitectura, el porqué decidiste algo es más importante que el qué hiciste.

2. El Directorio /modules

Cada módulo tiene su propia subcarpeta. Esto respeta el principio de Separación de Preocupaciones.

* domain-model.md: Aquí defines tu "Lenguaje Ubicuo". Por ejemplo: "En este sistema, un 'Usuario' es una entidad técnica, mientras que un 'Empleado' es una entidad legal/laboral".

3. El Directorio /events

Como vas a practicar la comunicación entre Identity y HR, necesitas un lugar donde documentar los mensajes que se mandan entre ellos.

* Ejemplo: El evento EmployeeCreated qué datos lleva (ID, email, nombre) y quién lo escucha.

Ejemplo de cómo organizar un archivo de documentación

Si abrimos docs/modules/human-resources/use-cases.md, debería verse así:
Casos de Uso: Human Resources
[UC-HR-01] Onboarding de Empleado

* Estado: Documentado | Prioridad: Alta

Descripción

Permite el registro legal de un nuevo colaborador en la empresa.
Flujo Principal

* El sistema solicita datos personales y contractuales.

* Se valida la unicidad del documento de identidad.

* El sistema persiste al Empleado.

* Trigger: Se emite el evento EmployeeCreated.

2. Requisitos No Funcionales (RNF)

Aquí es donde la Arquitectura de Software brilla. Estos definen la "calidad" y limitan las decisiones tecnológicas.
Principales categorías para tu ERP:

* Seguridad (Crítico para IAM): * Las contraseñas deben estar cifradas con un algoritmo de hashing fuerte (ej. Argon2 o Bcrypt).

* * El sistema debe soportar el principio de "Mínimo Privilegio".

* Escalabilidad (Crítico para DDD):

* * Los módulos de IAM y HR deben poder desplegarse de forma independiente (si decides ir por microservicios en el futuro).

* Disponibilidad:

* * El servicio de autenticación debe tener un tiempo de respuesta menor a 200ms.

* Integridad de Datos:

* * Cualquier cambio en el estado del empleado en HR debe reflejarse en IAM en menos de 5 segundos (Consistencia eventual).