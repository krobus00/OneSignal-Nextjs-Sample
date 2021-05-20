# Integrating OneSignal into a Next.JS App

Created: May 11, 2021
Created by: William Shepherd
Tags: Work

In this walkthrough, I'll be covering how to leverage OneSignal in a React app built using the [Next.JS](https://nextjs.org/) framework. This article is written with the assumption that you already know a little bit about Next.JS; my focus will be on the OneSignal integration. In an effort to make this guide as useful to as many people as possible, I'm going to be starting from scratch.

OneSignal is <insert marketing here>. 

## My system

At the time this guide was written, I had the following dependencies installed on my system:

- macOS 11.3.1
- [Node v14.15.1](https://github.com/nodejs/node/releases/tag/v14.15.1)
- [Yarn 1.22.10](https://github.com/yarnpkg/yarn/releases/tag/v1.22.10)
- [Next.js v10.2.0](https://github.com/vercel/next.js/releases/tag/v10.2.0) (latest at the time of writing)

You should be able to follow along so long as you have Node version 14 or later

### Setting up a project workspace

Starting from where you keep all your repos

```bash
╭─iamwillshepherd@ares ~/code
╰─$ pwd
/Users/iamwillshepherd/code
```

Create a new directory for the project

```bash
╭─iamwillshepherd@ares ~/code
╰─$ mkdir onesignal-nexgtjs
```

Initialize git database in the directory

```bash
╭─iamwillshepherd@ares ~/code
╰─$ cd onesignal-nexgtjs && git init
Initialized empty Git repository in /Users/iamwillshepherd/code/onesignal-nexgtjs/.git/
```

### A note on branch names

Depending on how you've configured git, new branch names may  default to ***master***. This walkthrough uses ***main*** as the default branch. If you'd like to follow this tutorial using the same branch name, execute `git branch -m main` to rename the default branch to ***main*.**

If you're not a fan of using ***master*** as your default branch name, you change the default branch for all future repos by updating your global configuration settings for git.

`git config --global init.defaultBranch main`

## Create your Next app

Execute `yarn create next-app`. 

```bash
╭─iamwillshepherd@ares ~/code/onesignal-nextjs ‹main›
╰─$ yarn create next-app .
yarn create v1.22.10
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...

success Installed "create-next-app@10.2.0" with binaries:
      - create-next-app
[##] 2/2Creating a new Next.js app in /Users/iamwillshepherd/code/onesignal-nextjs.

Installing react, react-dom, and next using yarn...
```

Once the command has completed, you should see output similar to mine.

```bash
Success! Created onesignal-nexgtjs at /Users/iamwillshepherd/code/onesignal-nextjs
Inside that directory, you can run several commands:

  yarn dev
    Starts the development server.

  yarn build
    Builds the app for production.

  yarn start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd /Users/iamwillshepherd/code/onesignal-nextjs
  yarn dev

✨  Done in 4.75s.
```

I'm deferring to the excellent [Next docs](https://nextjs.org/docs) to explain what this (☝🏾) command does.

Execute `yarn dev` to verify the app works as expected.

```bash
╭─iamwillshepherd@ares ~/code/onesignal-nextjs ‹main*›
╰─$ yarn dev
yarn run v1.22.10
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Using webpack 5. Reason: no next.config.js https://nextjs.org/docs/messages/webpack5
event - compiled successfully
event - build page: /next/dist/pages/_error
wait  - compiling...
event - compiled successfully
```

Navigate to the URL returned in the output with your browser of choice

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-17_at_12.23.19_PM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-17_at_12.23.19_PM.png)

Expected result when navigating to URL in run output.

## Get the OneSignal SDK Service Workers

OneSignal allows you to integrate with dozens of 3rd parties, including the web platform. Because I'm integrating OneSignal into a React app, I have to manually add the SDK service workers to the app. OneSignal documents how to accomplish this in the [Custom Code Setup doc](https://documentation.onesignal.com/docs/web-push-custom-code-setup).

Download the OneSignal SDK archive (found [here](https://documentation.onesignal.com/docs/web-push-custom-code-setup#step-3-upload-onesignal-sdk)).

Unzip the contents of the archive into your project into the `public` directory of your Next app. 

```bash
╭─iamwillshepherd@ares ~/code/onesignal-nextjs ‹main›
╰─$ unzip ~/Downloads/OneSignal-Web-SDK-HTTPS-Integration-Files.zip -d public
Archive:  /Users/iamwillshepherd/Downloads/OneSignal-Web-SDK-HTTPS-Integration-Files.zip
   creating: public/OneSignal-Web-SDK-HTTPS-Integration-Files/
  inflating: public/OneSignal-Web-SDK-HTTPS-Integration-Files/.DS_Store
   creating: public/__MACOSX/
   creating: public/__MACOSX/OneSignal-Web-SDK-HTTPS-Integration-Files/
  inflating: public/__MACOSX/OneSignal-Web-SDK-HTTPS-Integration-Files/._.DS_Store
  inflating: public/OneSignal-Web-SDK-HTTPS-Integration-Files/OneSignalSDKWorker.js
  inflating: public/__MACOSX/OneSignal-Web-SDK-HTTPS-Integration-Files/._OneSignalSDKWorker.js
  inflating: public/OneSignal-Web-SDK-HTTPS-Integration-Files/OneSignalSDKUpdaterWorker.js
  inflating: public/__MACOSX/OneSignal-Web-SDK-HTTPS-Integration-Files/._OneSignalSDKUpdaterWorker.js
  inflating: public/__MACOSX/._OneSignal-Web-SDK-HTTPS-Integration-Files
```

The OneSignal Web SDK directory contains service workers that do the heavy lifting of handling notifications. These service workers must be publicly accessible, so we use Next's [static file servicing](https://nextjs.org/docs/basic-features/static-file-serving) to achieve this. 

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-17_at_2.27.14_PM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-17_at_2.27.14_PM.png)

Contents of public directory;  __MACOSX can be ignored.

Move all JavaScript files from `OneSignal-Web-SDK/` to `public/`.

```bash
╭─iamwillshepherd@ares ~/code/onesignal-nextjs/public ‹main*›
╰─$ mv OneSignal-Web-SDK-HTTPS-Integration-Files/*.js .
```

Confirm the files have been moved.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-17_at_3.44.51_PM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-17_at_3.44.51_PM.png)

The highlighted files need to be removed.

Cleanup the `public` directory.

```bash
╭─iamwillshepherd@ares ~/code/onesignal-nextjs/public ‹main*›
╰─$ rm -rf __MACOSX OneSignal-Web-*
```

## Add OneSignal SDK Script

In order to make use of the two service workers, the OneSignal SDK script must be loaded. Add the OneSignalSDK script under the `Head` component in  `pages/index.js` .

```html
<Head>
  <title>OneSignal + Next.js</title>
  <meta
    name="description"
    content="Integrating OneSignal with a Next.js app."
  />
  <link rel="icon" href="/favicon.ico" />
  <script
    src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
    async=""
  ></script>
</Head>
```

At this point, we have most of the setup complete for the web app, we only need to initialize a OneSignalSDK instance.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_2.38.51_PM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_2.38.51_PM.png)

OneSignalSDK successfully loaded.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-19_14.37.35.gif](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-19_14.37.35.gif)

