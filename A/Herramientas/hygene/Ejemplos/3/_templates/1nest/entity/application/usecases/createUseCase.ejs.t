---
to: test-src/modules/<%= h.changeCase.param(name) %>/application/usecases/create-<%= h.changeCase.kebabCase(name) %>.usecase.ts
---
<% 
Name = h.changeCase.pascal(name) 
Lname = h.changeCase.camel(name)
kname = h.changeCase.kebabCase(name)
IdName = Name + 'IdVo'
LIdName = kname + '-vos'  
-%>
import { <%= Name %>, <%= Name %>Props, I<%= Name %>Repository } from '../../domain/<%= kname %>.entity';
import { Create<%= Name %>Dto } from '../dtos/<%= kname %>.dto';
import { <%= IdName %> } from '../../domain/value-objects/<%= LIdName %>';
<% if(addBoilerplate){ -%> @Injectable()<% } -%> 
export class Create<%= Name %>UseCase {

  constructor(<% if(addBoilerplate){ -%> @Inject('I<%= Name %>Repository')<% } -%> private readonly repository: I<%= Name %>Repository) {}

  async execute(create<%= Lname %>Dto: Create<%= Name %>Dto): Promise<void> {
    const <%= Lname %>props :<%= Name %>Props= {
      /*apply props*/
    }
    const <%= Lname %> = <%= Name %>.create(<%= Lname %>props,new uuid(<%= IdName %>));
    return this.repository.save(<%= Lname %>);
  }
}