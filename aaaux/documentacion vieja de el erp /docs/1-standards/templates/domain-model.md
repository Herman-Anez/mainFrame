# Modelo de Dominio: [Nombre del Bounded Context]

**Bounded Context:** [Nombre]  
**Responsabilidad Principal:** [Una frase clara]  
**Versión:** 1.0.0

## 📖 1. Lenguaje Ubicuo

| Término| Definición                        | Ejemplo                 |
|--------|-----------------------------------|-------------------------|
|Employee|Persona con relación laboral formal|Juan Pérez (Legajo 45823)|

## 🏗️ 2. Diseño Táctico (Tactical DDD)
    
### Aggregate Roots
- **`NombreAgregado`** – Descripción breve + invariantes principales.

### Entidades
- **`OtraEntidad`**

### Value Objects
- **`EmailAddress`** – Validaciones y comportamiento.

### Domain Events
- `UserCreated` → Descripción + consumidores conocidos.

## ⚙️ 3. Reglas de Negocio (Invariantes)

1. ...
2. ...

## 📊 4. Diagramas

```plantuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
... 