OneSignal is now available on global `window` object. 

## Initialize the OneSignal SDK Part 1

Custom code integrations require a bit of JavaScript code to initialize OneSignal. I'm going to focus on HTTP initialization because more people will be able to follow along. HTTPS initialization is very  similar to what I'm covering here, so this guide may still be useful to you.

According to the [example code](https://documentation.onesignal.com/docs/web-push-custom-code-examples#custom-code-http-initialization) in OneSignal's docs, this is how to initialize OneSignal on a site using custom code.

```html
<head>
  <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async=""></script>
  <script>
    var OneSignal = window.OneSignal || [];
    OneSignal.push(function() {
      OneSignal.init({
        appId: "YOUR_APP_ID",
        subdomainName:"YOUR_LABEL"/* The label for your site that you added in Site Setup mylabel.os.tc */
        notifyButton: {
          enable: true,
        },
      });
    });
		// OneSignal.showNativePrompt(); // <-- For HTTPS initialization
  </script>
</head>
```

Next.js uses React to render the app, so I have to handle initialization of the SDK in a way that works with the framework. React provides a mechanism to perform side effects on page load:  `useEffect` (read the [doc](https://reactjs.org/docs/hooks-effect.html) to learn more). This hook allows code to execute when the page is mounted which is exactly what's necessary to init OneSignal.

### Creating a Hook

Create a file named `utils/useOneSignal.js` inside the workspace.

```bash
╭─iamwillshepherd@ares ~/code/onesignal-nextjs ‹main*›
╰─$ mkdir utils && touch utils/useOneSignal.js
```

Copy `useEffect` boilerplate into the file.

```jsx
import { useEffect } from "react";

const useOneSignal = () =>
  useEffect(() => {
    console.log("init OneSignal...");

    return () => {
      console.log("cleanup OneSignal");
    };
  }, []); // <-- run this effect once on mount

export default useOneSignal;
```

Note that I'm passing an empty list, `[]`, to `useEffect` because I only want the effect to run once, when the page is mounted (learn more about conditionally running an effect [here](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)). 

### Using OneSignal Hook

Call the hook in `pages/_app.js` so OneSignalSDK is available to all pages.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-18_at_3.07.54_PM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-18_at_3.07.54_PM.png)

Calling `useOneSignal` before rendering the app.

When refreshing the app, the effect should write a message to the console once mounted.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_2.36.22_PM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_2.36.22_PM.png)

Side-effects of OneSignal hook.

We'll come back to the `useOneSignal` hook after getting the ID needed to initialize the OneSignal SDK.

## OneSignal

OneSignal needs a special key called `appId` to initialize the SDK. You can obtain this key by logging into your [OneSignal account](https://app.onesignal.com/); If you don't have an account, you will need to [signup for one](https://app.onesignal.com/signup) before continuing this tutorial.

### Create App

On first login, you're presented a getting started page. Fill out the form and select the *Web* platform.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_11.01.43_AM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_11.01.43_AM.png)

Creating new app for the Web platform named *OneSignal Nextjs.*

If you already have existing apps, you can create a new one using the Apps dropdown menu.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-19_11.22.17.gif](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-19_11.22.17.gif)

Selecting New App from the app dropdown.

### Configure App Platform

Select the *Custom Code* integration and fill out the form in the **Site Setup** section.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_11.19.58_AM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_11.19.58_AM.png)

