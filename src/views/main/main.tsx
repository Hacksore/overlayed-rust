import { useEffect, useState } from "react";
import Avatar from "../../components/avatar";
import ipcManager from "../../rpc/manager";
import { IUser } from "../../types/user";

export default function Main() {
  // TODO: make a type for users map
  // const [users, setUsers] = useState<Record<string, IUser>>({});
  // const [users, setUsers] = useState<any>({});

  // useEffect(() => {
  //   ipcManager.on("message", (voiceStates: any) => {
  //     console.log("voice statues:", voiceStates);
  //     setUsers(voiceStates);
  //   });

  // }, []);

  return (
    <div className="bg-gray-500 p-2">
      {/* {JSON.stringify(users)} */}
    </div>
  );
}
