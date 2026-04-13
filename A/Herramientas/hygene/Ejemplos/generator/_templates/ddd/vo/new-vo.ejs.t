---
to: test-src/modules/<%= h.changeCase.param(name) %>/domain/value-objects/<%= h.changeCase.pascal(name) %><%= h.changeCase.pascal(voName) %>.ts
---
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
    // Ejemplo de validación genérica
    if (!value || value.length < 2) {
      throw new Error(`Invalid <%= VoName %>: ${value}`);
    }
    return new <%= EntityName %><%= VoName %>(value);
  }

  public getValue(): string {
    return this.value;
  }
}