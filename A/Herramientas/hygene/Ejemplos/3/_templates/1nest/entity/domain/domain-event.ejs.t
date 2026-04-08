---
to: "<%= addEvents ? `test-src//modules/${h.changeCase.param(name)}/domain/events/${h.changeCase.kebabCase(name)}-created-event.ts` : null %>"
---
<% if(addEvents){ -%>
import { <%= IdName %> } from '../value-objects/<%= LIdName %>';
<% Name = h.changeCase.pascal(name) -%>
export class <%= Name %>CreatedEvent {
  public readonly occurredOn: Date;
  public readonly aggregateId: <%= IdName %>;

  constructor(aggregateId: <%= IdName %>) {
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
  }

  static eventName(): string {
    return '<%= h.changeCase.param(name) %>.created';
  }
}
<% } -%>