---
to: "<%= addUseCases ? targetPath + '/modules/' + h.changeCase.param(moduleName) + '/application/use-cases/Delete' + h.changeCase.pascal(name) + '.ts' : null %>"
---
<% 
  const Name = h.changeCase.pascal(name)
  const VarName = h.changeCase.camel(name)
-%>
import { I<%= Name %>Repository } from '../../domain/I<%= Name %>Repository';

export interface Delete<%= Name %>Request {
  id: string;
}

export class Delete<%= Name %>UseCase {
  constructor(private readonly repository: I<%= Name %>Repository) {}

  async execute(request: Delete<%= Name %>Request): Promise<void> {
    const <%= VarName %> = await this.repository.findById(request.id);
    
    if (!<%= VarName %>) {
      throw new Error('<%= Name %> no encontrado');
    }

    await this.repository.delete(request.id);
  }
}
