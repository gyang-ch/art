// STUDY 3: KINETIC BEZIER LOOM
let loomPoints = [];
let loomPG = null;

function initBezierLoomWebGL() {
  loomPG = createGraphics(windowWidth, windowHeight, WEBGL);
  loomPG.colorMode(RGB, 255, 255, 255, 255);
}

function drawBezierLoom() {
  if (!loomPG) initBezierLoomWebGL();
  loomPG.background(5, 5, 10);

  loomPoints = [];

  let dim = min(width, height);
  let spread = map(mouseY, 0, height, dim * 0.2, dim * 0.45);
  let density = map(mouseX, 0, width, 10, 60);
  density = floor(constrain(density, 5, 80));

  let numControlPoints = 12;
  let time = frameCount * 0.003 * motionFactor;

  loomPG.push();
  loomPG.rotateY(frameCount * 0.0045 * motionFactor);
  loomPG.rotateX(sin(frameCount * 0.003 * motionFactor) * 0.25);
  loomPG.noFill();
  loomPG.strokeWeight(0.8);

  for (let i = 0; i < numControlPoints; i++) {
    let angle = (TWO_PI / numControlPoints) * i + time;
    let r = spread + sin(time * 4 + i * 3) * (spread * 0.3);
    let x = r * cos(angle);
    let y = r * sin(angle * 1.5 + time);
    let z = r * sin(angle * 1.2 - time * 2.1) * 0.45;
    loomPoints.push(createVector(x, y, z));
  }

  for (let s = 0; s <= density; s++) {
    let tVal = s / density;
    drawRecursiveWeb3D(loomPG, loomPoints, tVal);
  }

  loomPG.pop();
  image(loomPG, 0, 0, width, height);
}

function drawRecursiveWeb3D(pg, points, tVal) {
  if (points.length === 1) return;

  let nextLevelPoints = [];
  let maxDepth = 12;
  let currentDepth = maxDepth - points.length;

  let r;
  let g;
  let b;

  if (currentDepth < maxDepth / 3) {
    r = map(currentDepth, 0, maxDepth / 3, 50, 150);
    g = map(currentDepth, 0, maxDepth / 3, 50, 0);
    b = 255;
  } else if (currentDepth < (maxDepth * 2) / 3) {
    r = 255;
    g = map(currentDepth, maxDepth / 3, (maxDepth * 2) / 3, 0, 50);
    b = map(currentDepth, maxDepth / 3, (maxDepth * 2) / 3, 255, 150);
  } else {
    r = map(currentDepth, (maxDepth * 2) / 3, maxDepth, 255, 0);
    g = 255;
    b = map(currentDepth, (maxDepth * 2) / 3, maxDepth, 150, 200);
  }

  pg.stroke(r, g, b, 40);
  pg.beginShape();

  for (let i = 0; i < points.length - 1; i++) {
    let p1 = points[i];
    let p2 = points[i + 1];
    pg.vertex(p1.x, p1.y, p1.z);
    pg.vertex(p2.x, p2.y, p2.z);

    let x = lerp(p1.x, p2.x, tVal);
    let y = lerp(p1.y, p2.y, tVal);
    let z = lerp(p1.z, p2.z, tVal);
    nextLevelPoints.push(createVector(x, y, z));
  }

  pg.endShape();
  drawRecursiveWeb3D(pg, nextLevelPoints, tVal);
}
