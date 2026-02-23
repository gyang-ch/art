// CONSTELLATION
let constellationNodes = [];
let constellationPG = null;
let constellationBounds = 0;
let constellationBurst = 0;
let constellationCursorInfluence = 0;

const constellationPalette = [
  [56, 225, 255],
  [154, 255, 108],
  [188, 124, 255],
  [255, 108, 205]
];

function pickPaletteColor(palette) {
  return palette[floor(random(palette.length))].slice();
}

function initConstellationWebGL() {
  constellationPG = createGraphics(windowWidth, windowHeight, WEBGL);
  constellationPG.colorMode(RGB, 255, 255, 255, 255);
}

function initConstellation() {
  initConstellationWebGL();
  constellationNodes = [];
  constellationBurst = 0;
  constellationCursorInfluence = 0;
  constellationBounds = min(width, height) * 0.62;

  let count = floor((width * height) / 6800);
  count = constrain(count, 90, 220);

  const half = constellationBounds * 0.5;

  for (let i = 0; i < count; i++) {
    constellationNodes.push({
      pos: createVector(
        random(-half, half),
        random(-half, half),
        random(-half, half)
      ),
      vel: p5.Vector.random3D().mult(random(0.45, 1.3)),
      acc: createVector(0, 0, 0),
      r: random(1.6, 3.8),
      phase: random(TWO_PI),
      color: pickPaletteColor(constellationPalette)
    });
  }
}

function triggerConstellationBurst() {
  constellationBurst = 1;
}

function drawConstellation() {
  if (!constellationPG || constellationNodes.length === 0) initConstellation();

  const pg = constellationPG;
  pg.background(8, 12, 24, 48);

  try {
    constellationBurst = max(0, constellationBurst - 0.045 * motionFactor);

    const time = frameCount * 0.018 * motionFactor;
    const cursorX = constrain(typeof winMouseX === "number" ? winMouseX : mouseX, 0, width);
    const cursorY = constrain(typeof winMouseY === "number" ? winMouseY : mouseY, 0, height);
    const centerDistance = dist(cursorX, cursorY, width * 0.5, height * 0.5);
    const maxCenterDistance = dist(0, 0, width * 0.5, height * 0.5);
    const cursorTarget = constrain(centerDistance / maxCenterDistance, 0, 1);
    constellationCursorInfluence = lerp(constellationCursorInfluence, cursorTarget, 0.35);

    const breathWave = sin(time * 5.6);
    const breathBase = lerp(0.94, 1.2, constellationCursorInfluence);
    const breathExpandAmp = lerp(0.03, 0.4, constellationCursorInfluence);
    const breathShrinkAmp = lerp(0.015, 0.12, constellationCursorInfluence);
    const breath = breathBase
      + (breathWave > 0 ? breathWave * breathExpandAmp : breathWave * breathShrinkAmp)
      + constellationBurst * 0.2;
    const maxDistance = lerp(82, 198, constellationCursorInfluence) + constellationBurst * 30;
    const repelDistance = lerp(18, 70, constellationCursorInfluence) + constellationBurst * 10;
    const repelPower = lerp(0.035, 0.36, constellationCursorInfluence);
    const lineAlphaMax = lerp(150, 210, constellationCursorInfluence) + constellationBurst * 28;
    const nodePulse = 0.82 + 0.3 * sin(time * 6.4);
    const interactionX = sin(time * 0.95) * 0.2;
    const interactionY = cos(time * 0.72) * 0.13;

    pg.push();
    pg.scale(breath);
    pg.rotateY(time * 0.24 + interactionX);
    pg.rotateX(time * 0.14 + interactionY);
    pg.strokeWeight(1.25);

    for (let i = 0; i < constellationNodes.length; i++) {
      const n = constellationNodes[i];
      n.acc.mult(0);
      n.acc.add(p5.Vector.mult(n.pos, -0.0007));
    }

  for (let i = 0; i < constellationNodes.length; i++) {
    for (let j = i + 1; j < constellationNodes.length; j++) {
      const a = constellationNodes[i];
      const b = constellationNodes[j];
      const delta = p5.Vector.sub(b.pos, a.pos);
      const d = delta.mag();

      if (d < maxDistance) {
        const closeness = 1 - d / maxDistance;
        const alpha = pow(closeness, 1.45) * lineAlphaMax;

        const r = (a.color[0] + b.color[0]) * 0.5;
        const g = (a.color[1] + b.color[1]) * 0.5;
        const bCol = (a.color[2] + b.color[2]) * 0.5;

        pg.stroke(r, g, bCol, alpha);
        pg.line(
          a.pos.x, a.pos.y, a.pos.z,
          b.pos.x, b.pos.y, b.pos.z
        );

        if (d < repelDistance && d > 0.0001) {
          const repelStrength = pow(1 - d / repelDistance, 1.3) * repelPower * motionFactor;
          delta.normalize().mult(repelStrength);
          a.acc.sub(delta);
          b.acc.add(delta);
        }
      }
    }
  }

    pg.noStroke();
    if (typeof pg.sphereDetail === "function") {
      pg.sphereDetail(5, 4);
    }

  const half = constellationBounds * 0.5;
  for (let i = 0; i < constellationNodes.length; i++) {
    const n = constellationNodes[i];
    const pulse = (0.82 + 0.3 * sin(time * 2 + n.phase)) * nodePulse;
    const radius = n.r * pulse;

    n.vel.add(n.acc);
    n.vel.limit(2.45);
    n.pos.add(n.vel);

    if (n.pos.x > half || n.pos.x < -half) {
      n.vel.x *= -1;
      n.pos.x = constrain(n.pos.x, -half, half);
    }
    if (n.pos.y > half || n.pos.y < -half) {
      n.vel.y *= -1;
      n.pos.y = constrain(n.pos.y, -half, half);
    }
    if (n.pos.z > half || n.pos.z < -half) {
      n.vel.z *= -1;
      n.pos.z = constrain(n.pos.z, -half, half);
    }

    pg.fill(
      min(255, n.color[0] + 24),
      min(255, n.color[1] + 24),
      min(255, n.color[2] + 24),
      170
    );
    pg.push();
    pg.translate(n.pos.x, n.pos.y, n.pos.z);
    pg.sphere(radius);
    pg.pop();
  }

    pg.pop();
    image(pg, 0, 0, width, height);
  } catch (err) {
    console.error("Constellation study error:", err);
    image(pg, 0, 0, width, height);
  }
}