Configuring Custom Code integration

Note that I'm using `[http://localhost:3000](http://localhost:3000)` for my site URL because my dev server serves the site there. Once you're ready to deploy your site, you would change this URL to point to your domain. You'll also want to double check that you enable the *Local Testing* option which will allow the integration to work in a development environment.

Click the **Save** to complete the application**.**

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_11.20.31_AM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_11.20.31_AM.png)

Final page of app creation process reveals `appId` in second script.

Copy the content of the second script.

## Initialize the OneSignal SDK Part 2

Paste the content inside the callback being passed to `useEffect` in `utils/useOneSignal.js`. 

```diff
--- 
+++ 
@@ -1,8 +1,18 @@
 const useOneSignal = () =>
   useEffect(() => {
-    console.log("init OneSignal...");
+    window.OneSignal = window.OneSignal || [];
+    OneSignal.push(function () {
+      OneSignal.init({
+        appId: "b40b7cc7-13dc-4662-8b48-efa668f9b72a",
+        notifyButton: {
+          enable: true,
+        },
 
+        allowLocalhostAsSecureOrigin: true,
+      });
+    });

     return () => {
-      console.log("cleanup OneSignal");
+      window.OneSignal = undefined;
     };
   }, []); // <-- run this effect once on mount
```

The diff illustrates what edits need to be made to initialize the SDK ☝🏾

Reloading the app should reveal a new UI element at the bottom-right corner of the browser viewport. 

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_2.35.11_PM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-19_at_2.35.11_PM.png)

The new button is how visitors to the site can subscribe to notifications.

## Pushing a Notification

Now that the integration is complete, we can test it out. Subscribe to notifications. 

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-19_15.01.12.gif](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-19_15.01.12.gif)

Subscribing to notifications.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-20_at_10.04.51_AM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-20_at_10.04.51_AM.png)

Confirmation dialog that doesn't appear in previous GIF.

### Confirm the Subscription

Navigate to your [OneSignal account](https://app.onesignal.com/) and select the *OneSignal Nextjs* app.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-20_10.21.47.gif](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-20_10.21.47.gif)

Navigating to Audience to view subscribed users.

Select *All Users* from the second level menu to see a list of all subscribed users.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-20_at_10.28.52_AM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-20_at_10.28.52_AM.png)

I'm my only user 😅

### Sending a Message

Now that there's a subscriber, we can use OneSignal to push a web notification. Navigate to the campaigns page by selecting *Messages* from the top-level menu then clicking the *New Push* button.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-20_10.38.03.gif](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-20_10.38.03.gif)

Creating a push notification.

Fill out the form to see what your notification will look like.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-20_at_10.47.17_AM.png](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/Screen_Shot_2021-05-20_at_10.47.17_AM.png)

Notification that has been configured to go out immediately. 

The notification preview shows what the message will look like for a Mac user who subscribed to the site using Chrome. Selecting different platforms changes the preview.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-20_10.50.25.gif](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-20_10.50.25.gif)

Previewing different platforms.

It's important to check the preview for all platforms before pushing a notification. Since this is a demo, I'm going to push this notification even though the layout is broken for Android web notifications. 

### Pushing a Notification

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-20_11.01.39.gif](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-20_11.01.39.gif)

Native notification being displayed as result of pushing message.

Clicking the notification opens the URL I entered in the *Launch URL* text field.

![Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-20_11.16.07.gif](Integrating%20OneSignal%20into%20a%20Next%20JS%20App%2045906aacd7944a6aa7c1fa0d821e3456/2021-05-20_11.16.07.gif)

Taking action on notification.