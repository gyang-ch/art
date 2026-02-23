// RESONATOR
const RESONATOR_CURVE_MODES = [
  { key: "harmonic", label: "Harmonic Phase" },
  { key: "hypotrochoidal", label: "Hypotrochoidal Evolution" },
  { key: "toroidal", label: "Toroidal Knot" }
];

let resonatorCurveMode = 0;
let resonatorTime = 0;
let resonatorRotationSpeed = 1;
let resonatorNumLines = 300;
let resonatorBaseRadius = 0;
let resonatorMajorRadius = 0;
let resonatorMinorRadius = 0;
let resonatorPG = null;
let resonatorAngleX = 0;
let resonatorAngleY = 0;
let resonatorAngleZ = 0;
let resonatorPrimaryHue = 118;
const RESONATOR_HUE_OFFSET = 132;

function initResonator() {
  resonatorPG = createGraphics(windowWidth, windowHeight, WEBGL);
  resonatorPG.colorMode(HSB, 360, 100, 100, 100); //Set colour mode to HSB.
  resonatorPG.smooth();
  resonatorTime = 0; // Reset time to 0.

  if (resonatorCurveMode === 1) {
    resonatorNumLines = 400;
    resonatorBaseRadius = min(width, height) * 0.22; // Set base radius.
    resonatorMajorRadius = 0; // Set major radius to 0; this is not used in this mode.
    resonatorMinorRadius = 0; // Set minor radius to 0; this is not used in this mode.
    resonatorAngleX = PI / 4;
    resonatorAngleY = 0;
    resonatorAngleZ = 0;
    return;
  }

  if (resonatorCurveMode === 2) {
    resonatorNumLines = 450;
    resonatorMajorRadius = min(width, height) * 0.25;
    resonatorMinorRadius = min(width, height) * 0.12;
    resonatorBaseRadius = 0;
    resonatorAngleX = PI / 5;
    resonatorAngleY = 0;
    resonatorAngleZ = 0;
    return;
  }

  resonatorNumLines = 300;
  resonatorBaseRadius = min(width, height) * 0.35;
  resonatorMajorRadius = 0;
  resonatorMinorRadius = 0;
  resonatorAngleX = 0;
  resonatorAngleY = 0;
  resonatorAngleZ = 0;
}

function drawResonator() {
  if (!resonatorPG) initResonator();

  const safeMotionFactor = Number.isFinite(motionFactor) ? motionFactor : 1;
  const distFromCenter = dist(
    mouseX - width * 0.5, mouseY - height * 0.5, 
    0, 0); //Distance between cursor and canvas centre.

  if (resonatorCurveMode === 1) {
    drawHypotrochoidalResonator(distFromCenter, safeMotionFactor);
    return;
  }

  if (resonatorCurveMode === 2) {
    drawToroidalResonator(distFromCenter, safeMotionFactor);
    return;
  }

  drawHarmonicResonator(distFromCenter, safeMotionFactor);
}

function drawHarmonicResonator(distFromCenter, safeMotionFactor) {
  resonatorPG.background(0); // Clear the off-screen buffer
  resonatorPG.resetMatrix(); // Reset transform matrix

  resonatorAngleY += 0.008 * resonatorRotationSpeed * safeMotionFactor;
  resonatorAngleZ += 0.004 * resonatorRotationSpeed * safeMotionFactor;
  resonatorPG.rotateY(resonatorAngleY);
  resonatorPG.rotateZ(resonatorAngleZ);

  const targetAmp = map(distFromCenter, 0, width * 0.5, 
    0.5, 1.5, true); //Map cursor distance to amplitude range 0.5 to 1.5.
  const targetFreq = 4;

  resonatorPG.blendMode(ADD); // Additive blending 
  resonatorPG.noFill(); // Turn off fill

  drawResonatorHarmonicPhase3D(resonatorTime, targetFreq, targetAmp); //Draw first
  drawResonatorHarmonicPhase3D(resonatorTime + PI, targetFreq, targetAmp); //Draw second with PI offset

  const speedMult = map(distFromCenter, 5, width * 0.5, 
    0.55, 1.0, true); //Map cursor distance to a speed multiplier.
  resonatorTime += 0.05 * speedMult * resonatorRotationSpeed * safeMotionFactor;

  resonatorPG.blendMode(BLEND); //Restore normal blend mode.
  image(resonatorPG, 0, 0, width, height); //Draw off-screen WEBGL buffer on canvas.
}

