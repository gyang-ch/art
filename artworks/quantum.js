// QUANTUM HALVORSEN ATTRACTOR
let quantumPG = null;
let attractors = [];

let aParam = 1.8;
let dt = 0.005;

let camRotX = 0;
let camRotY = 0;
let camSpeed = 0.03;

function initQuantum() {
  quantumPG = createGraphics(windowWidth, windowHeight, WEBGL);
  quantumPG.colorMode(RGB, 255, 255, 255, 255);

  camRotX = 0;
  camRotY = 0;
  attractors = [];
  attractors.push(new HalvorsenTrail(1.0, 0, 0, color(0, 200, 255)));
  attractors.push(new HalvorsenTrail(1.001, 0, 0, color(255, 50, 150)));
  attractors.push(new HalvorsenTrail(1.002, 0, 0, color(150, 255, 100)));
}

function drawQuantum() {
  if (!quantumPG) initQuantum();

  if (keyIsDown(LEFT_ARROW)) camRotY -= camSpeed;
  if (keyIsDown(RIGHT_ARROW)) camRotY += camSpeed;
  if (keyIsDown(UP_ARROW)) camRotX -= camSpeed;
  if (keyIsDown(DOWN_ARROW)) camRotX += camSpeed;

  quantumPG.background(0, 0, 10, 50);
  quantumPG.push();
  quantumPG.rotateY(camRotY);
  quantumPG.rotateX(camRotX);

  let scaleFactor = min(width, height) * 0.018;
  quantumPG.scale(scaleFactor);

  for (let i = 0; i < attractors.length; i++) {
    attractors[i].update();
    attractors[i].display(quantumPG);
  }

  quantumPG.pop();
  image(quantumPG, 0, 0, width, height);
}

class HalvorsenTrail {
  constructor(startX, startY, startZ, baseColor) {
    this.x = startX;
    this.y = startY;
    this.z = startZ;
    this.baseColor = baseColor;
    this.points = [];
    this.maxPoints = 1500;
    this.speedMultiplier = 5;
  }

  update() {
    for (let i = 0; i < this.speedMultiplier; i++) {
      let dx = (-aParam * this.x - 4 * this.y - 4 * this.z - this.y * this.y) * dt;
      let dy = (-aParam * this.y - 4 * this.z - 4 * this.x - this.z * this.z) * dt;
      let dz = (-aParam * this.z - 4 * this.x - 4 * this.y - this.x * this.x) * dt;

      this.x += dx;
      this.y += dy;
      this.z += dz;

      this.points.push(createVector(this.x, this.y, this.z));
      if (this.points.length > this.maxPoints) this.points.shift();
    }
  }

  display(pg) {
    if (this.points.length === 0) return;

    pg.noFill();
    pg.strokeWeight(1.5);
    pg.beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      let fade = map(i, 0, this.points.length, 0, 255);
      pg.stroke(red(this.baseColor), green(this.baseColor), blue(this.baseColor), fade);
      pg.vertex(p.x, p.y, p.z);
    }
    pg.endShape();

    let head = this.points[this.points.length - 1];
    if (head) {
      pg.push();
      pg.translate(head.x, head.y, head.z);
      pg.noStroke();
      pg.fill(255, 255, 255, 230);
      let sphereSize = 4 / (min(width, height) * 0.015);
      pg.sphere(sphereSize);
      pg.pop();
    }
  }
}
