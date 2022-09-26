import create from "zustand";
import { devtools } from "zustand/middleware";
import { IChannelJoinEvent, IDiscordUser, IUser } from "./types/user";

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
  users: Record<string, IUser>;
  setTalking: FSetTalkingParams;
  setUsers: FSetUsers;
}

type FSetTalkingParams = (id: string, voiceState: boolean) => void;
type FSetUsers = (users: IChannelJoinEvent) => void;

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    users: {},
    setTalking: (id, voiceState) =>
      set((state) => {
        // toggle state

        const clonedState = {...state.users}
        console.log(id, voiceState, clonedState)
        clonedState[id].talking = voiceState;

        // is this expensive?????
        return state;
      }),
    setUsers: (event) =>
      set((state) => {
        // empty obj
        const newUsers: Record<string, IUser> = {};

        // create new user object with changed names
        const usersArray = event.voice_states.map((user) => createUserStateItem(user));

        // iterate over the users and create entry
        for (const user of usersArray) {
          newUsers[`${user.id}`] = user;
        }

        return {
          users: newUsers,
        };
      }),
  }))
);
