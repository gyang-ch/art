// STUDY 9: PARAMETRIC RIBBON SURFACE
let ribbonPG = null;
let ribbonTime = 0;

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
