mod plugin;
mod command;
mod rpc;

use rpc_discord::{DiscordIpcClient};
use tauri::{async_runtime::Mutex};

use ::tauri::Manager;
use rpc::RpcMutex;

pub const CHANNEL_ID: &str = "1022132922565804062";

#[tokio::main]
async fn main() {
  // TODO: get real auth at some point
  dotenv::dotenv().ok();

  println!("CLIENT_ID: {}", dotenv::var("CLIENT_ID").unwrap());
  // client id from env
  let access_token = dotenv::var("ACCESS_TOKEN").expect("Must define client id");
  let client_id = dotenv::var("CLIENT_ID").expect("Must define access id");

  // connect to discord client with overlayed id
  let client = DiscordIpcClient::new(&client_id, &access_token)
    .await
    .expect("Client failed to connect");

  let app = tauri::Builder::default();

  app
    .plugin(plugin::startup::init())
    .invoke_handler(tauri::generate_handler![
      command::send_to_discord
    ])
    .setup(|app| {
      let app_handle = app.handle();
      let client_mutex = RpcMutex::new(Mutex::new(client));

      // adds the ref to tauri state
      app_handle.manage(client_mutex);

      // dev tools
      let window = app.get_window("main").unwrap();
      window.open_devtools();

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}
