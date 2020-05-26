import {Q} from './q-sock';
import axios from 'axios'

let Sock = Q;

let shareFacebook = async function(title, description, generatorUrl, redirectUrl, domain, shareObject ){

    // Detect Safari 
    let safariAgent = navigator.userAgent.indexOf("Safari") > -1; 
    let chromeAgent = navigator.userAgent.indexOf("Chrome") > -1; 


    // Discard Safari since it also matches Chrome 
    if ((chromeAgent) && (safariAgent)) safariAgent = false; 


    let response;

    
    response =  await axios({
        url: 'https://dba1du5ckc.execute-api.eu-west-3.amazonaws.com/prod/',
        method: 'post',
        data: {
                title: title,
                description: description,
                image_generator: {
                width: 1200,
                height: 630,
                url: generatorUrl,
                payload: shareObject
                },
                redirect_url: redirectUrl,
                domain: domain
                }
        })

        let slicedUrl = response.data.url.slice(8)
        if(window.isLoadedViaAppBrowser){
           hybrid.call('navigateTo', {url: `https://www.facebook.com/sharer/sharer.php?u=https%3A//${slicedUrl}`, inApp: false}) 
        } else {
             if (window.location !== window.parent.location){
                if(window.webkit || window.Android){
                    window.parent.location = `https://www.facebook.com/sharer/sharer.php?u=https%3A//${slicedUrl}`;
                }
             
            }
            if(!safariAgent){
                window.open(`https://www.facebook.com/sharer/sharer.php?u=https%3A//${slicedUrl}`);
            } else {
                window.location = `https://www.facebook.com/sharer/sharer.php?u=https%3A//${slicedUrl}`
            }
        }
}

let shareInstagram = async function(generatorUrl, shareObject){

    // Detect Safari 
    let safariAgent = navigator.userAgent.indexOf("Safari") > -1; 
    let chromeAgent = navigator.userAgent.indexOf("Chrome") > -1; 


    // Discard Safari since it also matches Chrome 
    if ((chromeAgent) && (safariAgent)) safariAgent = false; 


    let response;

    
    response =  await axios({
        url: 'https://dba1du5ckc.execute-api.eu-west-3.amazonaws.com/prod/',
        method: 'post',
        data: {
                title: 'Instagram',
                description: 'Description',
                image_generator: {
                width: 1080,
                height: 1920,
                url: generatorUrl,
                payload: shareObject
                },
                redirect_url: 'Redirect',
                domain: 'qmusic.be'
                }
        })

        if(window.isLoadedViaAppBrowser){
            hybrid.call('navigateTo', {url: response.data.image, inApp: false}) 
          } else {
              if (window.location !== window.parent.location){
                  if(window.webkit || window.Android){
                      window.parent.location = response.data.image;
                  }
               
              }
  
              if(!safariAgent){
                  window.open(response.data.image);
              } else {
                  window.location = response.data.image
              }
          }
}

/*let shareInstagram = async function(title, description, generatorUrl, redirectUrl, domain, shareObject ){

        // Detect Safari 
        let safariAgent = navigator.userAgent.indexOf("Safari") > -1; 
        let chromeAgent = navigator.userAgent.indexOf("Chrome") > -1; 


        // Discard Safari since it also matches Chrome 
        if ((chromeAgent) && (safariAgent)) safariAgent = false; 

    let response
    
    response =  await axios({
        url: 'https://dba1du5ckc.execute-api.eu-west-3.amazonaws.com/prod/',
        method: 'post',
        data: {
                title: "Hier komt share titel",
                description: "Swipe hier jouw nummer 1!",
                image_generator: {
                width: 1080,
                height: 1920,
                url: "https://static.qmusic.be/acties/swipe_10s_share/insta/index2.html",
                payload: {tracks: this.shareObj}
                },
                redirect_url: "https://www.qmusic.be/nieuws/jij-bepaalt-de-volgorde-van-de-top-10-tindergewijs?s=5t_GTg",
                domain: "qmusic.be"
                }
        })
        this.isLoadingInsta = false

        this.sendGtmShare("Instagram", this.shareObj[0])

         if(window.isLoadedViaAppBrowser){
          hybrid.call('navigateTo', {url: response.data.image, inApp: false}) 
        } else {
            if (window.location !== window.parent.location){
                if(window.webkit || window.Android){
                    window.parent.location = response.data.image;
                }
             
            }

            if(!this.safariAgent){
                window.open(response.data.image);
            } else {
                window.location = response.data.image
            }
        }

}*/

export {Sock, shareFacebook, shareInstagram};


/*
module.exports.fillText = function(text, div, lineCount, mobile) {
    const style = window.getComputedStyle(div)
    const width = (parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)) * 0.95
    const height = (parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)) * 0.95
    const words = text.split(' ')

    let bestLines = []
    let bestDifference;

    let splitLines = (text, lines, begin = [], total = []) => {
        if (lines == 1) {
            const parts = begin.concat(text)
            const partObjs = []
            let total = 0.0
            let difference = 0.0
            for (const part of parts) {
                const width = measureText(part, div).width
                partObjs.push({width: width, part: part})
                total += width
            }

            for (const {width} of partObjs) {
                difference += Math.abs(width - (total / parts.length))
            }

            if (!bestDifference || bestDifference > difference) {
                bestDifference = difference;
                bestLines = partObjs;
            }
        }

        for (let i = text.indexOf(' '); i != -1; i = text.indexOf(' ', i+1)) {
            let part = text.slice(0, i)
            splitLines(text.slice(i+1), lines - 1, begin.concat(part), total)
        }
    }

    splitLines(text, lineCount)

    let html = ""
    for(const part of bestLines) {
        const fontSize = width / (part.width / 70)
        html += `<span style="font-size: ${fontSize}px; display: inline-block; line-height: 0.8">${part.part}</span>`
    }

    div.innerHTML = `<div style="position: relative">${html}</div>`
    const divHeight = (div.children[0].offsetHeight + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)) * 0.9
    const boxHeight = mobile ? 1050 : 700
    const startHeight = mobile ? 181 : 42
    div.style.height = divHeight + 'px'
    div.style.top = startHeight + (boxHeight - divHeight) / 2 + 'px'
}

let measuringDiv;
function measureText(text, target) {
    if (!measuringDiv) {
        measuringDiv = document.createElement('div');
        measuringDiv.style.fontSize = "70px";
        measuringDiv.style.position = "absolute";
        measuringDiv.style.top = '-999px';
        measuringDiv.style.left = '-999px';
        document.body.appendChild(measuringDiv);
    }

    const style = getComputedStyle(target);
    measuringDiv.style.fontFamily = style.fontFamily;
    measuringDiv.style.textTransform = style.textTransform;
    measuringDiv.style.letterSpacing = style.letterSpacing;
    measuringDiv.style.fontWeight = style.fontWeight;


    measuringDiv.innerText = text;
    return {
        width: measuringDiv.offsetWidth,
        height: measuringDiv.offsetHeight
    }
}
*/
