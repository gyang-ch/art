// STUDY 2: THE CHROMATIC RESONATOR (3D EDITION)
let waveTime = 0;
let waveRotationSpeed = 1;
let waveNumLines = 300;
let waveBaseRadius = 0;
let wavePG = null;
let waveAngleY = 0;
let waveAngleZ = 0;

function initChromaticResonatorStudy() {
  wavePG = createGraphics(windowWidth, windowHeight, WEBGL);
  wavePG.colorMode(HSB, 360, 100, 100, 100);
  wavePG.smooth();
  waveBaseRadius = min(width, height) * 0.35;
  waveTime = 0;
  waveAngleY = 0;
  waveAngleZ = 0;
}

function drawRetroWave() {
  if (!wavePG) initChromaticResonatorStudy();

  wavePG.background(0);
  wavePG.resetMatrix();

  // Autonomous rotation, reversible by click.
  waveAngleY += 0.008 * waveRotationSpeed * motionFactor;
  waveAngleZ += 0.004 * waveRotationSpeed * motionFactor;
  wavePG.rotateY(waveAngleY);
  wavePG.rotateZ(waveAngleZ);

  const distFromCenter = dist(mouseX - width * 0.5, mouseY - height * 0.5, 0, 0);
  const targetAmp = map(distFromCenter, 0, width * 0.5, 0.5, 1.5, true);
  const targetFreq = 4;

  wavePG.blendMode(ADD);
  wavePG.noFill();

  drawHarmonicPhase3D(waveTime, targetFreq, targetAmp);
  drawHarmonicPhase3D(waveTime + PI, targetFreq, targetAmp);

  const speedMult = map(distFromCenter, 5, width * 0.5, 0.55, 1.0);
  waveTime += 0.05 * speedMult * waveRotationSpeed * motionFactor;

  wavePG.blendMode(BLEND);
  image(wavePG, 0, 0, width, height);
}

function drawHarmonicPhase3D(time, freq, amp) {
  for (let i = 0; i < waveNumLines; i++) {
    const p = i / waveNumLines;

    const theta = TWO_PI * p * freq + time;
    const phi = TWO_PI * p + (time * 0.5);

    const x1 = waveBaseRadius * sin(theta) * cos(phi * 2) * amp;
    const y1 = waveBaseRadius * cos(theta * 1.5) * sin(phi) * amp;
    const z1 = waveBaseRadius * sin(phi + theta) * amp;

    const x2 = waveBaseRadius * cos(theta + time) * amp;
    const y2 = waveBaseRadius * sin(phi + theta) * amp;
    const z2 = waveBaseRadius * cos(phi - theta) * amp;

    const hueVal = (time * 50 + i * 2) % 360;
    const aquaticHue = map(sin(hueVal * 0.01), -1, 1, 140, 230);
    const alpha = map(z1, -waveBaseRadius, waveBaseRadius, 20, 90);

    wavePG.strokeWeight(1.5);
    wavePG.stroke(aquaticHue, 90, 100, alpha);
    wavePG.line(x1, y1, z1, x2, y2, z2);
  }
}

function invertChromaticResonatorRotation() {
  waveRotationSpeed *= -1;
}
