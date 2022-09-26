import { useEffect } from "react";
import Avatar from "../../components/avatar";
import ipcManager from "../../rpc/manager";
import { useAppStore } from "../../store";
import { IUser } from "../../types/user";

const useUserSpeaking = () => {
  const { setTalking } = useAppStore();

  const handleSpeaking = (event: any) => {
    console.log(event);
    setTalking(event.id, event.state);
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
    console.log("Creating useUserList...");
    ipcManager.on("users-list", handleUsersList);
  }, []);
};

export default function Main() {
  const { users } = useAppStore();

  // store here
  useEffect(() => {
    const init = async () => {
      // init some default shit
      ipcManager.init();
    };

    init();
  }, []);

  // handle speaking state
  useUserSpeaking();

  // handle user list state
  useUserList();

  return (
    <div className="bg-gray-500 p-2">
      {Object.entries<IUser>(users).map(([id, item]) => (
        <Avatar key={id} username={item.username} isTalking={item.talking}/>
      ))}
    </div>
  );
}
