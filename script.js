


// Generate an svg path 
function generateSvgPath(data) {
    let svgPath = "";
    let startCP;
    let endCP;
    data.forEach((dot, i) => {
        if (i !== 0) {
            startCP = generateControlPoint(data[i - 1], data[i - 2], dot);
            endCP = generateControlPoint(dot, data[i - 1], data[i + 1], true);
        }
        svgPath += i === 0 ? 'M ' : 'C ';
        svgPath += i === 0 ? `${dot[0]},${dot[1]} ` : `${startCP.x},${startCP.y} ${endCP.x},${endCP.y} ${dot[0]},${dot[1]} `
    })

    return svgPath;
}

const line = (pointA, pointB) => {
    const lengthX = pointB[0] - pointA[0]
    const lengthY = pointB[1] - pointA[1]
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    }
}

const generateControlPoint = (current, previous, next, reverse) => {
    const p = previous || current
    const n = next || current
    const smoothing = 0.1
    const o = line(p, n)
    const angle = o.angle + (reverse ? Math.PI : 0)
    const length = o.length * smoothing
    const x = current[0] + Math.cos(angle) * length
    const y = current[1] + Math.sin(angle) * length
    return { x, y };
}

function generateData(steps, power) {
    let data = [];
    for (let i = 0; i <= steps; i++) {
        const x = 2 * ((i / steps) - 0.5);
        const y = Math.pow(x, power);
        data.push([(i / steps), (1 - y) / 2]);
    }
    return data;
}


const scale = 500;

const addLineDataToSVG = (data) => {
    // scale the data
    data = data.map(item => [item[0] * scale, item[1] * scale]);
    let line = generateSvgPath(data);
    return line;
}

const data = generateData(24, 1);
const graphLine = document.querySelector("#main-line");
const slider = document.getElementById("power-slider")
const sliderText = document.getElementById("slider-number")

slider.oninput = function () {
    sliderText.innerHTML = slider.value;
    const newData = generateData(24, slider.value);
    graphLine.setAttribute("d", addLineDataToSVG(newData));

}

graphLine.setAttribute("d", addLineDataToSVG(data));

