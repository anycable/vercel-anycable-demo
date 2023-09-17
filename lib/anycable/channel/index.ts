import { Env } from "../rpc";

interface ConnectionDelegate<I = {}> {
  get env(): Env;
  get identifiers(): I | null;
}

export type ChannelState = { [key: string]: any };

export class ChannelHandle<I, S extends ChannelState = {}, T = any> {
  readonly identifier: string;
  private delegate: ConnectionDelegate<I>;
  state: Partial<S> = {};

  rejected: boolean = false;
  transmissions: T[] = [];
  streams: string[] = [];
  stoppedStreams: string[] = [];
  stopStreams: boolean = false;

  constructor(
    delegate: ConnectionDelegate<I>,
    identifier: string,
    state: Partial<S>
  ) {
    this.delegate = delegate;
    this.identifier = identifier;
    this.state = state;
  }

  reject() {
    this.rejected = true;
    return this;
  }

  streamFrom(name: string) {
    this.streams.push(name);
    return this;
  }

  stopStreamFrom(name: string) {
    this.stoppedStreams.push(name);
    return this;
  }

  stopAllStreams() {
    this.stopStreams = true;
    return this;
  }

  transmit(data: T) {
    this.transmissions.push(data);
    return this;
  }

  get env(): Env {
    return this.delegate.env;
  }

  get identifiers(): I | null {
    return this.delegate.identifiers;
  }
}

export type ChannelParamsMap = { [token: string]: boolean | number | string };

export class Channel<
  IdentifiersType,
  ParamsType extends ChannelParamsMap = {},
  StateType extends ChannelState = {},
  TransmissionsType = any
> {
  async subscribed(
    handle: ChannelHandle<IdentifiersType, StateType, TransmissionsType>,
    params: ParamsType | null
  ): Promise<void> {}

  async unsubscribed(
    handle: ChannelHandle<IdentifiersType, StateType, TransmissionsType>,
    params: ParamsType | null
  ): Promise<void> {
    return;
  }

  async handleAction(
    handle: ChannelHandle<IdentifiersType, StateType, TransmissionsType>,
    params: ParamsType | null,
    action: string,
    payload: any
  ) {
    // TODO: figure out how to avoid this cast and make channel actions type-safe
    const self = this as any;
    await self[action](handle, params, payload);
  }
}
