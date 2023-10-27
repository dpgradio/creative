# @dpgradio/creative

## Installation

```bash
yarn add @dpgradio/creative
```

## CSS: Fonts and Colors

Note that version 5 of this package provides fonts and colors as pure css.
The variables and fonts are no longer available as scss variables/imports.

Example:

```css
@import "@dpgradio/creative/styles/colors/qmusic";
@import "@dpgradio/creative/styles/fonts/qmusic";

body, html {
  background-color: rgb(var(--q-teal));
  color: rgb(var(--q-grey) / 0.8);
  font-family: 'QMarkMyWords';
}
```

Use the following to import the colors and fonts of all brands:
  
```css
@import "@dpgradio/creative/styles/all";
```

## Config

### Usage

Add the following in the main script of your application to retrieve the configuration.
The configuration will also be used by other components of this package (e.g. privacy, tracking, etc.).

```js
import { configuration } from '@dpgradio/creative'

// Global config only
await configuration.retrieveConfigForDetectedStation()

// Global and app-specific config
await configuration.retrieveConfigForDetectedStation(appId) // Default, by hostname or query parameter

// Or, if you want to retrieve the config by hostnames only.
await configuration.retrieveConfigByHostname(appId)
// Or, if you want to retrieve the config for a specific station:
await configuration.retrieveConfigByStation(stationId, appId)

// By default the first station ID (stationIdA) is used as the current station of the configuration.
// If you want to use a different station, you can do so by calling setStation:
await configuration.retrieveConfigByStations([stationIdA, stationIdB, stationIdC], appId)
configuration.setStation(stationIdC)
```
You can change the station later on at any time without having to retrieve the config again.
The API client will automatically use the correct station.
Privacy and tracking need to be reinitalized after changing the station.

The config can now be used as follows:

```js
import { config } from '@dpgradio/creative'

config('api_base_url') // or: config().api_base_url
config('app.default_theme') // or: config().app.default_theme
```

### Update Schema

Applications can create/modify the configuration schema by creating a script with the following contents:

```js
import { api, configuration } from '@dpgradio/creative'

api.setApiKey('<api-token-here>')

await configuration.replaceSchema('greety', [
  {
    name: 'display_language',
    type: 'options',
    default: 'dutch',
    options: ['dutch', 'english'],
  },
  {
    name: 'author_name',
    type: 'string',
  },
])
```

(assuming availablity of top-level await and `fetch`)

## Privacy and Tracking

### Privacy

#### Initialization

