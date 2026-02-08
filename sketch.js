/**
 * Assignment 1: Advanced Generative Studies
 * FULLSCREEN IMMERSIVE EDITION
 */

let mode = 0; 

// Global State Variables
let t = 0; // Time iterator

// -- Variables for Study I (Maurer Rose) --
let n = 6; 
let d = 71; 

// -- Variables for Mode 4 (Bézier Loom) --
let loomPoints = []; 

// -- Variables for Mode 5 (Oscilloscope) --
let oscPoints = [];
let maxOscPoints = 800; // Increased for larger screens

// --- Scroll progress (0..1) from index.html ---
let scrollPos = 0;
window.setScrollProgress = function(p) { scrollPos = p; };

// -- Variables for Mode 6 & 7 --
let flyingRects = [];
let constellationNodes = [];
let rectColorShiftCooldown = 0;
let transitionPulse = 0;
let molnarCells = [];
let scribbleCells = [];
let scribbleTextureDots = [];
let loomPG = null;
let quantumPG = null;
let rectsPG = null;
let constellationPG = null;
let ribbonPG = null;
let ribbonTime = 0;
let art10PG = null;
let art10Dirty = true;
let reducedMotion = false;
let motionFactor = 1;

window.setTransitionPulse = function(v) {
  transitionPulse = constrain(v, 0, 1);
};

window.setReducedMotion = function(v) {
  reducedMotion = !!v;
  motionFactor = reducedMotion ? 0.45 : 1;
};

window.regenerateScribbleGrid = function() {
  initScribbleGridStudy();
};

window.regenerateMolnarStudy = function() {
  initMolnarQuadrilateralStudy();
};

window.regenerateArtwork10 = function() {
  art10Dirty = true;
};

function setup() {
  // CHANGED: Use windowWidth/windowHeight
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('canvas-container');
  
  // Initialize default mode
  changeMode(0);
}

// CHANGED: Handle browser resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Re-init logic if needed when resizing
  if (mode === 3) initBezierLoomWebGL();
  if (mode === 4) initQuantumWebGL();
  if (mode === 5) initFlyingRectangles();
  if (mode === 6) initConstellationSegments();
  if (mode === 7) initMolnarQuadrilateralStudy();
  if (mode === 8) initScribbleGridStudy();
  if (mode === 9) initRibbonSurfaceStudy();
  if (mode === 10) initArtwork10Study();
}

function draw() {
  if (mode === 0) {
    background(8);
  } else if (mode === 1) {
    drawMaurerRose();
  } else if (mode === 2) {
    drawRetroWave();
  } else if (mode === 3) {
    drawBezierLoom();
  } else if (mode === 4) {
    drawOscilloscope();
  } else if (mode === 5) {
    drawFlyingRectangles();
  } else if (mode === 6) {
    drawConstellationSegments();
  } else if (mode === 7) {
    drawMolnarQuadrilateralStudy();
  } else if (mode === 8) {
    drawScribbleGridStudy();
  } else if (mode === 9) {
    drawRibbonSurfaceStudy();
  } else if (mode === 10) {
    drawArtwork10Study();
  }

  drawTransitionOverlay();
}

function drawTransitionOverlay() {
  if (transitionPulse <= 0.001) return;

  push();
  resetMatrix();

  const ctx = drawingContext;
  const cx = width * 0.5 + (mouseX - width * 0.5) * 0.15;
  const cy = height * 0.5 + (mouseY - height * 0.5) * 0.15;
  const maxRadius = max(width, height) * 0.7;

  const glow = ctx.createRadialGradient(cx, cy, maxRadius * 0.08, cx, cy, maxRadius);
  glow.addColorStop(0, `rgba(255, 255, 255, ${0.16 * transitionPulse})`);
  glow.addColorStop(0.45, `rgba(0, 220, 255, ${0.1 * transitionPulse})`);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  pop();
}

