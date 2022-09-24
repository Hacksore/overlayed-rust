import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

const rootEle = document.getElementById("root") as HTMLElement;
const container = ReactDOM.createRoot(rootEle);

container.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
