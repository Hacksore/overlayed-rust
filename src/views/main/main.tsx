import { useEffect } from "react";
import Avatar from "../../components/avatar";
import ipcManager from "../../rpc/manager";
import { useAppStore } from "../../store";
import { IUser } from "../../types/user";

const useUserSpeaking = () => {
  const { setTalking } = useAppStore();

  const handleSpeaking = (event: any) => {
    setTalking(event.id, event.talking);
  };

  useEffect(() => {
    ipcManager.on("speaking", handleSpeaking);
  }, []);
};

const useUserList = () => {
  const { setUsers } = useAppStore();
  const handleUsersList = (event: any) => {
    setUsers(event);
  };

  useEffect(() => {
    ipcManager.on("users-list", handleUsersList);
  }, []);
};

const useUserChannelStates = () => {
  const { removeUser } = useAppStore();
  const handleUserChannelDelete = (id: string) => {
    console.log("remove user", id);
    removeUser(id);
  };

  useEffect(() => {
    ipcManager.on("user-voice-delete", handleUserChannelDelete);
  }, []);
};

const useUserJoinChannel = () => {
  const { setCurrentChannel } = useAppStore();
  const handleUserChannelJoin = (channelData: any) => {
    console.log("channel user", channelData);
    setCurrentChannel(channelData);
  };

  useEffect(() => {
    ipcManager.on("voice-channel-select", handleUserChannelJoin);
  }, []);
};

export default function Main() {
  const { users } = useAppStore();

  // store here
  useEffect(() => {
    ipcManager.init();
  }, []);

  // TODO: maybe it makes sense to move all the hook into one?
  // handle speaking state
  useUserSpeaking();

  // handle user list state
  useUserList();

  // handle delete user
  useUserChannelStates();

  // on user choining a channel
  useUserJoinChannel();

  return (
    <div className="p-2">
      {Object.entries<IUser>(users).map(([id, item]) => (
        <Avatar key={id} username={item.username} isTalking={item.talking} />
      ))}
    </div>
  );
}
