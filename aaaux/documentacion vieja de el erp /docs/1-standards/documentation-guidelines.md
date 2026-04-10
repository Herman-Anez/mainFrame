# Guía de Documentación - ERP Core

**Versión:** 1.0.0  
**Estado:** Draft → **Listo para revisión**  
**Fecha:** 2026-04-05

## 🎯 Objetivo

Establecer estándares claros para que **toda la documentación sea consistente, mantenible y de alto valor** para desarrolladores, arquitectos y nuevos miembros del equipo.

## 📌 Principios Generales

- **Idioma**: 
  - **Inglés** para términos técnicos, nombres de clases, patrones y código.
  - **Español** para descripciones de negocio, requisitos y explicaciones orientadas al usuario final.
- **Mantener actualizado**: La documentación vive junto al código. Todo cambio relevante debe actualizar su documentación.
- **DRY (Don't Repeat Yourself)**: Evitar duplicación de información entre documentos.
- **Primero lo importante**: Siempre empezar por **por qué** y **qué**, luego **cómo**.

## 📁 Estructura Recomendada por Módulo

```bash
docs/modules/[bounded-context]/
├── README.md
├── requirements.md
├── domain-model.md
├── api-spec.md
├── endpoints/
│   └──[endpoint-name].md
├── use-cases/
│   └── uc-[id]-[nombre].md
├── integration-events.md (si aplica)
├── architecture/
│   ├── c4-model/
│   └── quality-attributes.md
└── infrastructure.md
```