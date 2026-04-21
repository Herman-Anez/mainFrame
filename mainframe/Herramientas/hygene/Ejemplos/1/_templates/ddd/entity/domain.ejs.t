---
to: src/modules/<%= h.changeCase.param(name) %>/domain/<%= h.changeCase.pascal(name) %>Entity.ts
---
<% Name = h.changeCase.pascal(name) -%>
export interface <%= Name %>Props {
  id: string;
  createdAt: Date;
}

export class <%= Name %>Entity {
  constructor(public readonly props: <%= Name %>Props) {}

  static create(props: <%= Name %>Props): <%= Name %>Entity {
    return new <%= Name %>Entity(props);
  }
}

// Contrato (Interfaz)
export interface I<%= Name %>Repository {
  save(entity: <%= Name %>Entity): Promise<void>;
  findById(id: string): Promise<<%= Name %>Entity | null>;
}