// ==========================================================
// STUDY I: THE MAURER ROSE ENGINE
// ==========================================================
function drawMaurerRose() {
  background(10);
  translate(width / 2, height / 2);
  noFill();
  
  // CHANGED: Dynamic radius based on screen size
  let dim = min(width, height);
  let rBase = dim * 0.42; // 42% of the smallest screen dimension

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    n = floor(map(mouseX, 0, width, 2, 20));
    d = floor(map(mouseY, 0, height, 1, 180));
  }

  strokeWeight(1);
  stroke(0, 255, 200, 100); 
  beginShape();
  for (let i = 0; i < 361; i++) {
    let k = i * d;
    let r = rBase * sin(n * k); 
    let x = r * cos(k);
    let y = r * sin(k);
    vertex(x, y);
  }
  endShape();
  
  stroke(255, 50, 100, 200); 
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < 361; i++) {
    let k = i; 
    let r = rBase * sin(n * k);
    let x = r * cos(k);
    let y = r * sin(k);
    vertex(x, y);
  }
  endShape();

  resetMatrix();
  noStroke();
  fill(150);
  textAlign(LEFT, TOP);
  // Position text relative to safe area
  text(`Math: r = sin(n * k)\nn: ${n}\nd: ${d}`, 40, 100);
}

// ==========================================================
// STUDY II: KINETIC RETRO WAVE
// ==========================================================
function drawRetroWave() {
  noStroke();
  fill(0, 0, 20, 20);
  rect(0, 0, width, height);

  let distMouse = dist(mouseX, mouseY, width/2, height/2);
  let speedMult = map(distMouse, 0, width, 0.5, 3.0);

  translate(width / 2, height / 2);

  let dim = min(width, height);
  let radius = dim * 0.35;

  blendMode(ADD);

  for (let i = 0; i < 10; i++) {
    let offset = i * 0.5;
    let x1 = radius * sin((t + offset) / 4) * cos((t + offset) / 2);
    let y1 = radius * cos((t + offset) / 3);
    let x2 = radius * cos(t + offset) * sin(t + offset);
    let y2 = radius * sin((t + offset) * 1.5);

    // Light green to yellow range.
    let r = map(y1, -radius, radius, 145, 255);
    let g = map(x1, -radius, radius, 190, 255);
    let b = map(sin(t + offset), -1, 1, 35, 95);

    strokeWeight(2);
    stroke(r, g, b, 150);
    line(x1, y1, x2, y2);

    if (i > 0) {
      stroke(r, g, b, 55);
      line(x1, y1, x2, y2);
    }
  }

  t += 0.03 * speedMult * motionFactor;
  blendMode(BLEND);
}

// ==========================================================
// MODE 3: THE KINETIC BÉZIER LOOM
// ==========================================================
function initBezierLoomWebGL() {
  loomPG = createGraphics(windowWidth, windowHeight, WEBGL);
  loomPG.colorMode(RGB, 255, 255, 255, 255);
}