function drawHypotrochoidalResonator(distFromCenter, safeMotionFactor) {
  resonatorPG.background(0, 0, 4);
  resonatorPG.resetMatrix();

  // Increment and apply X, Y, Z rotations.
  resonatorAngleX += 0.004 * resonatorRotationSpeed * safeMotionFactor;
  resonatorAngleY += 0.006 * resonatorRotationSpeed * safeMotionFactor;
  resonatorAngleZ += 0.003 * resonatorRotationSpeed * safeMotionFactor;
  resonatorPG.rotateX(resonatorAngleX);
  resonatorPG.rotateY(resonatorAngleY);
  resonatorPG.rotateZ(resonatorAngleZ);

  // Map cursor distance to amplitude range 0.6 to 1.6.
  const targetAmp = map(distFromCenter, 0, width * 0.5, 0.6, 1.6, true); 
  const targetFreq = 1;

  resonatorPG.blendMode(ADD); //Turn on additive blend.
  resonatorPG.noFill(); //Turn off fill.
  drawHypotrochoid3D(resonatorTime, targetFreq, targetAmp); //Draw first hypotrochoid.
  drawHypotrochoid3D(resonatorTime + PI * 0.5, 
    targetFreq, targetAmp * 0.6); //Draw second hypotrochoid with an offset 

  // Map cursor distance to time speed multiplier.
  const speedMult = map(distFromCenter, 0, width * 0.5, 0.5, 1.5, true);
  resonatorTime += 0.02 * speedMult * resonatorRotationSpeed * safeMotionFactor;

  resonatorPG.blendMode(BLEND); // Restore normal blending.
  image(resonatorPG, 0, 0, width, height);
}

function drawToroidalResonator(distFromCenter, safeMotionFactor) {
  resonatorPG.background(0, 0, 5);
  resonatorPG.resetMatrix();

  // Apply X, Y, Z rotations.
  resonatorAngleX += 0.003 * resonatorRotationSpeed * safeMotionFactor;
  resonatorAngleY += 0.005 * resonatorRotationSpeed * safeMotionFactor;
  resonatorAngleZ += 0.002 * resonatorRotationSpeed * safeMotionFactor;
  resonatorPG.rotateX(resonatorAngleX);
  resonatorPG.rotateY(resonatorAngleY);
  resonatorPG.rotateZ(resonatorAngleZ);

  //Map cursor distance to amplitude range 0.7 to 1.8.
  const targetAmp = map(distFromCenter, 0, width * 0.5, 0.7, 1.8, true);
  const targetFreq = 1;

  resonatorPG.blendMode(ADD); //Additive blend
  resonatorPG.noFill(); 
  drawToroidalHarmonic3D(resonatorTime, targetFreq, targetAmp); //Draw first toroidal
  drawToroidalHarmonic3D(resonatorTime + PI, targetFreq, targetAmp * 0.75); //Draw second with offset

  const speedMult = map(distFromCenter, 0, width * 0.5, 0.5, 1.5, true);
  resonatorTime += 0.015 * speedMult * resonatorRotationSpeed * safeMotionFactor;

  resonatorPG.blendMode(BLEND);
  image(resonatorPG, 0, 0, width, height);
}

function drawResonatorHarmonicPhase3D(time, freq, amp) {
  for (let i = 0; i < resonatorNumLines; i++) { //loop over all sticks using resonatorNumLines.
    const p = i / resonatorNumLines;
    const theta = TWO_PI * p * freq + time; // Compute theta angle
    const phi = TWO_PI * p + time * 0.5; // Compute phi angle

    // Computing two endpoints P1 and P2 of a stick for drawing the stick later.
    const x1 = resonatorBaseRadius * sin(theta) * cos(phi * 2) * amp;
    const y1 = resonatorBaseRadius * cos(theta * 1.5) * sin(phi) * amp;
    const z1 = resonatorBaseRadius * sin(phi + theta) * amp;

    const x2 = resonatorBaseRadius * cos(theta + time) * amp;
    const y2 = resonatorBaseRadius * sin(phi + theta) * amp;
    const z2 = resonatorBaseRadius * cos(phi - theta) * amp;

    // Compute hue for the line index at this time.
    const dynamicHue = getResonatorDynamicHue(time, i, 0.01, 50, 2);
    const alpha = map(z1, -resonatorBaseRadius, resonatorBaseRadius, 20, 90);

    resonatorPG.strokeWeight(1.5);
    resonatorPG.stroke(dynamicHue, 90, 100, alpha);
    // Draw a 3D line segment from P1 to P2.
    resonatorPG.line(x1, y1, z1, x2, y2, z2);
  }
}

