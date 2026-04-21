---
to: "<%= addUseCases ? targetPath + '/modules/' + h.changeCase.param(moduleName) + '/application/use-cases/Get' + h.changeCase.pascal(name) + 'ById.ts' : null %>"
---
<% 
  const Name = h.changeCase.pascal(name)
  const VarName = h.changeCase.camel(name)
-%>
import { I<%= Name %>Repository } from '../../domain/I<%= Name %>Repository';
import { <%= Name %> } from '../../domain/<%= Name %>.entity';

export interface Get<%= Name %>ByIdRequest {
  id: string;
}

export class Get<%= Name %>ByIdUseCase {
  constructor(private readonly repository: I<%= Name %>Repository) {}

  async execute(request: Get<%= Name %>ByIdRequest): Promise<<%= Name %> | null> {
    const <%= VarName %> = await this.repository.findById(request.id);
    
    if (!<%= VarName %>) {
      throw new Error('<%= Name %> no encontrado');
    }

    return <%= VarName %>;
  }
}
