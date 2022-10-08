import { useEffect } from "react";
import Avatar from "../../components/avatar";
import ipcManager from "../../rpc/manager";
import { useAppStore } from "../../store";
import { IUser } from "../../types/user";
import { useIPC } from "./useIPC";

export default function Main() {
  const { users } = useAppStore();

  // store here
  useEffect(() => {
    ipcManager.init();
  }, []);

  useIPC();

  return (
    <div className="p-2">
      {Object.entries<IUser>(users).map(([id, item]) => (
        <Avatar key={id} username={item.username} isTalking={item.talking} />
      ))}
    </div>
  );
}
