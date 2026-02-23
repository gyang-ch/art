// RESONATOR RIBBON (AIZAWA ATTRACTOR)
let art12PG = null;
let art12Ribbons = [];
let art12GlobalTime = 0;

const art12NumRibbons = 120;
const art12Dt = 0.02;
const art12Pop = 150;
const art12Wop = (Math.PI * 2) / art12Pop;
const art12Speed = 1.8;

class Artwork12Ribbon {
  constructor(index) {
    this.index = index;

    const startX = 0.1 + random(-0.1, 0.1);
    const startY = random(-0.1, 0.1);
    const startZ = random(-0.1, 0.1);

    this.posA = createVector(startX, startY, startZ);
    this.posB = createVector(startX + 0.001, startY + 0.001, startZ + 0.001);

    this.param = { a: 0.95, b: 0.7, c: 0.6, d: 3.5, e: 0.25, f: 0.1 };
    this.historyA = [];
    this.historyB = [];
    this.maxHistory = int(random(40, 70));
  }

  calculateNext(pos) {
    const dx = (pos.z - this.param.b) * pos.x - this.param.d * pos.y;
    const dy = this.param.d * pos.x + (pos.z - this.param.b) * pos.y;

    const z3 = pos.z * pos.z * pos.z;
    const x3 = pos.x * pos.x * pos.x;
    const xySq = pos.x * pos.x + pos.y * pos.y;

    const dz =
      this.param.c +
      this.param.a * pos.z -
      z3 / 3 +
      -xySq * (1 + this.param.e * pos.z) +
      this.param.f * pos.z * x3;

    return createVector(pos.x + dx * art12Dt, pos.y + dy * art12Dt, pos.z + dz * art12Dt);
  }

  update() {
    this.posA = this.calculateNext(this.posA);
    this.posB = this.calculateNext(this.posB);

    // Keep ribbons alive
    if (
      !Number.isFinite(this.posA.x) || !Number.isFinite(this.posA.y) || !Number.isFinite(this.posA.z) ||
      !Number.isFinite(this.posB.x) || !Number.isFinite(this.posB.y) || !Number.isFinite(this.posB.z)
    ) {
      const startX = 0.1 + random(-0.1, 0.1);
      const startY = random(-0.1, 0.1);
      const startZ = random(-0.1, 0.1);
      this.posA.set(startX, startY, startZ);
      this.posB.set(startX + 0.001, startY + 0.001, startZ + 0.001);
      this.historyA.length = 0;
      this.historyB.length = 0;
      return;
    }

    this.historyA.push(this.posA.copy());
    this.historyB.push(this.posB.copy());

    if (this.historyA.length > this.maxHistory) {
      this.historyA.shift();
      this.historyB.shift();
    }
  }

  display(pg, t, globalOpacityMult) {
    let hueVal = (220 + 100 * sin(t * 1.5 + this.index * 0.02)) % 360;
    if (hueVal < 0) hueVal += 360;

    pg.strokeWeight(1.0);
    pg.noFill();
    pg.beginShape(LINES);

    for (let i = 1; i < this.historyA.length; i++) {
      const a1 = this.historyA[i];
      const b1 = this.historyB[i];
      const a0 = this.historyA[i - 1];
      const b0 = this.historyB[i - 1];

      const ageRatio = i / this.historyA.length;
      const localAlpha = ageRatio * ageRatio * 0.7;
      const finalAlpha = localAlpha * globalOpacityMult;
      pg.stroke(hueVal, 85, 100, finalAlpha);

      pg.vertex(a1.x, a1.y, a1.z);
      pg.vertex(b1.x, b1.y, b1.z);

      pg.vertex(a1.x, a1.y, a1.z);
      pg.vertex(a0.x, a0.y, a0.z);

      pg.vertex(b1.x, b1.y, b1.z);
      pg.vertex(b0.x, b0.y, b0.z);
    }

    pg.endShape();
  }
}

function initAizawa() {
  art12PG = createGraphics(windowWidth, windowHeight, WEBGL);
  art12PG.colorMode(HSB, 360, 100, 100, 1.0);
  art12PG.blendMode(ADD);

  art12Ribbons = [];
  art12GlobalTime = 0;

  for (let i = 0; i < art12NumRibbons; i++) {
    art12Ribbons.push(new Artwork12Ribbon(i));
  }

  // Warm-up
  for (let n = 0; n < 70; n++) {
    for (let i = 0; i < art12Ribbons.length; i++) {
      art12Ribbons[i].update();
    }
  }
}

function drawAizawa() {
  if (!art12PG) initAizawa();

  const pg = art12PG;
  const rotationFactor = reducedMotion ? 0.45 : 1;
  const opacityPulse = map(sin(art12GlobalTime * art12Wop), -1, 1, 0.4, 1.0);
  const scaleAmount = min(width, height) * 0.3;

  pg.background(5, 5, 10);
  pg.orbitControl(4, 4, 0.1);
  pg.push();
  pg.rotateY(art12GlobalTime * 0.15 * rotationFactor);
  pg.rotateX(art12GlobalTime * 0.05 * rotationFactor);
  pg.rotateZ(art12GlobalTime * 0.02 * rotationFactor);
  pg.scale(scaleAmount);

  for (let i = 0; i < art12Ribbons.length; i++) {
    art12Ribbons[i].update();
    art12Ribbons[i].display(pg, art12GlobalTime, opacityPulse);
  }

  pg.pop();
  art12GlobalTime += 0.02 * art12Speed * motionFactor;
  image(pg, 0, 0, width, height);
}
