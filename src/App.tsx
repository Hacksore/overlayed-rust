import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
// import Loading from "./views/loading";
// import Login from "./views/login";
import Main from "./views/main";

// When using the Tauri API npm package:


function App() {
  // useEffect(() => {
  //   const listenForEvents = async () => {
  //     return await listen("message", (event) => {
  //       // console.log(event.payload);
  //       console.log(JSON.parse(event.payload as string));
  //     });
  //   };

  //   listenForEvents();
  // }, []);

  return (
    <div>
      <Header />
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Loading />} /> */}
          <Route path="/" element={<Main />} />
          {/* <Route path="/login" element={<Login />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
