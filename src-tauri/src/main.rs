use std::sync::Arc;

use rpc_discord::{DiscordIpc, Event, Command, DiscordIpcClient};
use tauri::{async_runtime::Mutex, AppHandle};

use ::tauri::Manager;

const CHANNEL_ID: &str = "1019035649870934108";

/// send a json string
#[tauri::command(async)]
async fn send_to_discord(app: AppHandle, payload: String) {
  println!("Got a payload from client: {payload}");

  // get client
  if let Some(cl) = app.try_state::<RpcMutex>() {
    let mut client = cl.lock().await;
    println!("from send_to_discord {}", payload);
    client.emit(payload).await.ok();
  } else {
    println!("can't get client");
  }
}

pub type RpcMutex = Arc<Mutex<DiscordIpcClient>>;

// TODO: get the client some how
#[tauri::command(async)]
async fn init_socket(app: AppHandle) {
  println!("init socket");

  // is able to get the client without issues
  if let Some(cl) = app.try_state::<RpcMutex>() {
    let mut client = cl.lock().await;

    // access token from env
    let access_token = dotenv::var("ACCESS_TOKEN").expect("Must provide access token");

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
    
    // sub to all events to via this listener
    // TODO: CURRENTLY THIS IS BLOCKING US FROM SENDING TO THE CLIENT CAUSE IT BLOCKS THE MAINTHREAD
    client.handler(|e| {
      let json_string = serde_json::to_string(&e).unwrap();      
      app.emit_all("message", json_string).ok();

    }).await;


  } else {
    println!("Client not found")
  }
}

#[tokio::main]
async fn main() {
  // TODO: get real auth at some point
  dotenv::dotenv().ok();

  println!("CLIENT_ID: {}", dotenv::var("CLIENT_ID").unwrap());
  // client id from env
  let client_id = dotenv::var("CLIENT_ID").expect("Must define client id");

  // connect to discord client with overlayed id
  let client = DiscordIpcClient::new(&client_id)
    .await
    .expect("Client failed to connect");

  let app = tauri::Builder::default();

  app
    .invoke_handler(tauri::generate_handler![init_socket, send_to_discord])
    .setup(|app| {
      let app_handle = app.handle();
      let client_mutex = RpcMutex::new(Mutex::new(client));

      // adds the ref to tauri state
      app_handle.manage(client_mutex);

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}