function drawBezierLoom() {
  if (!loomPG) initBezierLoomWebGL();
  loomPG.background(5, 5, 10);

  loomPoints = [];

  let dim = min(width, height);
  let spread = map(mouseY, 0, height, dim*0.2, dim*0.45);
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

function drawRecursiveWeb3D(pg, points, t) {
  if (points.length === 1) return; 

  let nextLevelPoints = [];
  let maxDepth = 12; 
  let currentDepth = maxDepth - points.length; 
  
  let r, g, b;
  
  if (currentDepth < maxDepth / 3) {
    r = map(currentDepth, 0, maxDepth/3, 50, 150);
    g = map(currentDepth, 0, maxDepth/3, 50, 0);
    b = 255;
  } else if (currentDepth < (maxDepth * 2)/3) {
    r = 255;
    g = map(currentDepth, maxDepth/3, (maxDepth*2)/3, 0, 50);
    b = map(currentDepth, maxDepth/3, (maxDepth*2)/3, 255, 150);
  } else {
    r = map(currentDepth, (maxDepth*2)/3, maxDepth, 255, 0);
    g = 255;
    b = map(currentDepth, (maxDepth*2)/3, maxDepth, 150, 200);
  }

  pg.stroke(r, g, b, 40);
  pg.beginShape();
  for (let i = 0; i < points.length - 1; i++) {
    let p1 = points[i];
    let p2 = points[i + 1];
    pg.vertex(p1.x, p1.y, p1.z);
    pg.vertex(p2.x, p2.y, p2.z);

    let x = lerp(p1.x, p2.x, t);
    let y = lerp(p1.y, p2.y, t);
    let z = lerp(p1.z, p2.z, t);
    nextLevelPoints.push(createVector(x, y, z));
  }
  pg.endShape();
  drawRecursiveWeb3D(pg, nextLevelPoints, t);
}


// ==========================================================
// MODE 4: QUANTUM OSCILLOSCOPE (3D LISSAJOUS)
// ==========================================================
function initQuantumWebGL() {
  quantumPG = createGraphics(windowWidth, windowHeight, WEBGL);
  quantumPG.colorMode(RGB, 255, 255, 255, 255);
}

function drawOscilloscope() {
  if (!quantumPG) initQuantumWebGL();
  quantumPG.background(0, 0, 10, 28);

  let freqMod = map(mouseX, 0, width, 1, 5);
  let rotSpeed = map(mouseY, 0, height, 0.005, 0.05);
  let time = frameCount * 0.02 * motionFactor;

  let dim = min(width, height);
  let amp = dim * 0.35;

  let x = amp * sin(time * freqMod + PI);
  let y = amp * sin(time * (freqMod + 1));
  let z = amp * sin(time * 0.5);

  oscPoints.push({x, y, z});

  if (oscPoints.length > maxOscPoints) {
    oscPoints.shift();
  }

  quantumPG.push();
  quantumPG.rotateY(time * 0.6 + rotSpeed * frameCount * 0.025 * motionFactor);
  quantumPG.rotateX(time * 0.35);
  quantumPG.noFill();
  quantumPG.strokeWeight(2);

  quantumPG.beginShape();
  for (let i = 0; i < oscPoints.length; i++) {
    let p = oscPoints[i];
    let fade = map(i, 0, oscPoints.length, 0, 255);
    quantumPG.stroke(0, fade, 200, fade);
    quantumPG.vertex(p.x, p.y, p.z);
  }
  quantumPG.endShape();

  let head = oscPoints[oscPoints.length-1];
  if(head) {
    quantumPG.push();
    quantumPG.translate(head.x, head.y, head.z);
    quantumPG.noStroke();
    quantumPG.fill(255, 255, 255, 230);
    quantumPG.sphere(4);
    quantumPG.pop();
  }
  quantumPG.pop();

  image(quantumPG, 0, 0, width, height);
}

function rotate3D(x, y, z, angleX, angleY) {
  let y1 = y * cos(angleX) - z * sin(angleX);
  let z1 = y * sin(angleX) + z * cos(angleX);
  
  let x2 = x * cos(angleY) - z1 * sin(angleY);
  let z2 = x * sin(angleY) + z1 * cos(angleY);
  
  return { x: x2, y: y1 };
}

// ==========================================================
// MODE 5: FLYING RECTANGLES
// ==========================================================
function pickPaletteColor(palette) {
  return palette[floor(random(palette.length))].slice();
}

function mixedColor(c1, c2, mix) {
  return {
    r: lerp(c1[0], c2[0], mix),
    g: lerp(c1[1], c2[1], mix),
    b: lerp(c1[2], c2[2], mix)
  };
}

function initFlyingRectanglesWebGL() {
  rectsPG = createGraphics(windowWidth, windowHeight, WEBGL);
  rectsPG.colorMode(RGB, 255, 255, 255, 255);
  rectsPG.blendMode(BLEND);
}

function initFlyingRectangles() {
  initFlyingRectanglesWebGL();
  flyingRects = [];
  
  // Refined neon palette: vivid but less toy-like.
  const palette = [
    color(84, 255, 196),   // mint neon
    color(255, 186, 92),   // amber neon
    color(255, 118, 118),  // coral signal
    color(106, 232, 255),  // cool cyan
    color(206, 255, 120)   // lime tint
  ];

  // Reduced density slightly for a more spacious, gallery feel
  let density = floor((width * height) / 18000); 
  density = constrain(density, 12, 50);

  for (let i = 0; i < density; i++) {
    let zDepth = random(0.1, 2.2);
    let rectW = max(random(60, 190) * zDepth, 40);
    let rectH = max(random(60, 190) * zDepth, 40);
    
    flyingRects.push({
      x: random(width),
      y: random(height),
      w: rectW,
      h: rectH,
      z: zDepth, 
      col: random(palette),
      // Animation properties
      offset: random(1000),      
      pulseSpeed: random(0.01, 0.03), // Slower pulse
      hoverState: 0 // For smooth lerping
    });
  }

  // Fixed depth stack: far rectangles are drawn first, near ones always stay on top.
  flyingRects.sort((a, b) => a.z - b.z);
}

function drawFlyingRectangles() {
  if (!rectsPG) initFlyingRectanglesWebGL();
  rectsPG.background(10, 12, 18, 34);

  let time = frameCount * motionFactor;
  let driftOffset = time * 0.75;
  let mx = mouseX;
  let my = mouseY;

  rectsPG.push();
  rectsPG.rotateY(map(mouseX, 0, width, -0.12, 0.12));
  rectsPG.rotateX(map(mouseY, 0, height, 0.08, -0.08));

  for (let b of flyingRects) {
    let parallaxY = b.y - (driftOffset * b.z);
    let renderY = (parallaxY % (height + 300));
    if (renderY < -150) renderY += height + 300;

    let d = dist(mx, my, b.x, renderY);
    let isHover = d < (max(b.w, b.h) * 0.8);

    if (isHover) {
      b.hoverState = lerp(b.hoverState, 1, 0.08);
    } else {
      b.hoverState = lerp(b.hoverState, 0, 0.04);
    }

    let breath = sin(time * b.pulseSpeed + b.offset) * 2;

    let scaleFactor = 1 + (b.hoverState * 0.015);
    let worldX = b.x - width * 0.5;
    let worldY = renderY - height * 0.5;
    let worldZ = map(b.z, 0.1, 2.2, -760, 280);

    let c = b.col;
    let neonR = lerp(red(c), 255, 0.15);
    let neonG = lerp(green(c), 255, 0.1);
    let neonB = lerp(blue(c), 255, 0.1);
    let alphaVal = 130 + (b.hoverState * 18);

    rectsPG.push();
    rectsPG.translate(worldX, worldY, worldZ);
    rectsPG.scale(scaleFactor, scaleFactor, 1);
    rectsPG.rectMode(CENTER);
    rectsPG.noStroke();
    rectsPG.fill(neonR, neonG, neonB, alphaVal);
    rectsPG.rect(0, 0, b.w + breath, b.h + breath, 3);
    rectsPG.pop();
  }

  rectsPG.pop();
  image(rectsPG, 0, 0, width, height);
}

// ==========================================================
// MODE 6: CONSTELLATION-LIKE SEGMENTS
// ==========================================================
function initConstellationWebGL() {
  constellationPG = createGraphics(windowWidth, windowHeight, WEBGL);
  constellationPG.colorMode(RGB, 255, 255, 255, 255);
}

function initConstellationSegments() {
  if (!constellationPG) initConstellationWebGL();
  const palette = [
    [56, 225, 255],  // electric cyan
    [255, 127, 80],  // coral
    [154, 255, 108], // lime
    [255, 223, 83],  // gold
    [188, 124, 255], // lavender
    [255, 108, 205]  // hot pink
  ];

  constellationNodes = [];
  // Scaling node count by screen area
  let count = floor((width * height) / 8000); 
  count = constrain(count, 40, 150);

  for (let i = 0; i < count; i++) {
    let pos = createVector(random(width), random(height));
    let orbitCenter = createVector(random(width), random(height));
    constellationNodes.push({
      pos,
      vel: p5.Vector.random2D().mult(random(0.2, 1.1)),
      r: random(1.6, 4.2),
      orbitCenter,
      orbitR: random(20, 120),
      orbitA: random(TWO_PI),
      orbitSpeed: random(-0.03, 0.03),
      phase: random(TWO_PI),
      freq: random(0.5, 1.7),
      pathType: floor(random(4)),
      noiseSeed: random(1000),
      z: random(-180, 180),
      c1: pickPaletteColor(palette),
      c2: pickPaletteColor(palette)
    });
  }
}

function drawConstellationSegments() {
  if (!constellationPG) initConstellationWebGL();
  constellationPG.background(2, 6, 16, 40);

  let time = frameCount * 0.012 * motionFactor;
  let radius = map(mouseX, 0, width, 75, 190);
  let glow = map(mouseY, 0, height, 70, 220);
  let mousePull = map(mouseY, 0, height, 0.005, 0.05);
  let nodeColors = [];

  for (let n of constellationNodes) {
    if (n.pathType === 0) {
      n.vel.rotate(random(-0.05, 0.05));
      n.pos.add(n.vel);
    } else if (n.pathType === 1) {
      n.orbitCenter.add(p5.Vector.mult(n.vel, 0.22));
      n.orbitA += n.orbitSpeed * 1.2;
      n.pos.x = n.orbitCenter.x + cos(n.orbitA + n.phase) * n.orbitR;
      n.pos.y = n.orbitCenter.y + sin(n.orbitA * 1.3 + n.phase) * (n.orbitR * 0.7);
    } else if (n.pathType === 2) {
      n.pos.x += sin(time * (n.freq + 0.2) + n.phase) * 1.7 + n.vel.x * 0.4;
      n.pos.y += cos(time * (n.freq + 0.7) + n.phase) * 1.7 + n.vel.y * 0.4;
    } else {
      let ang = noise(n.pos.x * 0.004, n.pos.y * 0.004, time + n.noiseSeed) * TWO_PI * 3;
      let target = p5.Vector.fromAngle(ang).mult(1.5);
      n.vel.lerp(target, 0.08);
      n.pos.add(n.vel);
    }

    let pull = createVector(mouseX - n.pos.x, mouseY - n.pos.y);
    if (pull.magSq() < 50000) { // Larger interaction area
      pull.setMag(mousePull);
      n.pos.add(pull);
    }

    // Wrap both node and orbit center
    if (n.pos.x < 0) n.pos.x += width;
    if (n.pos.x > width) n.pos.x -= width;
    if (n.pos.y < 0) n.pos.y += height;
    if (n.pos.y > height) n.pos.y -= height;
    
    if (n.orbitCenter.x < 0) n.orbitCenter.x += width;
    if (n.orbitCenter.x > width) n.orbitCenter.x -= width;
    if (n.orbitCenter.y < 0) n.orbitCenter.y += height;
    if (n.orbitCenter.y > height) n.orbitCenter.y -= height;

    let mix = 0.5 + 0.5 * sin(time * 1.9 + n.phase);
    nodeColors.push(mixedColor(n.c1, n.c2, mix));
  }

  constellationPG.push();
  constellationPG.translate(-width * 0.5, -height * 0.5, 0);
  constellationPG.strokeWeight(1.2);

  for (let i = 0; i < constellationNodes.length; i++) {
    for (let j = i + 1; j < constellationNodes.length; j++) {
      let a = constellationNodes[i];
      let b = constellationNodes[j];
      let d = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y);

      if (d < radius) {
        let alpha = map(d, 0, radius, glow, 0);
        let cA = nodeColors[i];
        let cB = nodeColors[j];
        let r = (cA.r + cB.r) * 0.5;
        let g = (cA.g + cB.g) * 0.5;
        let bCol = (cA.b + cB.b) * 0.5;
        constellationPG.stroke(r, g, bCol, alpha);
        constellationPG.line(a.pos.x, a.pos.y, a.z, b.pos.x, b.pos.y, b.z);
      }
    }
  }

  constellationPG.noStroke();
  for (let i = 0; i < constellationNodes.length; i++) {
    let n = constellationNodes[i];
    let c = nodeColors[i];
    let pulse = 0.8 + 0.5 * sin(time * 2.2 + n.phase);
    constellationPG.fill(c.r + 25, c.g + 25, c.b + 25, 220);
    constellationPG.push();
    constellationPG.translate(n.pos.x, n.pos.y, n.z);
    constellationPG.sphere(n.r * pulse);
    constellationPG.pop();
  }
  constellationPG.pop();
  image(constellationPG, 0, 0, width, height);
}

