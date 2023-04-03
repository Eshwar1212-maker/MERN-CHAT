declare const process: {
  env: {
    NODE_ENV: string;
    REACT_APP_API_URL: string;
  };
};

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === "production") disableReactDevTools();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
