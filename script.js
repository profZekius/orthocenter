const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let points = [
    { x: 150, y: 450 },
    { x: 400, y: 150 },
    { x: 650, y: 450 }
];

let draggingPoint = null;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw points
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    });
}

function getAltitude(p1, p2, p3) {
    const slope = (p2.y - p1.y) / (p2.x - p1.x);
    const perpendicularSlope = -1 / slope;

    const x4 = (p3.y - p1.y - perpendicularSlope * p3.x + slope * p1.x) / (slope - perpendicularSlope);
    const y4 = slope * (x4 - p1.x) + p1.y;

    return { x: x4, y: y4 };
}

function getIntersection(p1, p2, p3, p4) {
    const den = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (den === 0) return null;

    const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / den;
    const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / den;

    if (t > 0 && t < 1 && u > 0) {
        return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
    }
    return null;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const [A, B, C] = points;

    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Altitudes
    const altA_foot = getAltitude(B, C, A);
    const altB_foot = getAltitude(A, C, B);
    const altC_foot = getAltitude(A, B, C);

    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(altA_foot.x, altA_foot.y);
    ctx.strokeStyle = 'green';
    ctx.setLineDash([5, 5]);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(B.x, B.y);
    ctx.lineTo(altB_foot.x, altB_foot.y);
    ctx.strokeStyle = 'green';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(C.x, C.y);
    ctx.lineTo(altC_foot.x, altC_foot.y);
    ctx.strokeStyle = 'green';
    ctx.stroke();

    ctx.setLineDash([]);


    // Orthocenter
    const orthocenter = getIntersection(A, altA_foot, B, altB_foot);
    if (orthocenter) {
        ctx.beginPath();
        ctx.arc(orthocenter.x, orthocenter.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'purple';
        ctx.fill();
    }


    // Draw points
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    });
}

canvas.addEventListener('mousedown', e => {
    const mousePos = { x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop };
    points.forEach((p, i) => {
        const dist = Math.sqrt((mousePos.x - p.x)**2 + (mousePos.y - p.y)**2);
        if (dist < 10) {
            draggingPoint = i;
        }
    });
});

canvas.addEventListener('mousemove', e => {
    if (draggingPoint !== null) {
        const mousePos = { x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop };
        points[draggingPoint].x = mousePos.x;
        points[draggingPoint].y = mousePos.y;
        draw();
    }
});

canvas.addEventListener('mouseup', () => {
    draggingPoint = null;
});

draw();
