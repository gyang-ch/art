// FRACTURED WEB
let art10PG = null;
let art10Dirty = true;

function drawExtendedLine(pg, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const mag = sqrt(dx * dx + dy * dy);
  if (mag < 0.0001) return;

  const ux = dx / mag;
  const uy = dy / mag;
  const span = max(pg.width, pg.height) * 2;
  pg.line(x1 - ux * span, y1 - uy * span, x2 + ux * span, y2 + uy * span);
}

function initWeb() {
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
        drawExtendedLine(pg, points[i].x, points[i].y, points[j].x, points[j].y);
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
      drawExtendedLine(pg, -sz, -sz, sz * 2, sz * 2);
    }

    pg.pop();
  }

  pg.stroke(20, 20, 25);
  pg.strokeWeight(0.6);
  for (let i = 0; i < 5; i++) {
    let lx = random(pg.width);
    let ly = random(pg.height);
    let ang = random([0, PI / 2, PI / 4, -PI / 4]);
    let dx = cos(ang);
    let dy = sin(ang);
    pg.push();
    pg.translate(lx, ly);
    drawExtendedLine(pg, -dx, -dy, dx, dy);
    pg.pop();
  }
}

function drawWeb() {
  if (!art10PG) initWeb();
  if (art10Dirty) {
    renderArtwork10(art10PG);
    art10Dirty = false;
  }
  image(art10PG, 0, 0, width, height);
}
