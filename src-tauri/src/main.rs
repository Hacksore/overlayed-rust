mod plugin;
mod command;
mod rpc;

use rpc_discord::{DiscordIpcClient};
use tauri::{async_runtime::Mutex};

use ::tauri::Manager;
use rpc::RpcMutex;

pub const CHANNEL_ID: &str = "1019035649870934108";

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
    .plugin(plugin::startup::init())
    .invoke_handler(tauri::generate_handler![command::send_to_discord])
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
