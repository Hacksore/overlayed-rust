use std::sync::Arc;

use rpc_discord::{Command, DiscordIpc, DiscordIpcClient, Event};
use tauri::{AppHandle, async_runtime::Mutex};

use ::tauri::Manager;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
  client_id: String,
}

const CHANNEL_ID: &str = "1019035649870934108";

// #[tauri::command(async)]
// async fn receive_message(app: AppHandle, state: tauri::State<GameState>) {
//   // let client = state.0.blocking_read().client;

//   // client.emit();
//   // client SELECT_VOICE_CHANNEL => { id: 1234 }
//   // CLIENT HERE?!??!?

//   // println!("{:#?}", state.0.blocking_read());
// }

// TODO: get the clietn some how
#[tauri::command(async)]
async fn init_socket(app: AppHandle) {
  // access token from env
  // let access_token = dotenv::var("ACCESS_TOKEN").expect("Must provide access token");

  // // login to the client
  // client.login(access_token).await.unwrap();

  // client
  //   .emit(Command::get_selected_voice_channel())
  //   .await
  //   .ok();

  // client
  //   .emit(Event::speaking_start_event(CHANNEL_ID))
  //   .await
  //   .ok();

  // client
  //   .emit(Event::speaking_stop_event(CHANNEL_ID))
  //   .await
  //   .ok();
}

pub type RpcMutex = Arc<Mutex<DiscordIpcClient>>;

// pub fn init() -> TauriPlugin<Wry> {
//   Builder::new("tauri-plugin-startup")
//       .invoke_handler(tauri::generate_handler![get_startup_progress])
//       .on_event(|app_handle, event| {
//           if let RunEvent::Ready = event {
//               app_handle.manage(StartupProgressText(std::sync::Mutex::new(
//                   "Running startup tasks...".to_string(),
//               )));

//               // Don't block the main thread
//               tauri::async_runtime::spawn(run_and_check_backend(app_handle.clone()));

//               // Keep system tray stats updated
//               let app_handle = app_handle.clone();
//               tauri::async_runtime::spawn(async move {
//                   let mut interval = time::interval(Duration::from_secs(TRAY_UPDATE_INTERVAL_S));
//                   loop {
//                       update_tray_menu(&app_handle).await;
//                       interval.tick().await;
//                   }
//               });
//           }
//       })
//       .build()
// }

#[tokio::main]
async fn main() {
  // TODO: get real auth at some point
  dotenv::dotenv().ok();

  println!("CLIENT_ID: {}", dotenv::var("CLIENT_ID").unwrap());
  // client id from env
  let client_id = dotenv::var("CLIENT_ID").expect("Must define client id");

  // connect to discord client with overlayed id
  let mut client = DiscordIpcClient::new(&client_id)
    .await
    .expect("Client failed to connect");

  let app = tauri::Builder::default();

  app
    .invoke_handler(tauri::generate_handler![init_socket])
    .setup(|app| {
      let app_handle = app.handle();
      let client_mutex = RpcMutex::new(Mutex::new(client));
      app_handle.manage(client_mutex.clone());

      tokio::spawn(async {
        // do the client handle here
        let mut client = client_mutex.lock().await;
        client
          .handler(|e| {
            let payload = serde_json::to_string(&e);
            // app.emit_all("message", payload.unwrap()).unwrap();
          })
          .await;
        // println!("test");
      });

  

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}
