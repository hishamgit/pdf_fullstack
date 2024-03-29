import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import LoginStatus from "../loginContext.jsx";

//Wrap the App component within the LoginStatus component to provide login context
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginStatus>
      <App />
    </LoginStatus>
  </BrowserRouter>
);