Without [config](#config):

```js
import { privacy } from '@dpgradio/creative'

privacy.initialize(privacyManagerId, websiteUrl, cmpCname)
```

With config (after [initializing the config](#config)):

```js
import { privacy } from '@dpgradio/creative'

privacy.initialize()
```

#### Get consent string

```js
import { privacy } from '@dpgradio/creative'

const consent = await privacy.waitForConsent()

// Available properties:
consent.consentString
consent.purposes
consent.allowsTargetedAdvertising()
```

### Tracking

```js
import { dataLayer } from '@dpgradio/creative'

dataLayer.initialize() // Pushes gtmStart and currently authenticated user
dataLayer.pushVirtualPageView(brand) // brand is not required when the config is initialized

dataLayer.pushEvent(event, data)
```

## API

With an initialized [configuration](#config):

```js
import { api } from '@dpgradio/creative'

const channels = await api.channels.all()

const globalChannels = await api.global().channels.all()

api.setRadioToken(token)
const profile = await api.members.me() // or await api.setRadioToken(token).members.me()

api.setApiKey(key)
await api.global().config.update(appId, schema)

const oldChannels = await api.onVersion('1.4').channels.all()
```

Without an initialized [configuration](#config):

```js
import { Api } from '@dpgradio/creative'

const api = new Api('https://api.qmusic.be')

const channels = await api.channels.all()
```

## Socket

```js
import { socket } from '@dpgradio/creative'

socket.connect(stationId).subscribe('plays').on('play', () => {
  console.log('play')
}, { backlog: 3 }})

// or

socket.join({ station: stationId, entity: 'plays', action: 'play', options: { backlog: 3 } }, (play) => {
  console.log(play)
})
```

## Hybrid

The app interaction layer for use in webviews in the app.
Interacts trough a "JavaScript bridge".
On iOS it uses [message handlers](https://developer.apple.com/documentation/webkit/wkscriptmessagehandler) and on Android it uses [JavascriptInterface](https://developer.android.com/guide/webapps/webview#BindingJavaScript).

```js
import { hyrid } from '@dpgradio/creative'
```

### Information

#### `hybrid.appInfo()`

Gives information about the brand, platform, version etc. of the app.

#### `hybrid.isNativeApp()`

Returns `true` if the client is a native app.

#### `hybrid.isVersion({ iOS, Android })`

Returns `true` if the client is a native app and the version is equal to or lower than the given version for the given platform.

### Listen for events

The app will emit events that can be listened to.
For certain events, such as `appLoad` it is important to start listening as soon as possible.
Because this is sometimes difficult to do, the `appLoaded` method can be used to wait for the `appLoad` event.
And if the event has already been emitted before the method is called, it will return immediately.

The following events are available:
* `appLoad`: The app has loaded. If the user is logged in, it provides their radio token.
* `authenticated`: The user has authenticated. It provides the user's radio token.
* `didAppear`: The webview is visible. If the user is logged in, it provides their radio token.  ⚠️ Test when exactly this event is emitted.
* `didHide`: The webview is hidden. ⚠️ Test when exactly this event is emitted.

#### `hybrid.on(event, callback, once)`

Listen for an event. If `once` is `true`, the callback will only be called once.

#### `hybrid.one(event, callback)`

Listen for an event. The callback will only be called once.

#### `hybrid.appLoaded()`

This method returns a promise that resolves when the `appLoad` event is emitted.
If the event has already been emitted before the method is called, it will return immediately.

If the user is logged in, the user's radio token is returned.

Example usage:
```
const radioToken = await hybrid.appLoaded()
await api.members.me()
```

### Actions

To initiate actions on the app side, we provide the methods below.

Under the hood these actions are called using the following method, which can also be used directly in case you need to call an action that is not available as a method:

```
hybrid.call(method, options)
```

You may encounter the method `"navigateTo"` in older code.
This method is now deprecated and replaced by `hybrid.openUrl` and `hybrid.openPermalink`.

#### `hybrid.openUrl(url, { mode })`

Opens an external URL in a mode of choice.
This is not meant to open URLs on our own domains, e.g. `https://qmusic.be/this-is-a-cool-article`.
For that, use `hybrid.openPermalink`.

Supported modes:
* `seque`: Opens the URL in a windows that slides from the right, pushing onto the current page.
* `overlay`: Opens the URL in a full-screen modal that slides up from the bottom.
* `in-app-browser`: Opens the URL in an in-app browser with navigation controls. No hybrid functionality supported.
* `external-browser`: Opens the URL in the default browser. No hybrid functionality supported.

#### `hybrid.openPermalink(permalink)`

Opens a permalink of e.g. an article.
The article will be shown in a regular `seque` style.

⚠️ As of October 2023, not yet supported by the apps.

#### `hybrid.showAuthentication()`

Shows an authentication dialog.

On Android this is shown regardless of the login status, on iOS it's only shown when the user is not logged in.

#### `hybrid.changeHeight(height, { animated })`

Changes the height of the webview.

Animation is only supported on Android.

## Sharing Generator

Example:

```js
import { Shareable, ImageGeneratorProperties } from '@dpgradio/creative/share'

const shareable = new Shareable()
  .withTitle(`${this.name} is mijn seventies match!`)
  .withDescription('Ontdek wie jouw seventies match is in de Generation Quiz van Joe!')
  .withMessageText(`Mijn seventies match is ${this.name}, wat is die van jou?`)
  .redirectTo('https://article_url.com')
  .fromDomain('joe.be')

// Facebook
const image = new ImageGeneratorProperties('https://static.qmusic.be/acties/joe-70s-quiz-share-fb/index.html')
  .withDimensions(1200, 630)
  .withPayload({ results: this.matches });
       
(await shareable.generateUsingImage(image)).openFacebookUrl()

// Instagram
const image = new ImageGeneratorProperties('https://static.qmusic.be/acties/joe-70s-quiz-share-fb/index.html')
  .withDimensions(1080, 1920)
  .withPayload({ results: this.matches });
       
(await shareable.generateUsingImage(image)).openInstagramUrl()

// Whatsapp
const image = new ImageGeneratorProperties('https://static.qmusic.be/acties/joe-70s-quiz-share-fb/index.html')
  .withDimensions(1200, 630)
  .withPayload({ results: this.matches });
       
(await shareable.generateUsingImage(image)).openWhatsappUrl()
```

## Utilities

This package provides a number of utility functions.

| Function                                                  | Description                                                                              |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `loadScript(url, { timeout })`                            | Dynammically loads a JS script.                                                          |
| `openExternalUrl(url)`                                    | Opens external URL as separate from the current page as possible on web/app.             |
| `tap(value, callback)`                                    | Invokes `callback` with the `value` and then returns `value`.                            |
| `cdnImageUrl(endpoint[, size])`                           | Get a full image URL for an endpoint in a given size (`w480`, `w800`, `w1200`, `w2400`). |
| `cdnUrl(endpoint)`                                        | Get a full CDN URL for a given endpoint.                                                 |
| `removePhoneNumberCountryPrefix(phoneNumber, [, prefix])` | Removes a country prefix from a phone number based on the station config `country_code`. |
| `onLocalStorageChange(key, callback)`                     | Calls `callback` when the value of `key` in `localStorage` changes.                      |
| `decodeRadioToken(token)`                                 | Decodes a JWT radio token.                                                               |
