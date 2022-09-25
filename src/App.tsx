import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Main from "./views/main/main";

// load socket service
import "./rpc/manager";

function App() {
  return (
    <div className="rounded-md">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
