---
to: test-src/modules/<%= h.changeCase.param(name) %>/application/usecases/delete-<%= h.changeCase.kebabCase(name) %>.usecase.ts
---
<% 
Name = h.changeCase.pascal(name) 
Lname = h.changeCase.camel(name)
kname = h.changeCase.kebabCase(name)
-%>
import { Injectable } from '@nestjs/common';
import { I<%= Name %>Repository } from '../../domain/<%= kname %>.entity';
import { <%= IdName %> } from '../../domain/value-objects/<%= LIdName %>';


@Injectable()
export class Delete<%= Name %>UseCase {
  constructor(private readonly repo: I<%= Name %>Repository) {}

  async execute(id:  <%= IdName %> ) {
    return this.repo.delete(id);
  }
}
