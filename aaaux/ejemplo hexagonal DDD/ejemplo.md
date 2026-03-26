Te dejo un ejemplo simple pero bien estructurado de un CRUD de helados en NestJS aplicando Arquitectura Hexagonal (Ports & Adapters) + DDD. La idea es separar claramente dominio, aplicación e infraestructura.

```bash
src/
 └── ice-cream/
      ├── domain/
      │    ├── entities/
      │    │     ice-cream.entity.ts
      │    ├── repositories/
      │    │     ice-cream.repository.ts
      │    └── value-objects/
      │          flavor.vo.ts
      │
      ├── application/
      │    ├── use-cases/
      │    │     create-ice-cream.use-case.ts
      │    │     find-all-ice-cream.use-case.ts
      │    │     update-ice-cream.use-case.ts
      │    │     delete-ice-cream.use-case.ts
      │
      ├── infrastructure/
      │    ├── persistence/
      │    │     in-memory-ice-cream.repository.ts
      │
      ├── interfaces/
      │    ├── dto/
      │    │     create-ice-cream.dto.ts
      │    ├── controllers/
      │    │     ice-cream.controller.ts
      │
      └── ice-cream.module.ts
```
