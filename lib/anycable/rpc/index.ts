// Enum definition
export enum Status {
  ERROR = 0,
  SUCCESS = 1,
  FAILURE = 2,
}

// Message definitions
export type Env = {
  url: string;
  headers: Record<string, string> | null;
  cstate: Record<string, string> | null;
  istate: Record<string, string> | null;
};

export type EnvResponse = {
  cstate: Record<string, string> | null;
  istate: Record<string, string> | null;
};

export type ConnectionRequest = {
  env: Env;
};

export type ConnectionResponse = {
  status: Status;
  identifiers: string | null;
  transmissions: string[] | null;
  error_msg: string | null;
  env: EnvResponse;
};

export type CommandMessage = {
  command: string;
  identifier: string;
  connection_identifiers: string;
  data: string | null;
  env: Env;
};

export type CommandResponse = {
  status: Status;
  disconnect: boolean;
  stop_streams: boolean;
  streams: string[] | null;
  transmissions: string[] | null;
  error_msg: string | null;
  env: EnvResponse;
  stopped_streams: string[] | null;
};

export type DisconnectRequest = {
  identifiers: string;
  subscriptions: string[];
  env: Env;
};

export type DisconnectResponse = {
  status: Status;
  error_msg: string | null;
};
