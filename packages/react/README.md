# `@photonhealth/react`

> React integration for the Photon JavaScript SDK

## Installation
```
npm install @photonhealth/react
```

## Usage

```
import React from 'react';
import ReactDOM from 'react-dom';
import { PhotonClient, PhotonProvider } from "@photonhealth/react";

const client = new PhotonClient({
  domain: "auth.photon.health",
  clientId: "YOUR_CLIENT_ID_SECRET",
  redirectURI: window.location.origin,
  organization: "org_XXX"
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PhotonProvider client={client}>
    <App />
  </PhotonProvider>
);
```
