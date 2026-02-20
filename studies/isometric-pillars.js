// STUDY 11: ISOMETRIC PILLAR WAVE
let art11PG = null;
let art11Angle = 0;
let art11MagicAngle = 0;
let art11BoxSize = 24;
let art11GridCount = 16;
let art11MaxDistance = 200;

function computeArtwork11Layout() {
  const minDim = min(width, height);
  art11GridCount = constrain(floor(minDim / 52), 12, 18);
  art11BoxSize = (minDim * 0.9) / art11GridCount;
  const halfSpan = (art11GridCount * art11BoxSize) * 0.5;
  art11MaxDistance = dist(0, 0, halfSpan, halfSpan);
}

function initArtwork11Study() {
  art11PG = createGraphics(windowWidth, windowHeight, WEBGL);
  art11PG.colorMode(HSB, 360, 100, 100, 100);
  art11PG.noStroke();
  art11MagicAngle = atan(1 / sqrt(2));
  art11Angle = 0;
  computeArtwork11Layout();
}

function drawArtwork11Study() {
  if (!art11PG) initArtwork11Study();

  const pg = art11PG;
  const gridOffset = (art11GridCount * art11BoxSize) * 0.5;
  const minHeight = art11BoxSize * 1.8;
  const maxHeight = art11BoxSize * 7.8;

  pg.background(220, 20, 16);
  pg.ortho(-pg.width * 0.62, pg.width * 0.62, pg.height * 0.62, -pg.height * 0.62, -2200, 2600);

  pg.ambientLight(0, 0, 40);
  pg.directionalLight(210, 20, 100, 0.3, -1, -0.6);
  pg.pointLight(185, 35, 100, 0, -200, 380);
  pg.noStroke();

  pg.push();
  pg.rotateX(-QUARTER_PI);
  pg.rotateY(art11MagicAngle);

  for (let z = 0; z < art11GridCount; z++) {
    for (let x = 0; x < art11GridCount; x++) {
      pg.push();

      const xPos = x * art11BoxSize - gridOffset;
      const zPos = z * art11BoxSize - gridOffset;
      const distanceToCenter = dist(xPos, zPos, 0, 0);
      const offsetAngle = map(distanceToCenter, 0, art11MaxDistance, -PI, PI);
      const waveAngle = art11Angle + offsetAngle;
      const pillarHeight = floor(map(sin(waveAngle), -1, 1, minHeight, maxHeight));

      pg.translate(xPos, 0, zPos);
      pg.translate(0, pillarHeight * 0.5, 0);

      const hueVal = map(pillarHeight, minHeight, maxHeight, 180, 360);
      const satVal = map(distanceToCenter, 0, art11MaxDistance, 80, 100);
      pg.fill(hueVal, satVal, 88, 94);
      pg.box(art11BoxSize - 2, pillarHeight, art11BoxSize - 2);

      pg.push();
      pg.translate(0, pillarHeight * 0.5 + 1.2, 0);
      pg.fill((hueVal + 14) % 360, max(24, satVal - 20), 100, 96);
      pg.box((art11BoxSize - 2) * 0.72, 2.4, (art11BoxSize - 2) * 0.72);
      pg.pop();

      pg.pop();
    }
  }

  pg.pop();

  art11Angle -= 0.05 * motionFactor;
  image(pg, 0, 0, width, height);
}
