---
to: "<%= addVO ? `test-src//modules/${h.changeCase.param(name)}/domain/value-objects/${h.changeCase.camel(name)}-vos.ts` : null %>"
---
<% 
Name = h.changeCase.pascal(name)+"IdVo" 
-%>
import { DomainException } from '../../../shared/domain/domain-exception';

export class <%= Name %>{
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): <%= Name %> {
    if (!value || value.length < 3) {
      throw new DomainException('Invalid <%= Name %>: ${value}');
    }
    return new <%= Name %>(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: <%= Name %>): boolean {
    return this.value === other.getValue();
  }
}
<% const list = typeof voList === 'string' ? voList.split(',').map(v => v.trim()) : (voList || []); -%>
<% if(addVO){ -%>
<% list.forEach(vo => { -%>
<% 
  EntityName = h.changeCase.pascal(name)
  VoName = h.changeCase.pascal(vo)
  VoClassName = addVO ? Name + h.changeCase.pascal(vo) : null
  LVoClassName = addVO ? kname +"-"+h.changeCase.kebabCase(vo) : null
  VoHolder = addVO ? h.changeCase.camel(vo) : null
-%>
export class <%= EntityName %><%= VoName %> {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): <%= EntityName %><%= VoName %> {
    if (!value || value.length < 3) {
      throw new DomainException(`Invalid <%= VoName %>: ${value}`);
    }
    return new <%= EntityName %><%= VoName %>(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: <%= EntityName %><%= VoName %>): boolean {
    return this.value === other.getValue();
  }
}
<% }) -%>
<% } -%>