import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

export default function Main() {
  
  useEffect(() => {
    const listenForEvents = async () => {
      return await listen("message", (event) => {
        console.log(JSON.parse(event.payload as string));
      });
    };

    listenForEvents();
  }, []);

  return (
    <div className="bg-gray-500 p-2">
      <button
        className="bg-gray-100 m-2 p-2"
        onClick={() => {
          // packet: "{\"cmd\":\"GET_SELECTED_VOICE_CHANNEL\",\"evt\":null,\"nonce\":\"82862f0c-7c0d-46f1-85cf-4b2bb4015dcb\"}"
          invoke("send_to_discord", { payload: JSON.stringify({ cmd: "GET_SELECTED_VOICE_CHANNEL", evt: null, nonce: "ligma" }) })
        }}
      >
        GET_SELECTED_VOICE_CHANNEL
      </button>
      
    </div>
  );
}
