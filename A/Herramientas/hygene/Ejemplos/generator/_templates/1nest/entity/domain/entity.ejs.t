---
to: test-src/modules/<%= h.changeCase.param(name) %>/domain/<%= h.changeCase.kebabCase(name) %>.entity.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const Lname = h.changeCase.camel(name)
  kname = h.changeCase.kebabCase(name)
  const IdName = Name + 'IdVo' 
  const LIdName = kname + '-vos' 
  const list = typeof voList === 'string' ? voList.split(',').map(v => v.trim()) : (voList || []);  
-%>
import { AggregateRoot } from '../../../shared/domain/aggregateRoot';
import { <%= IdName %>, <% if(addVO && list.length > 0){ -%><% list.forEach(vo => { -%><%= Name %><%= h.changeCase.pascal(vo) %>,<% }) -%><% } -%> } from './value-objects/<%= LIdName %>';
<% if(addEvents){ -%>
import { <%= Name %>CreatedEvent } from './events/<%= kname %>-created-event';
<% } -%>
export interface <%= Name %>Props {
  createdAt: Date;
  id: <%= IdName %>
<% if(addVO){ -%>
<% list.forEach(vo => { -%>
<% 
  VoHolder = addVO ? h.changeCase.camel(vo) : null
  VoClassName = addVO ? Name + h.changeCase.pascal(vo) : null
-%>
  <%= VoHolder %>: <%= VoClassName %>;
<% }) -%>
<% } -%>
}

export class <%= Name %> extends AggregateRoot< <%= Name %>Props, <%= Name %>IdVo> {
  
  // El constructor ahora llama a super()
  private constructor(props: <%= Name %>Props) {
    super(props);
  }

  static create(props: <%= Name %>Props): <%= Name %> {
    const entity = new <%= Name %>(props);

    <% if(addEvents){ -%>
    entity.record(new <%= Name %>CreatedEvent(entity.id));
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
  findById(id: <%= IdName %>): Promise< <%= Name %> | null>;
  findAll(): Promise< <%= Name %>[]>;
  delete(id: <%= IdName %>): Promise<void>;
}