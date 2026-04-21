---
to: "<%= addEvents ? `src/modules/${h.changeCase.param(name)}/domain/events/${h.changeCase.pascal(name)}CreatedEvent.ts` : null %>"
---
<% if(addEvents){ -%>
<% Name = h.changeCase.pascal(name) -%>
export class <%= Name %>CreatedEvent {
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
  }

  static eventName(): string {
    return '<%= h.changeCase.param(name) %>.created';
  }
}
<% } -%>