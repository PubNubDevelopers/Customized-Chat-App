# WORK IN PROGRESS

# PubNub Customizable Chat Application

Application which is configurable at both runtime and build-time to show how PubNub can deliver any kind of real-time chat solution.  This application is designed to be used in conjunction with the [customization dashboard](https://customized-chat-app-dashboard.netlify.app/).

## Installation / Getting Started

This application is written with NextJS, so be sure to have a copy of [Node.js 18.17](https://nodejs.org/) or later installed.

**This application requires a configuration file, available from the [customization dashboard](https://customized-chat-app-dashboard.netlify.app/)**, this contains your PubNub publish and subscribe keys as well defining the capabilities of the app.  As a prerequisite to running this application, it is assumed you have created a PubNub Pub/Sub keyset which is correctly configured, i.e. the capabilities of the keyset match required capabilities of the application.  For example, if your customizable chat application supports message attachments, you must have the `Files` setting enabled on your keyset.  The full set of keyset requirements was provided by the configuration dashboard when the configuration was created.

## Building and Running

1. Clone the repository `git clone https://github.com/PubNubDevelopers/Customized-Chat-App.git`
1. Navigate to the web variant of the application `cd web\customized-chat-app`
1. Open the application in your favourite code editor, for example to open in VSCode `code .`
1. Locate the `configuration.ts` file, located at `<web application location>\app\configuration.ts`
1. Replace the contents of `configuration.ts` with the configuration provided by the [customization dashboard](https://customized-chat-app-dashboard.netlify.app/).  This will look something like the following:

```javascript
export const buildConfig = {
  "publishKey":      "pub-c-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "subscribeKey":    "sub-c-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "public_channels": true,  
  "group_chat":      true,       
  "message_history": true,  
  ...
};
```

### Install dependencies and Run
1. yarn install
1. yarn dev
1. You can now navigate to `localhost:3000` in your browser.  The first time you run the application on a new keyset it will have to first do some initialization, which will take a few seconds.

### More information on App Context configuration used by this app
User Metadata Events are required to receive updates from other users such as their name or profile picture being changed. Channel Metadata Events are used to notify others that a channel's name has changed.  Membership Metadata Events are used to notify others that a user has joined or left a channel.  Get All Channel Metadata is used when first initializing an application, to join all public channels.  Get All User Metadata is used to search for other users and cache other app users.