interface ICommandMetadata {
  timestamp?: number;
  correlationId?: string;
  [others: string]: any;
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

export interface IRejectableCommand extends ICommand {
  reject: (reason: string) => void;
}
