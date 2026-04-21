---
to: <%= targetPath %>/modules/<%= h.changeCase.param(moduleName) %>/application/use-cases/Create<%= h.changeCase.pascal(name) %>.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const VarName = h.changeCase.camel(name)
  const IdName = Name + 'Id' 
-%>
import { I<%= Name %>Repository } from '../../domain/I<%= Name %>Repository';
import { <%= Name %>, <%= Name %>Props } from '../../domain/<%= Name %>.entity';
import { <%= IdName %> } from '../../domain/value-objects/<%= IdName %>';

export interface Create<%= Name %>Request {
  id?: string;
  // Añade aquí campos adicionales del DTO
}

export class Create<%= Name %>UseCase {
  constructor(private readonly repository: I<%= Name %>Repository) {}

  async execute(request: Create<%= Name %>Request): Promise<void> {
    const id = request.id ? <%= IdName %>.create(request.id) : null;
    
    // Aquí se mappearía el request a las props de la entidad
    const props: <%= Name %>Props = {
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const <%= VarName %> = <%= Name %>.create(props, id);

    await this.repository.save(<%= VarName %>);
  }
}
