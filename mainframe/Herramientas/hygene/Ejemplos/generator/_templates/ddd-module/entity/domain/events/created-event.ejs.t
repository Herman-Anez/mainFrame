---
to: <%= targetPath %>/modules/<%= h.changeCase.param(moduleName) %>/domain/events/<%= h.changeCase.pascal(name) %>CreatedDomainEvent.ts
---
<% 
  const Name = h.changeCase.pascal(name)
-%>
export class <%= Name %>CreatedDomainEvent {
  public readonly occurredOn: Date;
  
  constructor(
    public readonly aggregateId: string
  ) {
    this.occurredOn = new Date();
  }
}
