import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import LoginStatus from "../loginContext.jsx";
import userStatus from "../userContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginStatus>
        <App />
    </LoginStatus>
  </BrowserRouter>
);
