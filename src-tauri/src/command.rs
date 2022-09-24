use tauri::AppHandle;
use rpc_discord::DiscordIpc;

use crate::{rpc::RpcMutex};
use ::tauri::Manager;

/// send a json string
#[tauri::command(async)]
pub async fn send_to_discord(app: AppHandle, payload: String) {
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
