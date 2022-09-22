use discord_sdk as ds;
use discord_sdk::voice::state::VoiceState;
use ds::voice;

/// Application identifier for "Andy's Test App" used in the Discord SDK's
/// examples.
pub const APP_ID: ds::AppId = 905987126099836938;

pub struct Client {
    pub discord: ds::Discord,
    pub user: ds::user::User,
    pub wheel: ds::wheel::Wheel,
}

pub async fn make_client(subs: ds::Subscriptions) -> Client {
    println!("starting client creation...");

    let (wheel, handler) = ds::wheel::Wheel::new(Box::new(|err| {
        tracing::error!(error = ?err, "encountered an error");
    }));

    let mut user = wheel.user();

    let app = ds::DiscordApp::PlainId(APP_ID);
    let discord = ds::Discord::new( app, subs, Box::new(handler))
        .expect("unable to create discord client");

    println!("waiting for handshake...");
    user.0.changed().await.unwrap();

    let user = match &*user.0.borrow() {
        ds::wheel::UserState::Connected(user) => user.clone(),
        ds::wheel::UserState::Disconnected(err) => panic!("failed to connect to Discord: {}", err),
    };

    println!("connected to Discord, local user is {:#?}", user);

    Client {
        discord,
        user,
        wheel,
    }
}

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let client = make_client(ds::Subscriptions::ALL).await;

    //let user = client.user;
    let wheel = client.wheel;

    let mut voice_events = wheel.voice().0;
    let voice_state = std::sync::Arc::new(VoiceState::new());
    let vs = voice_state.clone();

    let mut activity_events = wheel.activity();

    // tokio::task::spawn(async move {
    //     while let Ok(ae) = activity_events.0.recv().await {
    //         println!("received activity event {:?}", ae);
    //     }
    // });

    tokio::task::spawn(async move {
        while let Ok(ve) = voice_events.recv().await {
            println!("Got voice event! {:?}", ve);
            vs.on_event(ve);
        }

        // match voice_events.recv().await {
        //     Ok() => {

        //     },
        //     Err(err) => {
        //         println!("Something wrong happend {:?}", err);
        //     }
        // }
    });

    // start the app
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // "cool rust returns"
    Ok(())

}