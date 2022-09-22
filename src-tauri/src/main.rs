use rpc_discord::{Command, DiscordIpc, DiscordIpcClient, Event };
use tauri::{AppHandle};

use::tauri::Manager;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
  client_id: String,
}

const CHANNEL_ID: &str = "1019035649870934108";

#[tauri::command(async)]
async fn init_socket(app: AppHandle) {
  // access token from env
  let access_token = dotenv::var("ACCESS_TOKEN").expect("Must provide access token");

  // client id from env
  let client_id = dotenv::var("CLIENT_ID").expect("Must define client id");

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
    .emit(Event::speaking_start_event(CHANNEL_ID))
    .await
    .ok();

  client
    .emit(Event::speaking_stop_event(CHANNEL_ID))
    .await
    .ok();

  client.handler(|e| {
    app.emit_all("message", "{ hi: \"mom\"}").unwrap();    
  }).await;
}

#[tokio::main]
async fn main() {
  // TODO: get real auth at some point
  dotenv::dotenv().ok();

  println!("CLIENT_ID: {}", dotenv::var("CLIENT_ID").unwrap());

  let app = tauri::Builder::default();

  app
    .invoke_handler(tauri::generate_handler![init_socket])
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}