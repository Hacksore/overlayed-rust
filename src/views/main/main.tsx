import { useEffect, useState } from "react";
import { useStore } from "zustand";
import ipcManager from "../../rpc/manager";
import { useAppStore } from "../../store";

const useUserSpeaking = () => {
  const handleSpeaking = (event: any) => {
    console.log("e", event);
  };

  useEffect(() => {
    ipcManager.on("speaking", handleSpeaking);
  }, []);
};

const useUserList = () => {
  const { setUsers } = useAppStore()
  const handleUsersList = (event: any) => {
    setUsers(event);
  };

  useEffect(() => {
    console.log("Creating useUserList...");
    ipcManager.on("users-list", handleUsersList);
  }, []);
};

export default function Main() {
  const { users } = useAppStore()

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

  return <div className="bg-gray-500 p-2">{JSON.stringify(users)}</div>;
}
