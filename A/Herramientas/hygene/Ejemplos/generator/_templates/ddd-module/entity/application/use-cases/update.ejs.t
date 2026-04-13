---
to: "<%= addUseCases ? targetPath + '/modules/' + h.changeCase.param(moduleName) + '/application/use-cases/Update' + h.changeCase.pascal(name) + '.ts' : null %>"
---
<% 
  const Name = h.changeCase.pascal(name)
  const VarName = h.changeCase.camel(name)
-%>
import { I<%= Name %>Repository } from '../../domain/I<%= Name %>Repository';

export interface Update<%= Name %>Request {
  id: string;
  // TODO: Añadir propiedades a actualizar aquí
}

export class Update<%= Name %>UseCase {
  constructor(private readonly repository: I<%= Name %>Repository) {}

  async execute(request: Update<%= Name %>Request): Promise<void> {
    const <%= VarName %> = await this.repository.findById(request.id);
    
    if (!<%= VarName %>) {
      throw new Error('<%= Name %> no encontrado');
    }

    // TODO: Invocar métodos del Aggregate (ej: <%= VarName %>.updateDetails(...))
    
    await this.repository.save(<%= VarName %>);
  }
}
