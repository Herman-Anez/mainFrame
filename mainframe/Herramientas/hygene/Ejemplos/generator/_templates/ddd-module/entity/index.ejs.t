---
to: "<%= targetPath %>/modules/<%= h.changeCase.param(moduleName) %>/index.ts"
---
<% 
  const Name = h.changeCase.pascal(name)
  const VarName = h.changeCase.camel(name)
-%>
import { Router } from 'express';
import { InMemory<%= Name %>Repository } from './infrastructure/persistence/in-memory/InMemory<%= Name %>Repository';
import { <%= Name %>Controller } from './interfaces/http/<%= Name %>Controller';
import { configure<%= Name %>Routes } from './interfaces/http/<%= VarName %>.routes';

<% if (addUseCases) { -%>
import { Create<%= Name %>UseCase } from './application/use-cases/Create<%= Name %>';
import { Get<%= Name %>ByIdUseCase } from './application/use-cases/Get<%= Name %>ById';
import { GetAll<%= Name %>sUseCase } from './application/use-cases/GetAll<%= Name %>s';
import { Update<%= Name %>UseCase } from './application/use-cases/Update<%= Name %>';
import { Delete<%= Name %>UseCase } from './application/use-cases/Delete<%= Name %>';
<% } -%>

// Punto de entrada del Bounded Context: <%= moduleName %>
export function create<%= Name %>Module(): Router {
  // 1. Instanciar Infraestructura
  const repository = new InMemory<%= Name %>Repository();

<% if (addUseCases) { -%>
  // 2. Instanciar Casos de Uso
  const createUseCase = new Create<%= Name %>UseCase(repository);
  const getByIdUseCase = new Get<%= Name %>ByIdUseCase(repository);
  const getAllUseCase = new GetAll<%= Name %>sUseCase(repository);
  const updateUseCase = new Update<%= Name %>UseCase(repository);
  const deleteUseCase = new Delete<%= Name %>UseCase(repository);

  // 3. Instanciar Controladores
  const controller = new <%= Name %>Controller(
    createUseCase,
    getByIdUseCase,
    getAllUseCase,
    updateUseCase,
    deleteUseCase
  );
<% } else { -%>
  // 3. Instanciar Controladores
  const controller = new <%= Name %>Controller();
<% } -%>

  // 4. Configurar y retornar Rutas
  const router = configure<%= Name %>Routes(controller);

  /**
   * NOTA: Aquí se deberían conectar los suscriptores de eventos de dominio 
   * y configurar el Event Publisher (Outbox Pattern) según los requerimientos 
   * de infraestructura específicos del módulo.
   */

  return router;
}
