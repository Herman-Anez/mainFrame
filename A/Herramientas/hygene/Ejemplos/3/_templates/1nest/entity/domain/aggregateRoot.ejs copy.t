---
to: test-src/shared/domain/domain-exception.ts
---
<% Name = h.changeCase.pascal(name) -%>
export class DomainException extends Error {
  constructor(public readonly message: string) {
    super(message);
    this.name = 'DomainException';
  }
}