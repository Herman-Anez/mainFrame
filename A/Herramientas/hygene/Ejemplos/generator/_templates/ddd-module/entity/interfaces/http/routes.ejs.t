---
to: "<%= targetPath %>/modules/<%= h.changeCase.param(moduleName) %>/interfaces/http/<%= h.changeCase.camel(name) %>.routes.ts"
---
<% 
  const Name = h.changeCase.pascal(name)
  const VarName = h.changeCase.camel(name)
-%>
import { Router } from 'express';
import { <%= Name %>Controller } from './<%= Name %>Controller';

export function configure<%= Name %>Routes(controller: <%= Name %>Controller): Router {
  const router = Router();

<% if (addUseCases) { -%>
  router.post('/', (req, res) => controller.create(req, res));
  router.get('/', (req, res) => controller.getAll(req, res));
  router.get('/:id', (req, res) => controller.getById(req, res));
  router.put('/:id', (req, res) => controller.update(req, res));
  router.delete('/:id', (req, res) => controller.delete(req, res));
<% } else { -%>
  // router.post('/', (req, res) => controller.create(req, res));
<% } -%>

  return router;
}
