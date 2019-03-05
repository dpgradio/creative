exports.printMsg = function(){
    console.log("This library works");
};

exports.loadFontsJoe = function(){
    var geomanist_font_200 = new FontFace('geomanist', 'url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-light-webfont.eot?") format("eot"),url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-light-webfont.woff2") format("woff2"),url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-light-webfont.woff") format("woff")', { style: 'normal', weight: 200 });
    geomanist_font_200.load().then(function(loaded_face) {
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = '"geomanist", Helvetica, Arial, sans-serif';
    }).catch(function(error) {
        console.log("Geomanist 200 not loaded.");
    });

    var geomanist_font_300 = new FontFace('geomanist', 'url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-book-webfont.eot?") format("eot"),url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-book-webfont.woff2") format("woff2"),url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-book-webfont.woff") format("woff")', { style: 'normal', weight: 300 });
    geomanist_font_300.load().then(function(loaded_face) {
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = '"geomanist", Helvetica, Arial, sans-serif';
    }).catch(function(error) {
        console.log("Geomanist 300 not loaded.");
    });

    var geomanist_font_400 = new FontFace('geomanist', 'url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-regular-webfont.eot?") format("eot"),url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-regular-webfont.woff2") format("woff2"),url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-regular-webfont.woff") format("woff")', { style: 'normal', weight: 400 });
    geomanist_font_400.load().then(function(loaded_face) {
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = '"geomanist", Helvetica, Arial, sans-serif';
    }).catch(function(error) {
        console.log("Geomanist 400 not loaded.");
    });

    var geomanist_font_500 = new FontFace('geomanist', 'url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-medium-webfont.eot?") format("eot"),url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-medium-webfont.woff2") format("woff2"),url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-medium-webfont.woff") format("woff")', { style: 'normal', weight: 500 });
    geomanist_font_500.load().then(function(loaded_face) {
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = '"geomanist", Helvetica, Arial, sans-serif';
    }).catch(function(error) {
        console.log("Geomanist 500 not loaded.");
    });

    var geomanist_font_600 = new FontFace('geomanist', 'url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-bold-webfont.eot?") format("eot"),url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-bold-webfont.woff2") format("woff2"),url("https://static1.qmusic.medialaancdn.be/store/static/fonts/geomanist-bold-webfont.woff") format("woff")', { style: 'normal', weight: 600 });
    geomanist_font_600.load().then(function(loaded_face) {
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = '"geomanist", Helvetica, Arial, sans-serif';
    }).catch(function(error) {
        console.log("Geomanist 600 not loaded.");
    });

};

exports.loadFontsQ = function(){

    var cervo = new FontFace('Cervo', 'url(\'https://fonts.qmusic.be/cervo-light-webfont.eot\'), url(\'https://fonts.qmusic.be/cervo-light-webfont.eot?#iefix\') format(\'embedded-opentype\'),\n' +
        '        url(\'https://fonts.qmusic.be/cervo-light-webfont.woff2\') format(\'woff2\'),\n' +
        '        url(\'https://fonts.qmusic.be/cervo-light-webfont.woff\') format(\'woff\'),\n' +
        '        url(\'https://fonts.qmusic.be/cervo-light-webfont.ttf\') format(\'truetype\'),\n' +
        '        url(\'https://fonts.qmusic.be/cervo-light-webfont.svg#cervolight\') format(\'svg\')', { style: 'normal', weight: 400 });
    cervo.load().then(function(loaded_face) {
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = '"Cervo", Helvetica, Arial, sans-serif';
    }).catch(function(error) {
        // error occurred
        console.log("Cervo font not loaded.");
    });

    var cervo_medium = new FontFace('Cervo medium', 'url(\'https://fonts.qmusic.be/cervo-medium-webfont.eot\'), url(\'https://fonts.qmusic.be/cervo-medium-webfont.eot?#iefix\') format(\'embedded-opentype\'),\n' +
        '        url(\'https://fonts.qmusic.be/cervo-medium-webfont.woff2\') format(\'woff2\'),\n' +
        '        url(\'https://fonts.qmusic.be/cervo-medium-webfont.woff\') format(\'woff\'),\n' +
        '        url(\'https://fonts.qmusic.be/cervo-medium-webfont.ttf\') format(\'truetype\'),\n' +
        '        url(\'https://fonts.qmusic.be/cervo-medium-webfont.svg#cervolight\') format(\'svg\')', { style: 'normal', weight: 600 });
    cervo_medium.load().then(function(loaded_face) {
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = '"Cervo medium", Helvetica, Arial, sans-serif';
    }).catch(function(error) {
        // error occurred
        console.log("Cervo medium font not loaded.");
    });

    var qarla_normal = new FontFace('Qarla', 'url(\'https://fonts.qmusic.be/qarla-regular-webfont.eot\'), url(\'https://fonts.qmusic.be/qarla-regular-webfont.eot?#iefix\') format(\'embedded-opentype\')', { style: 'normal', weight: 'normal' });
    qarla_normal.load().then(function(loaded_face) {
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = '"Qarla", Helvetica, Arial, sans-serif';
    }).catch(function(error) {
        // error occurred
        console.log("Qarla normal font not loaded.");
    });

    var qarla_bold = new FontFace('Qarla', 'url(\'https://fonts.qmusic.be/qarla-bold-webfont.eot\'), url(\'https://fonts.qmusic.be/qarla-bold-webfont.eot?#iefix\') format(\'embedded-opentype\')', { style: 'normal', weight: 'bold' });
    qarla_bold.load().then(function(loaded_face) {
        document.fonts.add(loaded_face);
        document.body.style.fontFamily = '"Qarla", Helvetica, Arial, sans-serif';
    }).catch(function(error) {
        // error occurred
        console.log("Qarla bold font not loaded.");
    });

};

exports.fillText = function(text, div, lineCount, mobile) {
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