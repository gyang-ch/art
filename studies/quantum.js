// STUDY 4: QUANTUM OSCILLOSCOPE
let oscPoints = [];
let maxOscPoints = 800;
let quantumPG = null;

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

  oscPoints.push({ x, y, z });

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

  let head = oscPoints[oscPoints.length - 1];
  if (head) {
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
