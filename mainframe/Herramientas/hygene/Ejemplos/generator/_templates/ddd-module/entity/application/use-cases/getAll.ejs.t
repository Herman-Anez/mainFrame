---
to: "<%= addUseCases ? targetPath + '/modules/' + h.changeCase.param(moduleName) + '/application/use-cases/GetAll' + h.changeCase.pascal(name) + 's.ts' : null %>"
---
<% 
  const Name = h.changeCase.pascal(name)
-%>
import { I<%= Name %>Repository } from '../../domain/I<%= Name %>Repository';
import { <%= Name %> } from '../../domain/<%= Name %>.entity';

export class GetAll<%= Name %>sUseCase {
  constructor(private readonly repository: I<%= Name %>Repository) {}

  async execute(): Promise<<%= Name %>[]> {
    return await this.repository.findAll();
  }
}