// ==========================================================
// MODE 7: STRUCTURE DE QUADRILATERES (MOLNAR STUDY)
// ==========================================================
function initMolnarQuadrilateralStudy() {
  molnarCells = [];

  const gridCount = 8;
  const stackSize = 11;
  const dim = min(width, height);
  const gridSize = dim * 0.78;
  const cellSize = gridSize / gridCount;
  const offsetX = (width - gridSize) * 0.5;
  const offsetY = (height - gridSize) * 0.5;

  const palette = [
    [188, 88, 58, 0.62],  // burnt orange
    [73, 128, 126, 0.58], // muted teal
    [72, 96, 148, 0.6],   // deep blue
    [32, 32, 34, 0.72],   // near black
    [126, 102, 145, 0.58] // dusty violet
  ];

  for (let gy = 0; gy < gridCount; gy++) {
    for (let gx = 0; gx < gridCount; gx++) {
      const cx = offsetX + gx * cellSize + cellSize * 0.5;
      const cy = offsetY + gy * cellSize + cellSize * 0.5;
      const colorRef = random(palette);
      const stack = [];
      const half = cellSize / 2.5;
      const jitter = cellSize * 0.15;

      for (let i = 0; i < stackSize; i++) {
        stack.push([
          random(-half - jitter, -half + jitter), random(-half - jitter, -half + jitter),
          random( half - jitter,  half + jitter), random(-half - jitter, -half + jitter),
          random( half - jitter,  half + jitter), random( half - jitter,  half + jitter),
          random(-half - jitter, -half + jitter), random( half - jitter,  half + jitter)
        ]);
      }

      molnarCells.push({
        x: cx,
        y: cy,
        c: colorRef,
        stack
      });
    }
  }
}

