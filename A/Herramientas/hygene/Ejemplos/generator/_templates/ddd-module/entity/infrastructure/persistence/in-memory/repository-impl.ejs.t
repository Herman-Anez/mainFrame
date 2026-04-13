---
to: <%= targetPath %>/modules/<%= h.changeCase.param(moduleName) %>/infrastructure/persistence/in-memory/InMemory<%= h.changeCase.pascal(name) %>Repository.ts
---
<% 
  const Name = h.changeCase.pascal(name)
-%>
import { I<%= Name %>Repository } from '../../../domain/I<%= Name %>Repository';
import { <%= Name %> } from '../../../domain/<%= Name %>.entity';

export class InMemory<%= Name %>Repository implements I<%= Name %>Repository {
  private items: Map<string, <%= Name %>> = new Map();

  async save(entity: <%= Name %>): Promise<void> {
    this.items.set(entity.id, entity);
  }

  async findById(id: string): Promise<<%= Name %> | null> {
    return this.items.get(id) || null;
  }

  async findAll(): Promise<<%= Name %>[]> {
    return Array.from(this.items.values());
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}
