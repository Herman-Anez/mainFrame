
## Captura de Requerimientos Funcionales (Comportamiento)

* Gherkin Gherkin (vía Cucumber / Behat / SpecFlow): Es el estándar open source. Te permite escribir los requerimientos en un lenguaje que el experto de negocio entiende, pero que el código puede ejecutar.
    * Relación Hexagonal: Cada escenario Gherkin define las pruebas de aceptación de tus Casos de Uso (la capa de Aplicación).

* Cucumber ppara conectar Gherkin con codigo

* Pickles: Es un generador de documentación "viva" de código abierto. Toma tus archivos de requerimientos (.feature de Gherkin) y los convierte en un sitio web dinámico que puedes compartir con los interesados.


## Captura de Requerimientos No Funcionales (Atributos de Calidad)

2. Captura de Requerimientos No Funcionales (Atributos de Calidad)

Los requerimientos no funcionales (rendimiento, seguridad, escalabilidad) en Arquitectura Hexagonal suelen definirse en los Adaptadores (infraestructura) o como políticas de dominio.

* Architecture Decision Records (ADR): No es una herramienta "visual", sino una práctica soportada por herramientas open source como adr-tools. Permite capturar el por qué de una decisión técnica (ej: "Usaremos Redis por latencia menor a 10ms"). Se guarda en Markdown dentro de tu repositorio.

    * log4brains para la implementacion standar de ADRs

* JMeter o Locust: Para capturar y definir requerimientos de Rendimiento. Locust es open source y usas Python para definir los escenarios de carga, lo cual es muy flexible para probar tus "puntos de entrada" (Primary Adapters).

* OWASP ZAP: Para requerimientos de Seguridad. Es la herramienta open source líder para auditoría y captura de vulnerabilidades en tus puertos de exposición (APIs).

## Trazabilidad y Modelado de Requerimientos

* Modelio (Open Source Edition): Una herramienta de modelado UML y BPMN muy completa. Permite crear diagramas de casos de uso y diagramas de requisitos vinculados a tus modelos de dominio.

* Capella: Es una herramienta de ingeniería de sistemas de Eclipse (Open Source). Es increíblemente potente para el modelado de arquitecturas complejas y la gestión de requerimientos técnicos y operativos. Permite ver cómo un requerimiento impacta en un componente específico.


## Graficos como codigo 

* Platuml