function drawMolnarQuadrilateralStudy() {
  background(242, 240, 232);
  noFill();
  strokeWeight(1.2);

  for (let cell of molnarCells) {
    stroke(cell.c[0], cell.c[1], cell.c[2], cell.c[3] * 255);
    push();
    translate(cell.x, cell.y);
    for (let quadPts of cell.stack) {
      quad(
        quadPts[0], quadPts[1],
        quadPts[2], quadPts[3],
        quadPts[4], quadPts[5],
        quadPts[6], quadPts[7]
      );
    }
    pop();
  }
}

// ==========================================================
// MODE 8: ROTATED SCRIBBLE GRID
// ==========================================================
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
  const scribbleDensity = 120;
  const jitterAmount = 1.5;

  for (let i = 0; i < 3000; i++) {
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
      const baseAngle = random(-0.15, 0.15);
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

// ==========================================================
// MODE 9: PARAMETRIC RIBBON SURFACE (WEBGL STUDY)
// ==========================================================
function initRibbonSurfaceStudy() {
  ribbonPG = createGraphics(windowWidth, windowHeight, WEBGL);
  ribbonPG.colorMode(HSB, 360, 100, 100, 100);
  ribbonPG.blendMode(ADD);
  ribbonTime = 0;
}

function calculateRibbonSurface(u, v, time) {
  const R = 150 + 30 * sin(time * 0.8 + u * 2);
  const r = 50 + 20 * cos(time + v * 3);
  const vTwisted = v + u * 1.5 + sin(time);
  const x = (R + r * cos(vTwisted)) * cos(u);
  const y = (R + r * cos(vTwisted)) * sin(u);
  const z = r * sin(vTwisted) + 40 * sin(u * 3 + time);
  return { x, y, z };
}

function drawRibbonSurfaceStudy() {
  if (!ribbonPG) initRibbonSurfaceStudy();

  ribbonPG.background(0);
  // Disable wheel zoom here so page scroll stays dedicated to section navigation.
  ribbonPG.orbitControl(reducedMotion ? 0.45 : 1, reducedMotion ? 0.45 : 1, 0);
  ribbonPG.noFill();
  ribbonPG.strokeWeight(1.2);

  const uSteps = 60;
  const vSteps = 30;

  for (let u = 0; u < TWO_PI; u += TWO_PI / uSteps) {
    ribbonPG.beginShape(TRIANGLE_STRIP);

    for (let v = 0; v <= TWO_PI; v += TWO_PI / vSteps) {
      const p1 = calculateRibbonSurface(u, v, ribbonTime);
      const p2 = calculateRibbonSurface(u + TWO_PI / uSteps, v, ribbonTime);
      const hue = map(sin(u + ribbonTime * 0.5), -1, 1, 180, 320);

      ribbonPG.stroke(hue, 80, 100, 60);
      ribbonPG.vertex(p1.x, p1.y, p1.z);
      ribbonPG.vertex(p2.x, p2.y, p2.z);
    }

    ribbonPG.endShape();
  }

  ribbonTime += 0.02 * motionFactor;
  image(ribbonPG, 0, 0, width, height);
}

// ==========================================================
// MODE 10: FRACTURED WEB
// ==========================================================
function initArtwork10Study() {
  art10PG = createGraphics(windowWidth, windowHeight);
  art10Dirty = true;
}

function renderArtwork10(pg) {
  pg.background(242, 240, 235);

  let points = [];
  for (let i = 0; i < 60; i++) {
    points.push(createVector(random(pg.width), random(pg.height)));
  }

  pg.stroke(100, 100, 110, 80);
  pg.strokeWeight(0.6);
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let d = dist(points[i].x, points[i].y, points[j].x, points[j].y);
      if (d < 250) {
        pg.line(points[i].x, points[i].y, points[j].x, points[j].y);
      }
    }
  }

  pg.noFill();
  pg.stroke(40, 40, 50, 120);
  pg.strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    let x1 = random(pg.width);
    let y1 = random(pg.height);
    let size = random(200, 600);
    pg.arc(x1, y1, size, size, random(TWO_PI), random(TWO_PI));
  }

  let palette = [
    color(0, 90, 156, 220),
    color(0, 135, 80, 220),
    color(235, 180, 0, 220),
    color(190, 30, 45, 220),
    color(110, 60, 140, 220),
    color(30, 30, 30, 200)
  ];

  for (let i = 0; i < 25; i++) {
    let x = random(pg.width);
    let y = random(pg.height);
    let sz = random(40, 120);

    pg.push();
    pg.translate(x, y);
    pg.rotate(random(TWO_PI));
    pg.fill(random(palette));
    pg.noStroke();

    pg.beginShape();
    pg.vertex(random(-sz, 0), random(-sz, 0));
    pg.vertex(random(0, sz), random(-sz, 0));
    pg.vertex(random(0, sz), random(0, sz));
    pg.vertex(random(-sz, 0), random(0, sz));
    pg.endShape(CLOSE);

    if (random() > 0.5) {
      pg.stroke(0, 50);
      pg.strokeWeight(0.5);
      pg.line(-sz, -sz, sz * 2, sz * 2);
    }
    pg.pop();
  }

  pg.stroke(20, 20, 25);
  pg.strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    let lx = random(pg.width);
    let ly = random(pg.height);
    let len = random(100, 300);
    let ang = random([0, PI / 2, PI / 4, -PI / 4]);
    pg.push();
    pg.translate(lx, ly);
    pg.rotate(ang);
    pg.line(0, 0, len, 0);
    pg.pop();
  }
}

