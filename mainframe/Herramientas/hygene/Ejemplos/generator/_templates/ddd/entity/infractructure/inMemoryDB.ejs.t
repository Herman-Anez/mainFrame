---
to: test-src/modules/<%= h.changeCase.param(name) %>/infrastructure/persistence/in-memory/<%= h.changeCase.pascal(name) %>.InMemory<%= h.changeCase.pascal(name) %>Repository.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const Lname = h.changeCase.camel(name)
  const IdName = Name + 'IdVo' 
  const Plural = h.changeCase.camel(plural)
  const VoClassName = addVO ? Name + h.changeCase.pascal(voName) : null
  const VoHolder = addVO ? h.changeCase.camel(voName) : null
-%>
import { <%= Name %>, I<%= Name %>Repository  } from '../../domain/<%= Name %>.entity';

export class InMemory<%= Name %>Repository implements I<%= Name %>Repository {
  private <%= Plural %>: <%= Name %>[] = [];

  async create(<%= Lname %>: <%= Name %>): Promise< <%= Name %>> {
    this.<%= Plural %>.push(<%= Lname %>);
    return <%= Lname %>;
  }

  async findAll(): Promise< <%= Name %>[]> {
    return this.<%= Plural %>;
  }

  async findById(id: string): Promise< <%= Name %> | null> {
    return this.<%= Plural %>.find((p) => p.id === id) || null;
  }

  async update(<%= Lname %>: <%= Name %>): Promise< <%= Name %>> {
    const index = this.<%= Plural %>.findIndex((p) => p.id === <%= Lname %>.id);
    this.<%= Plural %>[index] = <%= Lname %>;
    return <%= Lname %>;
  }

  async delete(id: string): Promise<void> {
    this.<%= Plural %> = this.<%= Plural %>.filter((p) => p.id !== id);
  }
}
