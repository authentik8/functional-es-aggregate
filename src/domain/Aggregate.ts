import uuid from 'uuid';

import {
  IAggregateDefinition,
  ICommand,
  IEvent,
  IPublishable,
  IRejectable,
  IVersionedEntity
} from '../interfaces';

import VersionedEntity from './VersionedEntity';

class Aggregate<T> {
  private definition: IAggregateDefinition<T>;

  constructor(definition: IAggregateDefinition<T>) {
    this.definition = definition;

    this.rehydrate = this.rehydrate.bind(this);
    this.applyCommand = this.applyCommand.bind(this);
    this.applyEvent = this.applyEvent.bind(this);
  }

  public rehydrate(
    events: IEvent[],
    snapshot?: IVersionedEntity<T>
  ): IVersionedEntity<T> {
    return events.reduce(this.applyEvent, snapshot || this.initialEntity);
  }

  public applyCommand(
    entity: IVersionedEntity<T> & IPublishable,
    command: ICommand & IRejectable
  ): void {
    const { name } = command;
    const handler = this.definition.commands[name];
    return handler && handler(entity, command);
  }

  private applyEvent(
    entity: IVersionedEntity<T>,
    event: IEvent
  ): IVersionedEntity<T> {
    const { name } = event;
    const applyEvent = this.definition.eventHandlers[name];
    return applyEvent ? entity.update(applyEvent(entity.state, event)) : entity;
  }

  private get initialEntity(): IVersionedEntity<T> {
    const nextId = this.definition.getNextId || uuid.v4;

    return new VersionedEntity({
      id: nextId(),
      name: this.definition.name,
      state: this.definition.initialState,
      version: 0
    });
  }
}

export default Aggregate;
