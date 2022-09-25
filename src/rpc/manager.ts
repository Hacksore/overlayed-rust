import { getSelectedChannel, RPCCommand } from "./command";
import { RPCEvent, voiceChannelSelect } from "./event";
import * as uuid from "uuid";
import { listen as tauriListen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";
import { EventEmitter } from "events";

/**
 * Collection of events that are needed to sub to for voice states
 */
const SUBSCRIBABLE_EVENTS = [
  RPCEvent.SPEAKING_START,
  RPCEvent.SPEAKING_STOP,
  RPCEvent.VOICE_STATE_CREATE,
  RPCEvent.VOICE_STATE_DELETE,
  RPCEvent.VOICE_STATE_DELETE,
];

/**
 * A generic manager for react -> tauri -> discord IPC
 */
class IPCManager extends EventEmitter { // TODO: do i want an event listener here?

  public currentChannelId = null;

  constructor() {
    super();
    console.log("Created the IPCManager instance");

    // init the listener
    this.init();

    // always sub to voice channel change event
    this.send(voiceChannelSelect());
    this.send(getSelectedChannel());
  }

  /**
   * Setup the tauri IPC socket
   */
  async init() {
    await tauriListen("message", this.onMessage.bind(this));
  }

  /**
   * Message listener when we get message from discord
   * @param payload a JSON object of the parsed message
   */
  private onMessage(event: any) {
    const payload = JSON.parse(event.payload);
    console.log("debug", payload);

    if (payload.cmd === RPCCommand.GET_SELECTED_VOICE_CHANNEL) {
      this.currentChannelId = null;

      // sub to channels events
      this.channelEvents(RPCCommand.SUBSCRIBE, payload.data.id);
    }

    // setTimeout(() => this.emit("message", payload), 10);
  }

  private send(payload: any) {
    invoke("send_to_discord", {
      payload: JSON.stringify({
        ...payload,
        nonce: uuid.v4(),
      }),
    });
  }

  /**
   * These method will allow you to sub/unsub to channel events 
   * that are defined in SUBSCRIBABLE_EVENTS
   * @param cmd {RPCCommand} SUBSCRIBE or SUBSCRIBE
   * @param channelId The channel to subscribe to events in
   */
  channelEvents(cmd: RPCCommand.SUBSCRIBE | RPCCommand.UNSUBSCRIBE ,channelId: String) {
    SUBSCRIBABLE_EVENTS.map((eventName) =>
      this.send({
        cmd,
        args: { channel_id: channelId },
        evt: eventName,
        nonce: uuid.v4(),
      })
    );
  }
}

export default new IPCManager();
