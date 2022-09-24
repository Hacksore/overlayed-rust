use rpc_discord::{Command, DiscordIpc, Event};
use tauri::{
  plugin::{Builder, TauriPlugin},
  AppHandle, RunEvent, Wry,
};

use crate::{rpc::RpcMutex, CHANNEL_ID};
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
  println!("Start tokie thread");

  tauri::async_runtime::spawn(async move {
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

      println!("Found cl and staring thread");
      client
        .handler(|e| {
          let json_string = serde_json::to_string(&e).unwrap();
          app.emit_all("message", json_string).ok();
        })
        .await;

    } else {
      println!("Client not found")
    }
  });
}
