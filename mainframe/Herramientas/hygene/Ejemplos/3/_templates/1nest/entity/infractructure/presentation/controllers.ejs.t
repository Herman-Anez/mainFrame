---
to: test-src/modules/<%= h.changeCase.param(name) %>/infrastructure/presentation/<%= h.changeCase.kebabCase(name) %>.controller.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const Lname = h.changeCase.camel(name)
  kname = h.changeCase.kebabCase(name)
  const IdName = Name + 'IdVo' 
  const Plural = h.changeCase.camel(plural)
-%>
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { <%= Name %>UseCases } from '../../application/<%= kname %>.usecase-funnel';
import { Create<%= Name %>Dto, Update<%= Name %>Dto } from '../../application/dtos/<%= kname %>.dto';


@Controller('<%= Lname %>')
export class <%= Name %>Controller {
  constructor(private readonly <%= Lname %>Service: <%= Name %>UseCases) {}

  @Post()
  create(@Body() create<%= Name %>Dto: Create<%= Name %>Dto) {
    return this.<%= Lname %>Service.create(create<%= Name %>Dto);
  }

  @Get()
  findAll() {
    return this.<%= Lname %>Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.<%= Lname %>Service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update<%= Name %>Dto: Update<%= Name %>Dto) {
    return this.<%= Lname %>Service.update(id, update<%= Name %>Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.<%= Lname %>Service.remove(id);
  }
}
