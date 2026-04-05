Enfoques guiados por pruebas o calidad

✅ TDD (Test-Driven Development)
Primero escribes tests, luego el código
Ciclo: Red → Green → Refactor
Muy cercano a BDD (BDD es una evolución más orientada a negocio)

👉 Enfoque: calidad técnica y diseño del código

🔍 ATDD (Acceptance Test-Driven Development)
Similar a BDD, pero centrado en tests de aceptación
Define criterios antes de desarrollar

👉 Enfoque: validación con el cliente

🔒 SDD (Security-Driven Development)
El desarrollo se guía por requisitos de seguridad
Se prioriza prevenir vulnerabilidades

👉 Enfoque: seguridad desde el diseño

🏗️ Enfoques guiados por diseño o arquitectura
🏛️ DDD (Domain-Driven Design)
Ya lo vimos: centrado en el dominio del negocio
🎨 MDD (Model-Driven Development)
El sistema se construye a partir de modelos abstractos
A veces genera código automáticamente

👉 Enfoque: modelado antes que código

📐 FDD (Feature-Driven Development)
El desarrollo se organiza por funcionalidades pequeñas (“features”)
Muy estructurado y orientado a entregas rápidas

👉 Enfoque: features del cliente

🚀 Enfoques guiados por el negocio o producto
📈 BDD (Behavior-Driven Development)
Basado en comportamiento (ya explicado)
💼 BVD (Business-Value-Driven Development)
Se prioriza lo que aporta más valor al negocio

👉 Enfoque: ROI y valor

👤 UDD (User-Driven Development)
Se centra en necesidades reales del usuario

👉 Enfoque: experiencia de usuario

⚙️ Enfoques más técnicos o especializados
⚡ PDD (Performance-Driven Development)
Optimización de rendimiento desde el inicio
🧠 EDD (Event-Driven Development)
Basado en eventos (muy usado en microservicios)
🧩 API-First Development
Primero diseñas la API, luego implementas

👉 Enfoque: integraciones y contratos

🧾 Resumen rápido
Tipo	Ejemplos	Enfoque
Testing	TDD, BDD, ATDD	Calidad y validación
Diseño	DDD, MDD, FDD	Arquitectura
Negocio	BDD, BVD, UDD	Valor y usuario
Técnico	EDD, PDD, API-First	Implementación
💡 Idea clave

No tienes que elegir solo uno. En proyectos reales se combinan:

👉 Ejemplo típico:

DDD → diseño del dominio
BDD → definir comportamiento
TDD → implementar con calidad