// SCRIBBLE GRID
let scribbleCells = [];
let scribbleTextureDots = [];
let scribbleTextureFibers = [];
let scribbleSettings = {
  density: 120,
  texture: 3000,
  tilt: 1,
  opacity: 36
};

function clampNumber(value, minValue, maxValue) {
  return min(max(Number(value) || 0, minValue), maxValue);
}

function setScribbleGridParams(next = {}) {
  if (typeof next.density !== "undefined") {
    scribbleSettings.density = floor(clampNumber(next.density, 40, 260));
  }
  if (typeof next.texture !== "undefined") {
    scribbleSettings.texture = floor(clampNumber(next.texture, 300, 12000));
  }
  if (typeof next.tilt !== "undefined") {
    scribbleSettings.tilt = clampNumber(next.tilt, 0.6, 1.6);
  }
  if (typeof next.opacity !== "undefined") {
    scribbleSettings.opacity = floor(clampNumber(next.opacity, 16, 70));
  }
}

function getScribbleGridParams() {
  return {
    density: scribbleSettings.density,
    texture: scribbleSettings.texture,
    tilt: scribbleSettings.tilt,
    opacity: scribbleSettings.opacity
  };
}

window.setScribbleGridParams = setScribbleGridParams;
window.getScribbleGridParams = getScribbleGridParams;

function getRandomPerimeterPoint(halfSide) {
  const side = floor(random(4));
  let x = 0;
  let y = 0;

  if (side === 0) {
    x = random(-halfSide, halfSide);
    y = -halfSide;
  } else if (side === 1) {
    x = halfSide;
    y = random(-halfSide, halfSide);
  } else if (side === 2) {
    x = random(-halfSide, halfSide);
    y = halfSide;
  } else {
    x = -halfSide;
    y = random(-halfSide, halfSide);
  }

  return { x, y };
}

function initScribble() {
  scribbleCells = [];
  scribbleTextureDots = [];
  scribbleTextureFibers = [];

  const cols = 8;
  const rows = 8;
  const dim = min(width, height);
  const gridSize = dim * 0.86;
  const cellSize = gridSize / cols;
  const shapeSize = cellSize * 1.15;
  const offsetX = (width - gridSize) * 0.5;
  const offsetY = (height - gridSize) * 0.5;
  const scribbleDensity = scribbleSettings.density;
  const jitterAmount = 1.85;
  const angleRange = 0.2;
  const textureEnergy = map(scribbleSettings.texture, 300, 12000, 0.25, 1);

  for (let i = 0; i < scribbleSettings.texture; i++) {
    scribbleTextureDots.push({
      x: random(width),
      y: random(height),
      r: random(0.35, 2.35),
      alpha: random(28, 70) * textureEnergy
    });
  }

  const fiberCount = floor(lerp(18, 260, textureEnergy));
  for (let i = 0; i < fiberCount; i++) {
    const len = random(8, 42);
    const ang = random(TWO_PI);
    scribbleTextureFibers.push({
      x: random(width),
      y: random(height),
      x2: cos(ang) * len,
      y2: sin(ang) * len,
      alpha: random(10, 40) * textureEnergy
    });
  }

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const posX = offsetX + gx * cellSize + cellSize * 0.5;
      const posY = offsetY + gy * cellSize + cellSize * 0.5;
      const baseAngle = random(-angleRange, angleRange);
      const segments = [];
      const half = shapeSize * 0.5;

      for (let i = 0; i < scribbleDensity; i++) {
        const p1 = getRandomPerimeterPoint(half);
        const p2 = getRandomPerimeterPoint(half);
        segments.push({
          x1: p1.x + random(-jitterAmount, jitterAmount),
          y1: p1.y + random(-jitterAmount, jitterAmount),
          x2: p2.x + random(-jitterAmount, jitterAmount),
          y2: p2.y + random(-jitterAmount, jitterAmount)
        });
      }

      scribbleCells.push({
        x: posX,
        y: posY,
        baseAngle,
        side: shapeSize,
        segments
      });
    }
  }
}

function drawScribble() {
  background(242, 238, 225);

  noStroke();
  fill(220, 215, 200, 160);
  for (let d of scribbleTextureDots) {
    fill(210, 205, 190, d.alpha);
    circle(d.x, d.y, d.r);
  }
  fill(255, 255, 255, 18);
  for (let i = 0; i < floor(scribbleTextureDots.length * 0.3); i++) {
    const d = scribbleTextureDots[i];
    circle(d.x + random(-0.6, 0.6), d.y + random(-0.6, 0.6), d.r * 0.7);
  }

  stroke(166, 156, 138, 24);
  strokeWeight(0.7);
  for (let f of scribbleTextureFibers) {
    stroke(166, 156, 138, f.alpha);
    line(f.x, f.y, f.x + f.x2, f.y + f.y2);
  }

  noFill();
  strokeWeight(0.8);

  for (let cell of scribbleCells) {
    const angle = cell.baseAngle * scribbleSettings.tilt;
    push();
    translate(cell.x, cell.y);
    rotate(angle);

    stroke(40, 40, 45, scribbleSettings.opacity);
    for (let seg of cell.segments) {
      line(seg.x1, seg.y1, seg.x2, seg.y2);
    }

    strokeWeight(0.5);
    stroke(40, 40, 45, 30);
    rectMode(CENTER);
    rect(0, 0, cell.side, cell.side);
    strokeWeight(0.8);
    pop();
  }
}
