###### This is the Creative Method Library for Qmusic.

**For fonts:**

   In scss stylesheet:

   Qmusic: **@import "~q-creative/q-styles/q-fonts"**
   
   Joe: **@import "~q-creative/q-styles/joe-fonts"**
   
   Willy: **@import "~q-creative/q-styles/willy-fonts"**



**For socket:** 


First:
        import { Sock } from 'q-creative'
    
Then:
        window.qSocketLoaded = qSocketLoaded(Sock);
        function qSocketLoaded (Q) {
            var q = Q.connect('yourChannel')
            q.subscribe('plays').on('play', yourFunction, {backlog: 1});
        }


**Sharing Generator**

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
        
