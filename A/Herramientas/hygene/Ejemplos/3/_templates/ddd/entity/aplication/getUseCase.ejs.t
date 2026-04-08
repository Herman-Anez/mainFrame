---
to: test-src/modules/<%= h.changeCase.param(name) %>/application/Get<%= h.changeCase.pascal(name) %>.useCase.ts
---
<% Name = h.changeCase.pascal(name) -%>
import { I<%= Name %>Repository } from '../domain/<%= Name %>.entity';

export class Get<%= Name %>UseCase {
  constructor(private repository: I<%= Name %>Repository) {}

  async execute(input: any): Promise<void> {
    // 1. Lógica de orquestación
    // 2. Guardar en repo
  }
}