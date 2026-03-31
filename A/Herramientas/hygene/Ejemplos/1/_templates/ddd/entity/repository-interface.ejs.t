---
to: src/modules/<%= h.inflection.dasherize(name) %>/domain/I<%= h.changeCase.pascal(name) %>Repository.ts
---
<% Name = h.changeCase.pascal(name) -%>
import { <%= Name %>Entity } from './<%= Name %>Entity';

export interface I<%= Name %>Repository {
  save(entity: <%= Name %>Entity): Promise<void>;
  findById(id: string): Promise<<%= Name %>Entity | null>;
}