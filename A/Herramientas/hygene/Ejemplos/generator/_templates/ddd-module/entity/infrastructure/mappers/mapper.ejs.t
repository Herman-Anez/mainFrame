---
to: "<%= targetPath %>/modules/<%= h.changeCase.param(moduleName) %>/infrastructure/mappers/<%= h.changeCase.pascal(name) %>Mapper.ts"
---
<% 
  const Name = h.changeCase.pascal(name)
  const VarName = h.changeCase.camel(name)
-%>
import { <%= Name %> } from '../../domain/<%= Name %>.entity';
import { <%= Name %>Id } from '../../domain/value-objects/<%= Name %>Id';

export class <%= Name %>Mapper {
  public static toDomain(raw: any): <%= Name %> {
    const id = <%= Name %>Id.create(raw.id);
    
    // Mapear el resto de propiedades de persistencia a dominio
    return <%= Name %>.create(
      {
        ...raw,
        createdAt: new Date(raw.createdAt),
        updatedAt: new Date(raw.updatedAt),
      },
      id
    );
  }

  public static toPersistence(domain: <%= Name %>): any {
    return {
      id: domain.id,
      ...domain.props,
    };
  }

  public static toResponse(domain: <%= Name %>): any {
    return {
      id: domain.id,
      ...domain.props,
    };
  }
}
