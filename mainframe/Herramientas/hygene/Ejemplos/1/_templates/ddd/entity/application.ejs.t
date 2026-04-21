---
to: src/modules/<%= h.changeCase.param(name) %>/application/Create<%= h.changeCase.pascal(name) %>.ts
---
<% Name = h.changeCase.pascal(name) -%>
import { I<%= Name %>Repository } from '../domain/<%= Name %>Entity';

export class Create<%= Name %>UseCase {
  constructor(private repository: I<%= Name %>Repository) {}

  async execute(input: any): Promise<void> {
    // 1. Lógica de orquestación
    // 2. Guardar en repo
  }
}