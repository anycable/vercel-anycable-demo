// Enum definition
export enum Status {
  ERROR = 0,
  SUCCESS = 1,
  FAILURE = 2,
}

// Message definitions
export type Env = {
  url: string;
  headers: Record<string, string>;
  cstate: Record<string, string>;
  istate: Record<string, string>;
};

export type EnvResponse = {
  cstate: Record<string, string>;
  istate: Record<string, string>;
};

export type ConnectionRequest = {
  env: Env;
};

export type ConnectionResponse = {
  status: Status;
  identifiers: string;
  transmissions: string[];
  error_msg: string;
  env: EnvResponse;
};

export type CommandMessage = {
  command: string;
  identifier: string;
  connection_identifiers: string;
  data: string;
  env: Env;
};

export type CommandResponse = {
  status: Status;
  disconnect: boolean;
  stop_streams: boolean;
  streams: string[];
  transmissions: string[];
  error_msg: string;
  env: EnvResponse;
  stopped_streams: string[];
};

export type DisconnectRequest = {
  identifiers: string;
  subscriptions: string[];
  env: Env;
};

export type DisconnectResponse = {
  status: Status;
  error_msg: string;
};

// gRPC Service definition
export interface RPC {
  Connect(request: ConnectionRequest): Promise<ConnectionResponse>;
  Command(request: CommandMessage): Promise<CommandResponse>;
  Disconnect(request: DisconnectRequest): Promise<DisconnectResponse>;
}
