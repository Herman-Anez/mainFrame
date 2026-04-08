---
to: test-src/shared/domain/aggregateRoot.ts
---
<% Name = h.changeCase.pascal(name) -%>
import { DomainException } from '../../../shared/domain/domain-exception';

export abstract class AggregateRoot<T, ID = string> {
  protected readonly _id: ID;
  public readonly props: T;
  private _domainEvents: any[] = [];

  constructor(props: T) {
    this.props = props;
  }

  get id(): ID {
    return this._id;
  }

  get domainEvents(): any[] {
    return this._domainEvents;
  }

  protected record(event: any): void {
    this._domainEvents.push(event);
    console.log(`[Domain Event Recorded]: ${event.constructor.name}`);
  }

  public pullDomainEvents(): any[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}