function drawArtwork10Study() {
  if (!art10PG) initArtwork10Study();
  if (art10Dirty) {
    renderArtwork10(art10PG);
    art10Dirty = false;
  }
  image(art10PG, 0, 0, width, height);
}

// --- UTILITY FUNCTIONS ---

function changeMode(newMode) {
  mode = newMode;
  
  if (mode === 0) {
    background(8);
    setCaption("", "");
  }
  else if (mode === 1) {
    background(10);
    setCaption("01 // Rose.", "Based on 'Generative Art with Math'. <br><b>Interact:</b> Move mouse X (petals) and Y (angle).");
  } 
  else if (mode === 2) {
    background(0, 0, 20);
    setCaption("02 // Wave.", "Based on 'Piratefsh'. <br><b>Interact:</b> Mouse distance controls speed.");
  } 
  else if (mode === 3) {
    background(10);
    initBezierLoomWebGL();
    setCaption("03 // Loom.", "Higher-order Bezier (De Casteljau). <br><b>Interact:</b> Mouse X controls density, mouse Y controls spread.");
  }
  else if (mode === 4) {
    background(0);
    initQuantumWebGL();
    oscPoints = [];
    setCaption("04 // Quantum.", "A tribute to Laposky & Franke. <br><b>Interact:</b> Mouse X changes frequency ratio, mouse Y changes rotation speed.");
  }
  else if (mode === 5) {
    background(5);
    initFlyingRectangles(); // Re-init for full screen
    setCaption(
      "05 // Flying Rectangles.",
      "Drifting blocks with layered depth and subtle motion. <br><b>Interact:</b> Mouse proximity activates energy."
    );
  }
  else if (mode === 6) {
    background(5);
    initConstellationSegments(); // Re-init for full screen
    setCaption(
      "06 // Constellation.",
      "Proximity-based network segments. <br><b>Interact:</b> Mouse X affects connection radius; Mouse Y affects brightness."
    );
  }
  else if (mode === 7) {
    background(242, 240, 232);
    initMolnarQuadrilateralStudy();
    setCaption(
      "07 // Quadrilateral Structure.",
      "Molnar-inspired generative grid. <br><b>Interact:</b> Click to regenerate composition."
    );
  }
  else if (mode === 8) {
    background(242, 238, 225);
    initScribbleGridStudy();
    setCaption(
      "08 // Rotated Scribble Grid.",
      "Layered perimeter lines with subtle mouse response. <br><b>Interact:</b> Click regenerate button for new composition."
    );
  }
  else if (mode === 9) {
    background(0);
    initRibbonSurfaceStudy();
    setCaption(
      "09 // Ribbon Surface.",
      "Twisted torus-like parametric ribbon in additive WEBGL. <br><b>Interact:</b> Drag to orbit."
    );
  }
  else if (mode === 10) {
    background(242, 240, 235);
    initArtwork10Study();
    setCaption(
      "10 // Fractured Web.",
      "Layered lines, arcs, and facets on a vintage-paper field. <br><b>Interact:</b> Click to regenerate composition."
    );
  }
}

function setCaption(title, desc) {
  const panelEl = document.getElementById('info-panel');
  const captionEl = document.getElementById('caption');
  const hasCaption = Boolean(title && title.trim()) || Boolean(desc && desc.trim());

  if (panelEl) {
    panelEl.style.display = hasCaption ? 'block' : 'none';
  }

  if (captionEl) {
    if (!hasCaption) {
      captionEl.innerHTML = '';
      return;
    }
    captionEl.innerHTML = `<span class='highlight'>${title}</span> <br>${desc}`;
  }
}

function mousePressed() {
  if (mode === 7) {
    initMolnarQuadrilateralStudy();
  }
  if (mode === 8) {
    initScribbleGridStudy();
  }
  if (mode === 10) {
    art10Dirty = true;
  }
}
