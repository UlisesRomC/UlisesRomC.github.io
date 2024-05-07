function setup() {
    createCanvas(1000, 500);
    stroke(0);
    fill(255);
    background(200);

    const r = 100;
    const x0 = 200;
    const y0 = height / 2;

    const x1 = 450;
    const y1 = height / 2;

    const x2 = 700;
    const y2 = height / 2;

    drawCircleMidpoint(r, x0, y0, color(255, 0, 0));
    drawCircleMidpoint(r, x1, y1, color(60, 125, 34));
    drawCircleMidpoint(r, x2, y2, color(0, 0, 255));
}

function draw() {
    //El background es por un fallo que no pude solucionar, en el que el tercer relog no borraba
    //las manecillas al actualizarce
    background(200);
    const x0 = 200;
    const y0 = height / 2;
    const r = 100;
    const x1 = 450, y1 = height / 2;
    const x2 = 700;
    const y2 = height / 2;

   
    fill(200);
    noStroke();
    ellipse(x0, y0, 2 * r, 2 * r);
    ellipse(x1, y1, 2 * r, 2 * r);
    stroke(0);

    drawCircleMidpoint(r, x0, y0, color(255, 0, 0));
    drawCircleMidpoint(r, x1, y1, color(60, 125, 34));
    drawCircleMidpoint(r, x2, y2, color(0, 0, 255));

    let h = hour();
    let m = minute();
    let s = second();

    //Me falló y los hice en un orden diferente para cada relog, por si eso afecta la calificación en algo.
    // Bresenham
    drawHand(x0, y0, r, (h % 12 + m / 60) * 30, r * 0.5, color(0, 0, 255)); // Hora
    drawHand(x0, y0, r, m * 6, r * 0.8, color(60, 125, 34)); // Minuto
    drawHand(x0, y0, r, s * 6, r * 0.9, color(255, 0, 0)); // Segundo

    // DDA
    drawHandDDA(x1, y1, r, ((h + 1) % 12 + m / 60) * 30, r * 0.5, color(0, 0, 255)); 
    drawHandDDA(x1, y1, r, m * 6, r * 0.8, color(60, 125, 34)); 
    drawHandDDA(x1, y1, r, s * 6, r * 0.9, color(255, 0, 0)); 


    // Punto pendiente
    //No funciona poniendo la hora directamente, tuve que hacer una variable.
    let hThird = (h + 9) % 12;
    drawHandEquation(x2, y2, r, hThird * 30 + m / 2, r * 0.5, color(0, 0, 255)); 
    drawHandEquation(x2, y2, r, m * 6, r * 0.8, color(60, 125, 34)); 
    drawHandEquation(x2, y2, r, s * 6, r * 0.9, color(255, 0, 0)); 


    // Pintar las horas en los relojes
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    for (let i = 1; i <= 12; i++) {
        let angle = radians((i * 30) - 90); 
        let x = x0 + (r * 0.85) * cos(angle);
        let y = y0 + (r * 0.85) * sin(angle);
        text(i, x, y);
    }

    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    for (let i = 1; i <= 12; i++) {
        let angle = radians((i * 30) - 90); 
        let x = x1 + (r * 0.85) * cos(angle);
        let y = y1 + (r * 0.85) * sin(angle);
        text(i, x, y);
    }

   
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    for (let i = 1; i <= 12; i++) {
        let angle = radians((i * 30) - 90); 
        let x = x2 + (r * 0.85) * cos(angle);
        let y = y2 + (r * 0.85) * sin(angle);
        text(i, x, y);
    }
}

function drawHand(xc, yc, r, angle, length, handColor) {
    angle = radians(angle - 90);
    let x2 = xc + length * cos(angle);
    let y2 = yc + length * sin(angle);
    drawLineBresenham(xc, yc, x2, y2, handColor);
}

function drawLineBresenham(x1, y1, x2, y2, color) {
    stroke(color);
    let dx = x2 - x1;
    let dy = y2 - y1;
    let steps = max(abs(dx), abs(dy));
    let xIncrement = dx / steps;
    let yIncrement = dy / steps;
    let x = x1;
    let y = y1;

    for (let i = 0; i <= steps; i++) {
        point(round(x), round(y));
        x += xIncrement;
        y += yIncrement;
    }
}

function drawHandDDA(xc, yc, r, angle, length, handColor) {
    angle = radians(angle - 90);
    let x2 = xc + length * cos(angle);
    let y2 = yc + length * sin(angle);
    drawLineDDA(xc, yc, x2, y2, handColor);
}

function drawLineDDA(x1, y1, x2, y2, color) {
    stroke(color);
    let dx = x2 - x1;
    let dy = y2 - y1;
    let steps = Math.max(Math.abs(dx), Math.abs(dy));
    let xIncrement = dx / steps;
    let yIncrement = dy / steps;
    let x = x1;
    let y = y1;

    for (let i = 0; i <= steps; i++) {
        point(round(x), round(y));
        x += xIncrement;
        y += yIncrement;
    }
}

function drawCircleMidpoint(r, xc, yc, circleColor) {
    stroke(circleColor);
    for (let x = 0; x <= r / sqrt(2); x++) {
        let y = round(sqrt(r * r - x * x));

        for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
                point(xc + i * x, yc + j * y);
                point(xc + i * y, yc + j * x);
            }
        }
    }
}

function drawHandEquation(xc, yc, r, angle, length, handColor) {
    angle = radians(angle - 90);
    let x2 = xc + length * cos(angle);
    let y2 = yc + length * sin(angle);
    drawLineEquation(xc, yc, x2, y2, handColor);
}

function drawLineEquation(x1, y1, x2, y2, color) {
    stroke(color);
    let m = (y2 - y1) / (x2 - x1); // Calcular la pendiente
    let b = y1 - m * x1; // Calcular la intersección en y

    let x, y;
    if (abs(x2 - x1) >= abs(y2 - y1)) {
        let startX = min(x1, x2);
        let endX = max(x1, x2);
        for (x = startX; x <= endX; x++) {
            y = m * x + b;
            point(round(x), round(y));
        }
    } else {
        let startY = min(y1, y2);
        let endY = max(y1, y2);
        for (y = startY; y <= endY; y++) {
            x = (y - b) / m;
            point(round(x), round(y));
        }
    }
}
