export interface IVersionedEntity<T> {
  readonly id: string;
  readonly name: string;
  readonly version: number;
  readonly state: T;
  update: (newState: T) => IVersionedEntity<T>;
  [others: string]: any;
}

export interface IPublishableEntity<T> extends IVersionedEntity<T> {
  publish: (name: string, data?: object) => void;
}

interface IParams<T> {
  id: string;
  name: string;
  version: number;
  state: T;
}

export function makeEntity<T>({
  id,
  name,
  state,
  version
}: IParams<T>): IVersionedEntity<T> {
  const update = (newState: T) =>
    makeEntity({
      id,
      name,
      state: newState,
      version: version + 1
    });

  return {
    id,
    name,
    state,
    update,
    version
  };
}
