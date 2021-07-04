class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distanceBetweenTwoPoints(point1, point2) {
        const lengthX = point2.x - point1.x;
        const lengthY = point2.y - point1.y;
        return Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2));
    }

    static angleBetweenTwoPoints(point1, point2) {
        const lengthX = point2.x - point1.x;
        const lengthY = point2.y - point1.y;
        return Math.atan2(lengthY, lengthX);
    }

    toString() {
        return `${this.x},${this.y}`;
    }
}

function generateSvgPath(points) {
    let path = "";
    let startControlPoint;
    let endControlPoint;
    points.forEach((point, i) => {
        if (i !== 0) {
            startControlPoint = generateControlPoint(points[i - 1], points[i - 2], point, false);
            endControlPoint = generateControlPoint(point, points[i - 1], points[i + 1], true);
            path += `C ${startControlPoint} ${endControlPoint} ${point} `;
            return;
        }
        path += `M ${point} `;
    })
    return path;
}

const generateControlPoint = (current, previous, next, reverse) => {
    const p = previous || current;
    const n = next || current;
    const smoothing = 0.1;
    const angle = Point.angleBetweenTwoPoints(p, n) + (reverse ? Math.PI : 0);
    const distance = Point.distanceBetweenTwoPoints(p, n) * smoothing;
    const x = current.x + Math.cos(angle) * distance;
    const y = current.y + Math.sin(angle) * distance;
    return new Point(x, y);
}

function generatePathData(steps, power) {
    let data = [];
    for (let i = 0; i <= steps; i++) {
        const x = 2 * ((i / steps) - 0.5);
        const y = Math.pow(x, power);
        data.push(new Point((i / steps), (1 - y) / 2));
    }
    return data;
}

const addPathDataToSvg = (data) => {
    return generateSvgPath(data);
}

const initialData = generatePathData(24, 1);
const graphLine = document.querySelector("#main-line");
const slider = document.getElementById("power-slider");
const sliderText = document.getElementById("slider-number");

graphLine.setAttribute("d", addPathDataToSvg(initialData));

slider.oninput = function () {
    sliderText.innerHTML = slider.value;
    const userModifiedData = generatePathData(24, slider.value);
    graphLine.setAttribute("d", addPathDataToSvg(userModifiedData));
}