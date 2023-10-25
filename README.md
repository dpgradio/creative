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

```js
import { hyrid } from '@dpgradio/creative'
```

### Information

```
hybrid.appInfo()
hybrid.isNativeApp()
hybrid.isVersion({ iOS, Android }) // Check if the used app is of the given version or lower
```

### Listen for events

```
hybrid.on(method, callback, once)
hybrid.one(method, callback)

const radioToken = await hybrid.appLoaded()
```

Events:
```
appLoad
authenticated
didAppear
didHide
```

### Actions

The following actions are available:

```
hybrid.openUrl(url, { mode })
hybrid.openPermalink(permalink)
hybrid.showAuthentication()
hybrid.changeHeight(height, { animated })
```

Under the hood these actions are called using the following method, which can also be used directly in case you need to call an action that is not available as a method:

```
hybrid.call(method, options)
```

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
