import create from "zustand";
import { devtools } from "zustand/middleware";
import { IChannelJoin, IDiscordUser, IUser } from "./types/user";

const createUserStateItem = (payload: IDiscordUser) =>
  ({
    username: payload.nick,
    avatarHash: payload.user.avatar,
    muted: payload.mute,
    deafened: payload.voice_state.deaf, // Probably only bots can deafen themselves
    selfDeafened: payload.voice_state.self_deaf,
    selfMuted: payload.voice_state.self_mute,
    suppress: payload.voice_state.suppress,
    talking: false,
    id: payload.user.id,
  } as IUser);

interface AppState {
  users: Record<string, IUser>;
  setTalking: FSetTalkingParams;
  setUsers: FSetUsers;
}

type FSetTalkingParams = (id: string, voiceState: boolean) => void;
type FSetUsers = (users: IChannelJoin[]) => void;

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    users: {},
    setTalking: (id, voiceState) =>
      set((state) => {
        // toggle state
        state.users[id].talking = voiceState;

        // is this expensive?????
        return {
          users: state.users,
        };
      }),
    setUsers: (users) =>
      set((state) => {
           
        
        users .map((user) => createUserStateItem(user));

        // is this expensive?????
        return {
          users: state.users,
        };
      }),
  }))
);
