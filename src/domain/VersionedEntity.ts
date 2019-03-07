interface IParams<T> {
  id: string;
  name: string;
  version: number;
  state: T;
}

class VersionedEntity<T> {
  public readonly id: string;
  public readonly name: string;
  public readonly version: number;
  public readonly state: T;

  constructor({ id, name, version, state }: IParams<T>) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.state = state;
  }

  public update(state: T): VersionedEntity<T> {
    return new VersionedEntity({
      state,
      id: this.id,
      name: this.name,
      version: this.version + 1
    });
  }
}

export default VersionedEntity;
