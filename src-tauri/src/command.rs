use tauri::{AppHandle};

use crate::{rpc::RpcMutex};
use ::tauri::Manager;

/// send a json string
#[tauri::command(async)]
pub async fn send_to_discord(app: AppHandle, payload: String) {
  // get client
  if let Some(cl) = app.try_state::<RpcMutex>() {
    let mut client = cl.lock().await;
    client.emit_string(payload).await.ok();
  } else {
    println!("can't get client");
  }
}