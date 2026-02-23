// QUANTUM HALVORSEN
let art7BaseAParam = 1.8;
let art7Dt = 0.005;

let art7CurX = 1.0;
let art7CurY = 0.0;
let art7CurZ = 0.0;
let art7PointsPerFrame = 80000;
let art7ScaleFactor = 1;

let art7Time = 0.0;
let art7Dth = 0.02;
let art7CamRotX = 0;
let art7CamRotY = 0;
let art7ManualCamSpeed = 0.05;

let art7Bright = 255;
let art7ARed = 0.5;
let art7AGreen = 1.0;
let art7ABlue = 0.8;
let art7PRed = 120;
let art7PGreen = 310;
let art7PBlue = 270;

function initMolnar() {
  art7CurX = 1.0;
  art7CurY = 0.0;
  art7CurZ = 0.0;
  art7Time = 0.0;
  art7CamRotX = 0;
  art7CamRotY = 0;
  art7ScaleFactor = min(width, height) * 0.022;

  blendMode(BLEND);
  background(15, 15, 18);
}

function drawMolnar() {
  if (art7ScaleFactor <= 0) {
    initMolnar();
  }

  art7Time += 1.0;

  blendMode(BLEND);
  fill(15, 15, 18, 5);
  noStroke();
  rect(0, 0, width, height);
  blendMode(ADD);

  let camChanged = false;
  if (keyIsDown(LEFT_ARROW)) {
    art7CamRotY -= art7ManualCamSpeed;
    camChanged = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    art7CamRotY += art7ManualCamSpeed;
    camChanged = true;
  }
  if (keyIsDown(UP_ARROW)) {
    art7CamRotX -= art7ManualCamSpeed;
    camChanged = true;
  }
  if (keyIsDown(DOWN_ARROW)) {
    art7CamRotX += art7ManualCamSpeed;
    camChanged = true;
  }

  if (camChanged) {
    blendMode(BLEND);
    background(15, 15, 18);
    blendMode(ADD);
  }

  const aParam = art7BaseAParam + sin(art7Time / 500) * 0.05;

  const rColor = int(art7Bright * art7ARed * (1 + sin(art7Time / art7PRed)) / 2.0);
  const gColor = int(art7Bright * art7AGreen * (1 + cos(art7Time / art7PGreen)) / 2.0);
  const bColor = int(art7Bright * art7ABlue * (1 + sin(art7Time / art7PBlue)) / 2.0);

  const currentOpacity = 3 + int(1.5 * (1 + sin(art7Time / 1000)));
  stroke(rColor, gColor, bColor, currentOpacity);
  strokeWeight(0.8);

  const autoRotX = art7CamRotX + art7Time * art7Dth * 0.5 * motionFactor;
  const autoRotY = art7CamRotY + art7Time * art7Dth * motionFactor;

  const cosX = cos(autoRotX);
  const sinX = sin(autoRotX);
  const cosY = cos(autoRotY);
  const sinY = sin(autoRotY);

  const rx = 150 * sin(art7Dth * art7Time * 0.9 * motionFactor);
  const ry = 100 * cos(art7Dth * art7Time * 0.7 * motionFactor);

  const cx = width * 0.5 + rx;
  const cy = height * 0.5 + ry;
  const pointsThisFrame = reducedMotion ? int(art7PointsPerFrame * 0.35) : art7PointsPerFrame;

  for (let i = 0; i < pointsThisFrame; i++) {
    const dx = (-aParam * art7CurX - 4 * art7CurY - 4 * art7CurZ - art7CurY * art7CurY) * art7Dt;
    const dy = (-aParam * art7CurY - 4 * art7CurZ - 4 * art7CurX - art7CurZ * art7CurZ) * art7Dt;
    const dz = (-aParam * art7CurZ - 4 * art7CurX - 4 * art7CurY - art7CurX * art7CurX) * art7Dt;

    art7CurX += dx;
    art7CurY += dy;
    art7CurZ += dz;

    const y1 = art7CurY * cosX - art7CurZ * sinX;
    const z1 = art7CurY * sinX + art7CurZ * cosX;

    const x2 = art7CurX * cosY + z1 * sinY;
    const y2 = y1;

    const px = cx + x2 * art7ScaleFactor;
    const py = cy + y2 * art7ScaleFactor;
    point(px, py);
  }

  //Reset blend mode
  blendMode(BLEND);
}

function handleMolnarKeyReleased() {
  if (key === "c" || key === "C") {
    blendMode(BLEND);
    background(15, 15, 18);
  }
}
