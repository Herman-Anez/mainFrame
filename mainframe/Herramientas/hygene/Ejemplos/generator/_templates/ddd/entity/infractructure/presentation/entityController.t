---
to: test-src/modules/<%= h.changeCase.param(name) %>/infrastructure/presentation/controllers/<%= h.changeCase.pascal(name) %>.InMemory<%= h.changeCase.pascal(name) %>controller.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const Lname = h.changeCase.camel(name)
  const IdName = Name + 'IdVo' 
  const Plural = h.changeCase.camel(plural)
  const VoClassName = addVO ? Name + h.changeCase.pascal(voName) : null
  const VoHolder = addVO ? h.changeCase.camel(voName) : null
-%>
import { , I<%= Name %>Repository  } from '../../domain/<%= Name %>.entity';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { <%= Name %>Service } from '../aplication/<%= Name %>.service';
import { Crear<%= Name %>DTO } from './dto/create<%= Name %>.dto';
import { Update<%= Name %>Dto } from './dto/update<%= Name %>.dto';

@Controller('<%= Lname %>')
export class <%= Name %>Controller {
  constructor(private readonly saborService: <%= Name %>Service) {}

  @Post()
  create(@Body() create<%= Name %>Dto: Crear<%= Name %>DTO) {
    return this.saborService.create(create<%= Name %>Dto);
  }

  @Get()
  findAll() {
    return this.saborService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saborService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() update<%= Name %>Dto: Update<%= Name %>Dto) {
    return this.saborService.update(+id, update<%= Name %>Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saborService.remove(+id);
  }
}
