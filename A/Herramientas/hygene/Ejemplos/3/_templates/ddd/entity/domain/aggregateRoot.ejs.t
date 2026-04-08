---
to: test-src/shared/domain/aggregateRoot.ts
---
<% Name = h.changeCase.pascal(name) -%>
export abstract class AggregateRoot<T> {
  protected readonly _id: string; // O el tipo de ID que prefieras
  public readonly props: T;
  private _domainEvents: any[] = [];

  constructor(props: T, id: string) {
    this._id = id;
    this.props = props;
  }

  get id(): string {
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