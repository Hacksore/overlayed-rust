use tauri::{
  plugin::{Builder, TauriPlugin},
  AppHandle, RunEvent, Wry,
};

use log::{info};

use crate::{rpc::RpcMutex};
use ::tauri::Manager;

pub fn init() -> TauriPlugin<Wry> {
  Builder::new("tauri-plugin-startup")
    .on_event(|app_handle, event| {
      if let RunEvent::Ready = event {
        println!("Got ready event in plugin!");

        // // Don't block the main thread
        tauri::async_runtime::spawn(run_rpc_thread(app_handle.clone()));
      }
    })
    .build()
}

async fn run_rpc_thread(app: AppHandle) {
  info!("Start thread for RPC");

  tauri::async_runtime::spawn(async move {
    // is able to get the client without issues
    if let Some(cl) = app.try_state::<RpcMutex>() {
      let mut client = cl.lock().await;

      // login to the client
      client.login().await.unwrap();

      // start getting messages from discord socket
      let app_clone = app.app_handle();
      client
        .handler(move |event| {
          let json_string = serde_json::to_string(&event).unwrap();         

          println!("[RUST]: {json_string}");
          // send to front end
          app_clone.emit_all("message", json_string).ok();
        })
        .await;

    } else {
      println!("Client not found")
    }
  });
}
