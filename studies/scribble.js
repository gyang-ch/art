// STUDY 8: ROTATED SCRIBBLE GRID
let scribbleCells = [];
let scribbleTextureDots = [];
let scribbleSettings = {
  randomness: 0.55,
  density: 120,
  texture: 3000
};

function clampNumber(value, minValue, maxValue) {
  return min(max(Number(value) || 0, minValue), maxValue);
}

function setScribbleGridParams(next = {}) {
  if (typeof next.randomness !== "undefined") {
    scribbleSettings.randomness = clampNumber(next.randomness, 0, 1);
  }
  if (typeof next.density !== "undefined") {
    scribbleSettings.density = floor(clampNumber(next.density, 40, 260));
  }
  if (typeof next.texture !== "undefined") {
    scribbleSettings.texture = floor(clampNumber(next.texture, 300, 6000));
  }
}

function getScribbleGridParams() {
  return {
    randomness: scribbleSettings.randomness,
    density: scribbleSettings.density,
    texture: scribbleSettings.texture
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

function initScribbleGridStudy() {
  scribbleCells = [];
  scribbleTextureDots = [];

  const cols = 8;
  const rows = 8;
  const dim = min(width, height);
  const gridSize = dim * 0.86;
  const cellSize = gridSize / cols;
  const shapeSize = cellSize * 1.15;
  const offsetX = (width - gridSize) * 0.5;
  const offsetY = (height - gridSize) * 0.5;
  const scribbleDensity = scribbleSettings.density;
  const randomnessLevel = scribbleSettings.randomness;
  const jitterAmount = lerp(0.25, 3.2, randomnessLevel);
  const angleRange = lerp(0.02, 0.32, randomnessLevel);

  for (let i = 0; i < scribbleSettings.texture; i++) {
    scribbleTextureDots.push({
      x: random(width),
      y: random(height),
      r: random(0.5, 1.5)
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

function drawScribbleGridStudy() {
  background(242, 238, 225);

  noStroke();
  fill(220, 215, 200, 100);
  for (let d of scribbleTextureDots) {
    circle(d.x, d.y, d.r);
  }

  const mouseInfluence = constrain(map(mouseX, 0, width, 0.8, 1.35), 0.8, 1.35);
  const lineAlpha = map(mouseY, 0, height, 45, 28);

  noFill();
  strokeWeight(0.8);

  for (let cell of scribbleCells) {
    const angle = cell.baseAngle * mouseInfluence;
    push();
    translate(cell.x, cell.y);
    rotate(angle);

    stroke(40, 40, 45, lineAlpha);
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
