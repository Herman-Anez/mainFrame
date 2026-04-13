---
to: <%= targetPath %>/modules/<%= h.changeCase.param(moduleName) %>/domain/<%= h.changeCase.pascal(name) %>.entity.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const IdName = Name + 'Id' 
-%>
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { <%= IdName %> } from './value-objects/<%= IdName %>';
import { <%= Name %>CreatedDomainEvent } from './events/<%= Name %>CreatedDomainEvent';

export interface <%= Name %>Props {
  // Define las propiedades aquí
  createdAt: Date;
  updatedAt: Date;
}

export class <%= Name %> extends AggregateRoot<<%= Name %>Props> {
  
  private constructor(props: <%= Name %>Props, id: string) {
    super(props, id);
  }

  public static create(props: <%= Name %>Props, id: <%= IdName %>): <%= Name %> {
    const isNew = !id;
    const entityId = id ? id.value : 'gen-id'; // Reemplazar con generador de UUID real
    
    const entity = new <%= Name %>(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      entityId
    );

    if (isNew) {
      entity.record(new <%= Name %>CreatedDomainEvent(entity.id));
    }

    return entity;
  }
}
