// interface User {
//   nick: string;
//   id: string;
//   talking: boolean;
//   avatarHash: string;
//   muted: boolean;
//   deafend: boolean;
//   selfMuted: boolean;
//   selfDeafend: boolean;
// }

// User object
export interface IUser {
  /**
   * @property {string} id - user's id
   */
  id: string;

  /**
   * @property {string} username - username
   */
  username: string;

  /**
   * @property {string} avatarHash - hash of the users avatar
   */
  avatarHash: string;

  /**
   * @property {boolean} talking - flag to indicate if the user is talking
   */
  talking: boolean;

  /**
   * @property {boolean} deafened - flag to indicate if the user is deafened
   */
  deafened: boolean;

  /**
   * @property {boolean} muted - flag to indicate if the user is muted, not by themself
   */
  muted: boolean;

  /**
   * @property {boolean} suppress - flag to indicate if the user is suppressed (maybe no voice channels?)
   */
  suppress: boolean;

  /**
   * @property {boolean} selfDeafened - flag to indicate if the user is self deafened
   */
  selfDeafened: boolean;

  /**
   * @property {boolean} selfMuted - flag to indicate if the user is self muted
   */
  selfMuted: boolean;
}

export interface IChannelJoin {
  id: string;
  name: string;
  type: number;
  topic: string;
  bitrate: number;
  user_limit: number;
  guild_id: string;
  position: number;
  voice_states: VoiceState[];
}

export interface IDiscordUser {
  nick: string;
  mute: boolean;
  volume: number;
  pan: Pan;
  voice_state: IVoiceState;
  user: User;
}

interface Pan {
  left: number;
  right: number;
}

export interface IVoiceState {
  mute: boolean; // TBD
  deaf: boolean; // TBD
  self_mute: boolean;
  self_deaf: boolean;
  suppress: boolean; // maybe its a channel where you dont have perms to talk in aka suppress
}

interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  bot: boolean;
  flags: number;
  premium_type: number;
}