function drawHypotrochoid3D(time, freq, amp) {
  for (let i = 0; i < resonatorNumLines; i++) { //Loop over all sticks.
    const pFactor = i / resonatorNumLines;
    const theta = TWO_PI * pFactor * freq * 12;

    const R1 = resonatorBaseRadius * 1.0; //Set first hypotrochoid big radius R1
    const r1 = resonatorBaseRadius * 0.25; //Set first small rolling radius r1.
    const d1 = resonatorBaseRadius * 0.6; //Set first offset distance d1.
    const t1 = theta + time;

    let x1 = (R1 - r1) * cos(t1) + d1 * cos(((R1 - r1) / r1) * t1);
    let y1 = (R1 - r1) * sin(t1) - d1 * sin(((R1 - r1) / r1) * t1);
    let z1 = sin(theta * 2 + time * 1.5) * (resonatorBaseRadius * 0.5);

    const R2 = resonatorBaseRadius * 1.4;
    const r2 = resonatorBaseRadius * 0.4;
    const d2 = resonatorBaseRadius * 0.9;
    const t2 = theta - time * 0.8;

    let x2 = (R2 - r2) * cos(t2) + d2 * cos(((R2 - r2) / r2) * t2);
    let y2 = (R2 - r2) * sin(t2) - d2 * sin(((R2 - r2) / r2) * t2);
    let z2 = cos(theta * 3 - time) * (resonatorBaseRadius * 0.7);

    // scale x1, y1, z1, x2, y2, z2 by amplitude.
    x1 *= amp;
    y1 *= amp;
    z1 *= amp;
    x2 *= amp;
    y2 *= amp;
    z2 *= amp;

    const dynamicHue = getResonatorDynamicHue(time, i, 0.02, 40, 1.5);
    const alpha = map(z1 + z2, -resonatorBaseRadius * 1.5, resonatorBaseRadius * 1.5, 10, 85);

    resonatorPG.strokeWeight(1.0);
    resonatorPG.stroke(dynamicHue, 90, 100, alpha);
    resonatorPG.line(x1, y1, z1, x2, y2, z2); //Draw a line from first curve point to second curve point.
  }
}

function drawToroidalHarmonic3D(time, freq, amp) {
  for (let i = 0; i < resonatorNumLines; i++) { //Loop through all sticks.
    const pFactor = i / resonatorNumLines;
    const theta = TWO_PI * pFactor * freq;

    //Set first torus-knot values.
    const p1 = 3;
    const q1 = 2; 
    const u1 = p1 * theta + time;
    const v1 = q1 * theta - time * 1.5;

    //Set second torus-knot values.
    const p2 = 5;
    const q2 = 4;
    const u2 = p2 * theta - time * 0.8;
    const v2 = q2 * theta + time * 2;

    const R = resonatorMajorRadius * amp; //Major radius R scaled by amplitude.
    const r = resonatorMinorRadius * amp; //Minor radius r scaled by amplitude.

    const x1 = (R + r * cos(v1)) * cos(u1);
    const y1 = (R + r * cos(v1)) * sin(u1);
    const z1 = r * sin(v1);

    const R2 = R * 1.3;
    const r2 = r * 0.8;
    const x2 = (R2 + r2 * cos(v2)) * cos(u2);
    const y2 = (R2 + r2 * cos(v2)) * sin(u2);
    const z2 = r2 * sin(v2);

    const dynamicHue = getResonatorDynamicHue(time, i, 0.05, 30, 2.5);
    const alpha = map(z1 + z2, -(r + r2), r + r2, 15, 90);

    resonatorPG.strokeWeight(1.2);
    resonatorPG.stroke(dynamicHue, 85, 100, alpha);
    resonatorPG.line(x1, y1, z1, x2, y2, z2); //Draw line segment between the two toroidal points.
  }
}

function getResonatorCurveLabel() {
  return RESONATOR_CURVE_MODES[resonatorCurveMode].label;
}

function getResonatorSecondaryHue() {
  return (resonatorPrimaryHue + RESONATOR_HUE_OFFSET) % 360;
}

function getResonatorDynamicHue(time, i, sineScale, timeMult, lineMult) {
  const hueVal = (time * timeMult + i * lineMult) % 360;
  return map(sin(hueVal * sineScale), -1, 1, resonatorPrimaryHue, getResonatorSecondaryHue());
}

function cycleResonatorCurve() {
  resonatorCurveMode = (resonatorCurveMode + 1) % RESONATOR_CURVE_MODES.length;
  initResonator();
  return getResonatorCurveLabel();
}

function setResonatorHue(newHue) {
  if (!Number.isFinite(newHue)) return;
  resonatorPrimaryHue = ((newHue % 360) + 360) % 360;
}

function getResonatorHue() {
  return resonatorPrimaryHue;
}

function invertResonatorRotation() {
  resonatorRotationSpeed *= -1;
}

window.getResonatorCurveLabel = getResonatorCurveLabel;
window.cycleResonatorCurve = cycleResonatorCurve;
window.setResonatorHue = setResonatorHue;
window.getResonatorHue = getResonatorHue;
