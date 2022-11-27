import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { GithubProvider } from "./context/context";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-5g0peagd5j2kn2y2.us.auth0.com"
      clientId="X16rGpBXHUWmlHMxFpfJXfCxG7TGyVvf"
      redirectUri={window.location.origin}
      cacheLocation="localstorage"
      // so that the app remembers social connection
    >
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>
);
