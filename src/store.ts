import create from "zustand";
import { devtools } from "zustand/middleware";
import { IChannelJoinEvent, IDiscordUser, IUser } from "./types/user";
import produce from "immer";

// TODO: move this?
const createUserStateItem = (payload: IDiscordUser) => {
  const data = {
    username: payload.nick,
    avatarHash: payload.user.avatar,
    muted: payload.mute,
    deafened: payload.voice_state.deaf, // Probably only bots can deafen themselves
    selfDeafened: payload.voice_state.self_deaf,
    selfMuted: payload.voice_state.self_mute,
    suppress: payload.voice_state.suppress,
    talking: false,
    id: payload.user.id,
    volume: payload.volume,
    bot: payload.user.bot,
    flags: payload.user.flags,
    premium: payload.user.premium_type,
    discriminator: payload.user.discriminator,
    lastUpdate: 0,
  };

  return data;
};

interface AppState {
  // TODO: type
  currentChannel: any,
  users: Record<string, IUser>;
  setTalking: FSetTalkingParams;
  setUsers: FSetUsers;
  removeUser: (id: string) => void;
  setCurrentChannel: (channel: any) => void;
}

type FSetTalkingParams = (id: string, voiceState: boolean) => void;
type FSetUsers = (users: IChannelJoinEvent) => void;

// @ts-ignore
const immer = (config) => (set, get) => config((fn) => set(produce(fn)), get);

const store = (set: any) => ({
  users: {},
  currentChannel: null,
  setTalking: (id: string, talking: boolean) =>
    set((state: AppState) => {
      state.users[id].talking = talking;
    }),
  removeUser: (id: string) =>
    set((state: AppState) => {
      console.log("removing user", id)
      delete state.users[id];
    }),
  setUsers: (users: any) =>
    set((state: AppState) => {
      for (const item of users.voice_states) {
        state.users[item.user.id] = createUserStateItem(item);
      }
    }),
  setCurrentChannel: (channelData: any) =>
    set((state: AppState) => {
      state.currentChannel = channelData;
    }),
});

export const useAppStore = create<AppState>(immer(store));