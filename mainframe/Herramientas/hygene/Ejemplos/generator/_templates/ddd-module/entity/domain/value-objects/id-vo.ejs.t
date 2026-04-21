---
to: <%= targetPath %>/modules/<%= h.changeCase.param(moduleName) %>/domain/value-objects/<%= h.changeCase.pascal(name) %>Id.ts
---
<% 
  const Name = h.changeCase.pascal(name)
  const IdName = Name + 'Id' 
-%>
import { ValueObject } from '../../../../shared/domain/ValueObject';

export class <%= IdName %> extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(value: string): <%= IdName %> {
    return new <%= IdName %>(value);
  }

  get value(): string {
    return this.props.value;
  }
}
