use std::sync::Arc;
use rpc_discord::{DiscordIpcClient};
use tauri::{async_runtime::Mutex};

pub type RpcMutex = Arc<Mutex<DiscordIpcClient>>;