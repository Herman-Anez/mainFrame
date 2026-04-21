---
to: test-src/modules/<%= h.changeCase.param(name) %>/<%= h.changeCase.param(name) %>.module.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const kname = h.changeCase.param(name)
-%>
import { Module } from '@nestjs/common';
import { <%= Name %>UseCases } from './application/<%= kname %>.usecase-funnel';
import { <%= Name %>Controller } from './infrastructure/presentation/<%= kname %>.controller';
import { Create<%= Name %>UseCase } from './application/usecases/create-<%= kname %>.usecase';
import { Get<%= Name %>UseCase } from './application/usecases/get-<%= kname %>.usecase';
import { Update<%= Name %>UseCase } from './application/usecases/update-<%= kname %>.usecase';
import { Delete<%= Name %>UseCase } from './application/usecases/delete-<%= kname %>.usecase';
import { InMemory<%= Name %>Repository } from './infrastructure/persistence/in-memory/<%= kname %>-repository';

@Module({
  controllers: [<%= Name %>Controller],
  providers: [
    // El Funnel/Servicio
    <%= Name %>UseCases,
    
    // Los Casos de Uso individuales
    Create<%= Name %>UseCase,
    Get<%= Name %>UseCase,
    Update<%= Name %>UseCase,
    Delete<%= Name %>UseCase,

    // Inyección del Repositorio (Usando la implementación en memoria por ahora)
    {
      provide: 'I<%= Name %>Repository', // Token para la inversión de dependencia
      useClass: InMemory<%= Name %>Repository,
    },
  ],
  exports: [<%= Name %>UseCases], // Por si otro módulo necesita usar este negocio
})
export class <%= Name %>Module {}