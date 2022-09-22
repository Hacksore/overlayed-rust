import { HashRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Loading from "./views/loading";
import Login from "./views/login";
import Main from "./views/main";

function App() {
  return (
    <div>
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
