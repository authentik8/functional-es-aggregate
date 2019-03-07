export interface ICommandMetadata {
  timestamp?: number;
  correlationId?: string;
}

export interface IEventMetadata {
  timestamp?: number;
  correlationId?: string;
}

export interface ICommand {
  // Aggregate that this command should be applied to
  aggregate: {
    // Identifier of the aggregate, or `null` if this is for a new instance
    id: string | null;

    // Name of the aggregate
    name: string;
  };

  // Unique identifier for this command
  id: string;

  // Name of the relevant aggregate's command
  name: string;

  // Paramters associated with this command
  payload: any;

  // Identifying data for the User initiating the command
  user?: object;

  // Metadata about this command
  metadata?: ICommandMetadata;
}

export interface IEvent {
  // Aggregate that published this event
  aggregate: {
    id: string;

    name: string;
  };

  // Name of this event
  name: string;

  // Data associated with this event
  payload: any;
}

export interface IEventWithMetadata extends IEvent {
  // Unique identifier for this event
  id: string;

  // Metadata about this event
  metadata: IEventMetadata;
}

export interface IVersionedEntity<T> {
  readonly id: string;
  readonly name: string;
  readonly version: number;
  readonly state: T;

  update(state: T): IVersionedEntity<T>;
}

export interface IPublishable {
  publish: (name: string, payload?: object) => void;
}

export interface IRejectable {
  reject: (reason: string) => void;
}

export interface IEventHandlerMap<T> {
  [s: string]: (state: T, event: IEvent) => T;
}

export interface ICommandHandlerMap<T> {
  [s: string]: (
    entity: IVersionedEntity<T> & IPublishable,
    command: ICommand & IRejectable
  ) => void;
}

export interface IAggregateDefinition<T> {
  name: string;

  initialState: T;

  getNextId?: () => string;

  eventHandlers: IEventHandlerMap<T>;

  commands: ICommandHandlerMap<T>;
}
