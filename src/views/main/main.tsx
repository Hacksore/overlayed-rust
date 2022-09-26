import { useEffect, useState } from "react";
import ipcManager from "../../rpc/manager";

const useUserSpeaking = () => {
  const handleSpeaking = (event: any) => {
    console.log("e", event);
  };

  useEffect(() => {
    ipcManager.on("speaking", handleSpeaking);
  }, []);
};

const useUserList = () => {
  const handleSpeaking = (event: any) => {
    console.log("users", event);
  };

  useEffect(() => {
    console.log("Creating useUserList...");
    ipcManager.on("users-list", handleSpeaking);
  }, []);
};

export default function Main() {
  const [users, setUsers] = useState(null);

  //store here
  useEffect(() => {
    const init = async () => {
      console.log("Creating listener...");
      // init some default shit
      ipcManager.init();
    };

    init();
  }, []);


  // handle speaking state
  useUserSpeaking();

  // handle user list state
  useUserList();

  return <div className="bg-gray-500 p-2">{JSON.stringify(users)}</div>;
}
