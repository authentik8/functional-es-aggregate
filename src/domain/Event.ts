interface IEventMetadata {
  timestamp?: number;
  correlationId?: string;
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
