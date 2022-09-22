use rpc_discord::{Command, DiscordIpc, DiscordIpcClient, Event, EventReceive};
use tauri::{AppHandle};

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
  client_id: String,
}


fn handle_message(event: EventReceive) {
  // TODO: get a ref to the app so I can use that to all app.emit_*
  // tauri::AppHandle
  // app.emit_all("message", "{}");

  println!("{:#?}", event);
}

#[tauri::command(async)]
async fn init_socket(app: AppHandle) {
  // access token from env
  let access_token = dotenv::var("ACCESS_TOKEN").unwrap();

  // client id from env
  let client_id = dotenv::var("CLIENT_ID").unwrap();

  // connect to discord client with overlayed id
  let mut client = DiscordIpcClient::new(&client_id)
    .await
    .expect("Client failed to connect");

  // login to the client
  client.login(access_token).await.unwrap();

  client
    .emit(Command::get_selected_voice_channel())
    .await
    .ok();

  client
    .emit(Event::speaking_start_event("1021507676871589939"))
    .await
    .ok();

  client
    .emit(Event::speaking_stop_event("1021507676871589939"))
    .await
    .ok();

  client.handler(handle_message).await.ok();

  println!("made it here");
}

#[tokio::main]
async fn main() {
  // TODO: get real auth at some point
  dotenv::dotenv().ok();

  let app = tauri::Builder::default();

  app
    .invoke_handler(tauri::generate_handler![init_socket])
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}
