---
to: "<%= addVO ? `src/modules/${h.changeCase.param(name)}/domain/value-objects/${h.changeCase.pascal(name)}${h.changeCase.pascal(voName)}.ts` : null %>"
---
<% if(addVO){ -%>
<% 
  EntityName = h.changeCase.pascal(name)
  VoName = h.changeCase.pascal(voName)
-%>
export class <%= EntityName %><%= VoName %> {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): <%= EntityName %><%= VoName %> {
    if (!value || value.length < 3) {
      throw new Error(`Invalid <%= VoName %>: ${value}`);
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
<% } -%>