import { useAppStore } from "../../store";
import ipcManager from "../../rpc/manager";
import { useEffect } from "react";

export const useIPC = () => {
  const { setTalking, removeUser, setUsers, setCurrentChannel, currentChannel } = useAppStore();

  const handleSpeaking = (event: any) => {
    console.log("Handle speaking", event);
    setTalking(event.id, event.talking);
  };

  const handleUserChannelDelete = (id: string) => {
    console.log("remove user", id);
    removeUser(id);
  };

  const handleUsersList = (event: any) => {
    console.log("user list", event);
    setUsers(event);
  };

  const handleUserChannelJoin = (channelData: any) => {
    console.log("channel data", channelData);
    // if it's my id and we are null we need to unsub all events
    // if ()
    // ipcManager.channelEvents(RPCCommand.UNSUBSCRIBE, {
    //   id: currentChannel.id,
    // });

    setCurrentChannel(channelData);
  };

  useEffect(() => {
    ipcManager.on("user-voice-delete", handleUserChannelDelete);
    ipcManager.on("speaking", handleSpeaking);
    ipcManager.on("users-list", handleUsersList);
    ipcManager.on("voice-channel-select", handleUserChannelJoin);
  }, []);
};

