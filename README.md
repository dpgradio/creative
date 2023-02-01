# Q-Creative

## CSS: Fonts and Colors

Note that version 5 of this package provides fonts and colors as pure css.
The variables and fonts are no longer available as scss variables/imports.

Example:

```css
@import "q-creative/styles/colors/qmusic";
@import "q-creative/styles/fonts/qmusic";

body, html {
  background-color: rgb(var(--q-teal));
  color: rgb(var(--q-grey) / 0.8);
  font-family: 'QMarkMyWords';
}
```

## Sharing Generator

Example:

```js
import { Shareable, ImageGeneratorProperties } from 'q-creative/share'

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
