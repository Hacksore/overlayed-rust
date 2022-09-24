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
    <div>
      <button onClick={() => invoke("init_socket")}>Init Socket</button>
      <button
        onClick={() => {
          invoke("send_to_discord", { payload: JSON.stringify({ cmd: "GET_SELECTED_VOICE_CHANNEL", nonce: "ligma" }) })
        }}
      >
        Send data
      </button>
      
      <h2>Overlayed test?</h2>
    </div>
  );
}
