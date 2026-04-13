---
to: test-src/modules/<%= h.changeCase.param(name) %>/domain/<%= h.changeCase.pascal(name) %>.entity.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const IdName = Name + 'IdVo' 
  const VoClassName = addVO ? Name + h.changeCase.pascal(voName) : null
  const VoHolder = addVO ? h.changeCase.camel(voName) : null
-%>
import { AggregateRoot } from '../../../shared/domain/aggregateRoot';
import { <%= IdName %> } from './value-objects/<%= IdName %>';
<% if(addEvents){ -%>
import { <%= Name %>CreatedEvent } from './events/<%= Name %>CreatedEvent';
<% } -%>
<% if(addVO){ -%>
import { <%= VoClassName %> } from './value-objects/<%= VoClassName %>';
<% } -%>

export interface <%= Name %>Props {
  createdAt: Date;
  <% if(addVO){ -%>
<%= VoHolder %>: <%= VoClassName %>;
<% } -%>
  // Añade aquí el resto de VOs si addVO es true...
}

export class <%= Name %> extends AggregateRoot< <%= Name %>Props> {
  
  // El constructor ahora llama a super()
  private constructor(props: <%= Name %>Props, id: <%= IdName %>) {
    super(props, id.getValue());
  }

  static create(props: <%= Name %>Props, id: <%= IdName %>): <%= Name %> {
    const entity = new <%= Name %>(props, id);

    <% if(addEvents){ -%>
    entity.record(new <%= Name %>CreatedEvent(id.getValue()));
    <% } -%>

    return entity;
  }
}
/**
 * Contrato del Repositorio para <%= Name %>
 * Se implementará en la capa de Infrastructure
 */
export interface I<%= Name %>Repository {
  save(entity: <%= Name %>): Promise<void>;
  findById(id: <%= IdName %>): Promise<<%= Name %> | null>;
  findAll(): Promise<<%= Name %>[]>;
  delete(id: <%= IdName %>): Promise<void>;
}