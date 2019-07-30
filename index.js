//var Q = require('q-sock');

//exports.Q = Q;

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
