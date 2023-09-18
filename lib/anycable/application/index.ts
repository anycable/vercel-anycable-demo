import { Channel, ChannelHandle } from "../channel";
import { Env, EnvResponse } from "../rpc";

export type IdentifiersMap = { [id: string]: any };

export class ConnectionHandle<IdentifiersType extends IdentifiersMap = {}> {
  readonly id: string | null;

  rejected: boolean = false;
  closed: boolean = false;
  transmissions: string[];
  streams: string[] = [];
  stoppedStreams: string[] = [];
  stopStreams: boolean = false;
  env: Env;
  identifiers: IdentifiersType | null = null;

  constructor(id: string | null, env: Env) {
    this.id = id;
    this.env = env;
    this.transmissions = [];
  }

  reject() {
    this.rejected = true;
    return this;
  }

  transmit(data: any) {
    if (typeof data !== "string") {
      data = JSON.stringify(data);
    }

    this.transmissions.push(data);
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

  close() {
    this.closed = true;
    return this;
  }

  identifiedBy(identifiers: IdentifiersType) {
    this.identifiers = identifiers;
    return this;
  }

  buildChannelHandle(identifier: string): ChannelHandle<IdentifiersType> {
    const rawState = this.env.istate ? this.env.istate[identifier] : null;

    let istate = null;

    if (rawState) {
      istate = JSON.parse(rawState);
    }

    return new ChannelHandle(this, identifier, istate);
  }

  mergeChannelHandle(handle: ChannelHandle<IdentifiersType>) {
    if (handle.rejected) {
      this.reject();
    }

    for (const transmission of handle.transmissions) {
      this.transmit({ identifier: handle.identifier, message: transmission });
    }

    if (handle.state) {
      this.env.istate = this.env.istate || {};
      this.env.istate[handle.identifier] = JSON.stringify(handle.state);
    }

    this.streams = this.streams.concat(handle.streams);
    this.stoppedStreams = this.stoppedStreams.concat(handle.stoppedStreams);
    this.stopStreams = this.stopStreams || handle.stopStreams;

    return this;
  }

  get envChanges(): EnvResponse {
    return {
      cstate: this.env.cstate,
      istate: this.env.istate,
    };
  }
}

export class Application<IdentifiersType extends IdentifiersMap = {}> {
  private channels: Record<string, Channel<IdentifiersType>> = {};

  constructor() {
    this.channels = {};
  }

  registerChannel(channelName: string, channelClass: Channel<IdentifiersType>) {
    this.channels[channelName] = channelClass;
  }

  buildHandle(id: string | null, env: Env): ConnectionHandle<IdentifiersType> {
    return new ConnectionHandle(id, env);
  }

  async handleOpen(handle: ConnectionHandle<IdentifiersType>) {
    await this.connect(handle);

    if (handle.rejected) {
      handle.transmit({ type: "disconnect", reason: "unauthorized" });
    } else {
      handle.transmit({ type: "welcome", sid: handle.id });
    }
  }

  async connect(handle: ConnectionHandle<IdentifiersType>) {
    // Override this method in your application class to perform authentication
    // and set up connection identifiers
  }

  async handleCommand(
    handle: ConnectionHandle<IdentifiersType>,
    command: string,
    identifier: string,
    data: string | null,
  ) {
    const { channel, params } = this.findChannel(identifier);

    const channelHandle = handle.buildChannelHandle(identifier);

    if (command === "subscribe") {
      await channel.subscribed(channelHandle, params);
      if (channelHandle.rejected) {
        handle.transmit({ identifier, type: "reject_subscription" });
      } else {
        handle.transmit({ identifier, type: "confirm_subscription" });
      }
    } else if (command === "unsubscribe") {
      await channel.unsubscribed(channelHandle, params);
    } else if (command === "message") {
      const { action, ...payload } = JSON.parse(data!);
      await channel.handleAction(channelHandle, params, action, payload);
    } else {
      throw new Error(`Unknown command: ${command}`);
    }

    handle.mergeChannelHandle(channelHandle);
  }

  async handleClose(
    handle: ConnectionHandle<IdentifiersType>,
    subscriptions: string[] | null,
  ) {
    if (subscriptions) {
      for (const identifier of subscriptions) {
        const { channel, params } = this.findChannel(identifier);

        const channelHandle = handle.buildChannelHandle(identifier);

        await channel.unsubscribed(channelHandle, params);
      }
    }

    await this.disconnect(handle);
  }

  async disconnect(handle: ConnectionHandle<IdentifiersType>) {
    // Override this method in your application class to perform cleanup on disconnect
  }

  encodeIdentifiers(identifiers: IdentifiersType): string {
    return JSON.stringify(identifiers);
  }

  decodeIdentifiers(identifiers: string): IdentifiersType {
    return JSON.parse(identifiers);
  }

  // Identifier is a JSON string with the channel name and params
  findChannel(identifier: string): {
    channel: Channel<IdentifiersType>;
    params: any;
  } {
    const { channel, ...params } = JSON.parse(identifier);

    const channelInstance = this.channels[channel];

    if (!channelInstance) {
      throw new Error(`Channel ${channel} is not registered`);
    }

    return { channel: channelInstance, params };
  }
}
