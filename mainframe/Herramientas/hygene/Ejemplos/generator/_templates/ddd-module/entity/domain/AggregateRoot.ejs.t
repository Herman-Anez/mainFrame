---
to: <%= targetPath %>/shared/domain/AggregateRoot.ts
---
export abstract class AggregateRoot<T> {
  protected readonly _id: string;
  public readonly props: T;
  private _domainEvents: any[] = [];
  private _correlationId: string | null = null;

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

  public setCorrelationId(id: string): void {
    this._correlationId = id;
  }

  get correlationId(): string | null {
    return this._correlationId;
  }

  protected record(event: any): void {
    // Si el evento soporta correlationId y nosotros tenemos uno, lo asignamos
    if (this._correlationId && typeof event === 'object') {
      event.correlationId = this._correlationId;
    }
    this._domainEvents.push(event);
  }

  public pullDomainEvents(): any[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
