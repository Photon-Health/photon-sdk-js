import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { PhotonSDK } from "@photonhealth/sdk";
import { PhotonSDKProvider } from "@photonhealth/react";

const sdk = new PhotonSDK({
  domain: process.env.REACT_APP_DOMAIN,
  clientId: process.env.REACT_APP_CLIENT_ID,
  redirectURI: window.location.origin,
  audience: "https://api.boson.health",
  uri: "https://api.boson.health/graphql",
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <PhotonSDKProvider sdk={sdk}>
      <App />
    </PhotonSDKProvider>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
