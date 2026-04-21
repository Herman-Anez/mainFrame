---
to: test-src/modules/<%= h.changeCase.param(name) %>/application/usecases/update-<%= h.changeCase.kebabCase(name) %>.usecase.spec.ts
---
<% 
Name = h.changeCase.pascal(name) 
Lname = h.changeCase.camel(name)
kname = h.changeCase.kebabCase(name)
-%>
import { Injectable } from '@nestjs/common';
import { I<%= Name %>Repository } from '../../domain/<%= kname %>.entity';
import { <%= IdName %> } from '../../domain/value-objects/<%= LIdName %>';
import { DomainException } from '../../../shared/domain/domain-exception';

@Injectable()
export class Update<%= Name %>UseCase {
  constructor(<% if(addBoilerplate){ -%> @Inject('I<%= Name %>Repository')<% } -%> private repository: I<%= Name %>Repository) {}

  async execute(id: <%= Name %>IdVo, data: any): Promise<void> {
    const <%= Lname %>I = await this.repository.findById(id);
    if (!<%= Lname %>I) throw new DomainException('Product not found');
    /*update Sabor atributes*/
    return this.repository.save(<%= Lname %>I);
  }
}
