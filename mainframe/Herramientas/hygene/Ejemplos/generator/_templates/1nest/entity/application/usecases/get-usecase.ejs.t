---
to: test-src/modules/<%= h.changeCase.param(name) %>/application/usecases/get-<%= h.changeCase.kebabCase(name) %>.usecase.ts
---
<% 
Name = h.changeCase.pascal(name) 
Lname = h.changeCase.camel(name)
kname = h.changeCase.kebabCase(name)
-%>
import { <%= Name %>, I<%= Name %>Repository } from '../../domain/<%= kname %>.entity';

<% if(addBoilerplate){ -%> @Injectable()<% } -%> 
export class Get<%= Name %>UseCase {
  constructor(<% if(addBoilerplate){ -%> @Inject('I<%= Name %>Repository')<% } -%> private repository: I<%= Name %>Repository) {}

  async execute() : Promise< <%= Name %>[]> {
    return this.repository.findAll();
  }
}




