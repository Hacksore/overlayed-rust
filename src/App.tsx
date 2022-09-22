import { HashRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Loading from "./views/loading";
import Login from "./views/login";
import Main from "./views/main";

// When using the Tauri API npm package:
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const listenForEvents = async () => {
      return await listen("message", (event: any) => {
        console.log(event);
      });
    };

    listenForEvents();
  }, []);

  return (
    <div>
      <button onClick={() => invoke("init_socket", { S: "test" })}>test</button>
      <Header />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Loading />} />
          <Route path="/main" element={<Main />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
