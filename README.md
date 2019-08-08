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
