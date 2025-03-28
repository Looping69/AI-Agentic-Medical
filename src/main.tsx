import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { TempoDevtools } from "tempo-devtools";
import routes from "tempo-routes";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Add tempo routes to the window for debugging
if (import.meta.env.DEV) {
  // @ts-ignore
  window.tempoRoutes = routes;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
