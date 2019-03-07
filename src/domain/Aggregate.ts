import uuid from 'uuid';

import { IRejectableCommand } from './Command';
import { IEvent } from './Event';

import { IPublishableEntity, IVersionedEntity, makeEntity } from './Entity';

interface IEventHandlerMap<T> {
  [s: string]: (state: T, event: IEvent) => T;
}

interface ICommandHandlerMap<T> {
  [s: string]: (
    entity: IPublishableEntity<T>,
    command: IRejectableCommand
  ) => void;
}

export interface IAggregateDefinition<T> {
  name: string;

  initialState: T;

  getNextId?: () => string;

  eventHandlers: IEventHandlerMap<T>;

  commands: ICommandHandlerMap<T>;
}

export interface IAggregate<T> {
  readonly name: string;
  rehydrate: (
    events: IEvent[],
    snapshot?: IVersionedEntity<T>
  ) => IVersionedEntity<T>;
  applyCommand: (
    entity: IPublishableEntity<T>,
    command: IRejectableCommand
  ) => void;
}

export function createAggregate<T>(
  definition: IAggregateDefinition<T>
): IAggregate<T> {
  const {
    name: aggregateName,
    commands,
    eventHandlers,
    getNextId = uuid.v4,
    initialState
  } = definition;

  const applyEvent = (entity: IVersionedEntity<T>, event: IEvent) => {
    const { name } = event;
    const updatedState =
      eventHandlers[name] && eventHandlers[name](entity.state, event);

    return entity.update(updatedState);
  };

  const initialEntity = makeEntity({
    id: getNextId(),
    name: aggregateName,
    state: initialState,
    version: 0
  });

  const rehydrate = (events: IEvent[], snapshot?: IVersionedEntity<T>) =>
    events.reduce(applyEvent, snapshot || initialEntity);

  const applyCommand = (
    entity: IPublishableEntity<T>,
    command: IRejectableCommand
  ) => {
    const { name } = command;
    return commands[name] && commands[name](entity, command);
  };

  return {
    applyCommand,
    rehydrate,
    name: aggregateName
  };
}
