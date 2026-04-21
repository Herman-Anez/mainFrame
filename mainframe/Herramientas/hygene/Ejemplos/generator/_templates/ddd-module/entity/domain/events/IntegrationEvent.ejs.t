---
to: "<%= targetPath %>/modules/<%= h.changeCase.param(moduleName) %>/domain/events/<%= h.changeCase.pascal(name) %>CreatedIntegrationEvent.ts"
---
<% 
  const Name = h.changeCase.pascal(name)
-%>
import { v4 as uuidv4 } from 'uuid';

export interface <%= Name %>CreatedIntegrationEventPayload {
  <%= h.changeCase.camel(name) %>Id: string;
  // Añade aquí campos adicionales requeridos por otros Bounded Contexts
}

export class <%= Name %>CreatedIntegrationEvent {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly occurredOn: string;
  public readonly correlationId: string | null;
  public readonly data: <%= Name %>CreatedIntegrationEventPayload;

  constructor(
    payload: <%= Name %>CreatedIntegrationEventPayload,
    correlationId: string | null = null
  ) {
    this.eventId = uuidv4();
    this.eventType = '<%= Name %>CreatedIntegrationEvent';
    this.occurredOn = new Date().toISOString();
    this.correlationId = correlationId;
    this.data = payload;
  }
}
