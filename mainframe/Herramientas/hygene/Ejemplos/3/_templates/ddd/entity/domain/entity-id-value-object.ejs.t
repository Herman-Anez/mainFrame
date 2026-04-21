---
to: test-src/modules/<%= h.changeCase.param(name) %>/domain/value-objects/<%= h.changeCase.pascal(name) %>IdVo.ts
---
<% 
Name = h.changeCase.pascal(name)+"IdVo" 
-%>
export class <%= Name %>{
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): <%= Name %> {
    if (!value || value.length < 3) {
      throw new Error(`Invalid <%= Name %>: ${value}`);
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