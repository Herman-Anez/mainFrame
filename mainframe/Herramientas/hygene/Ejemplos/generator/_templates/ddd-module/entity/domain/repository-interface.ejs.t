---
to: <%= targetPath %>/modules/<%= h.changeCase.param(moduleName) %>/domain/I<%= h.changeCase.pascal(name) %>Repository.ts
---
<% 
  const Name = h.changeCase.pascal(name)
-%>
import { <%= Name %> } from './<%= Name %>.entity';

export interface I<%= Name %>Repository {
  save(entity: <%= Name %>): Promise<void>;
  findById(id: string): Promise<<%= Name %> | null>;
  findAll(): Promise<<%= Name %>[]>;
  delete(id: string): Promise<void>;
}
