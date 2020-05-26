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

First:
        import { shareFacebook, shareInstagram } from 'q-creative'
    
Then:
        

        await shareFacebook(
                'title', 
                'desc', 
                'https://static.qmusic.be/acties/swipe_10s_share/fb/index1.html', 
                "https://www.qmusic.be/nieuws/jij-bepaalt-de-volgorde-van-de-top-10-tindergewijs?s=5t_GTg",
                "qmusic.be",
                payload
        )

        await shareInstagram(
                'https://static.qmusic.be/acties/swipe_10s_share/insta/index2.html', 
                "https://www.qmusic.be/nieuws/jij-bepaalt-de-volgorde-van-de-top-10-tindergewijs?s=5t_GTg",
                'qmusic.be',
                payload
        )   
        