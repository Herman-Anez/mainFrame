# Arquitectura y Patrones

Este proyecto utiliza DDD para separar las preocupaciones técnicas de las reglas de negocio:

* Bounded Contexts: Cada módulo es un contexto independiente con su propio modelo de dominio y base de datos (o esquema).

* Tactical Design: Uso de Entidades, Objetos de Valor (Value Objects), Agregados y Repositorios.

* Comunicación Asíncrona: Integración entre módulos basada en Eventos de Dominio.
