---
to: test-src/modules/<%= h.changeCase.param(name) %>/application/<%= h.changeCase.pascal(name) %>.useCaseFunnel.ts
---
<% Name = h.changeCase.pascal(name) -%>
import { Injectable } from '@nestjs/common';
import { Create<%= Name %>UseCase } from './Create<%= Name %>.useCase';
import { Get<%= Name %>UseCase } from './Get<%= Name %>.useCase';
import { Update<%= Name %>UseCase } from './Update<%= Name %>.useCase';
import { Delete<%= Name %>UseCase } from './Delete<%= Name %>.useCase';

@Injectable()
export class <%= Name %>UseCases {
  constructor(
    private readonly createUseCase: Create<%= Name %>UseCase,
    private readonly getUseCase: Get<%= Name %>UseCase,
    private readonly updateUseCase: Update<%= Name %>UseCase,
    private readonly deleteUseCase: Delete<%= Name %>UseCase,
  ) {}

  async create(dto: any) {
    return await this.createUseCase.execute(dto);
  }

  async findAll() {
    return await this.getUseCase.execute();
  }

  async update(id: string, data: any) {
    return await this.updateUseCase.execute(id, data);
  }

  async remove(id: string) {
    return await this.deleteUseCase.execute(id);
  }
}