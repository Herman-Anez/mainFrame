---
to: test-src/modules/<%= h.changeCase.param(name) %>/application/<%= h.changeCase.kebabCase(name) %>.usecase-funnel.ts
---
<% 
Name = h.changeCase.pascal(name) 
Lname = h.changeCase.camel(name)
-%>
import { Injectable } from '@nestjs/common';
import { Create<%= Name %>UseCase } from './usecases/create-<%= Lname %>.usecase';
import { Get<%= Name %>UseCase } from './usecases/get-<%= Lname %>.usecase';
import { Update<%= Name %>UseCase } from './usecases/update-<%= Lname %>.usecase';
import { Delete<%= Name %>UseCase } from './usecases/delete-<%= Lname %>.usecase';
import { Create<%= Name %>Dto, Update<%= Name %>Dto } from './dtos/<%= Lname %>.dto';

@Injectable()
export class <%= Name %>UseCases {
  constructor(
    private readonly createUseCase: Create<%= Name %>UseCase,
    private readonly getUseCase: Get<%= Name %>UseCase,
    private readonly updateUseCase: Update<%= Name %>UseCase,
    private readonly deleteUseCase: Delete<%= Name %>UseCase,
  ) {}

  async create(dto: Create<%= Name %>Dto) {
    return await this.createUseCase.execute(dto);
  }

  async findAll() {
    return await this.getUseCase.execute();
  }

  async update(id: string, dto: Update<%= Name %>Dto) {
    return await this.updateUseCase.execute(id, dto);
  }

  async remove(id: string) {
    return await this.deleteUseCase.execute(id);
  }
}