// STUDY 1: MAURER ROSE
let n = 6;
let d = 71;

function drawMaurerRose() {
  background(10);
  translate(width / 2, height / 2);
  noFill();

  let dim = min(width, height);
  let rBase = dim * 0.42;

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    n = floor(map(mouseX, 0, width, 2, 20));
    d = floor(map(mouseY, 0, height, 1, 180));
  }

  strokeWeight(2.6);
  stroke(84, 214, 255, 22);
  beginShape();
  for (let i = 0; i < 361; i++) {
    let k = i * d;
    let r = rBase * sin(n * k);
    let x = r * cos(k);
    let y = r * sin(k);
    vertex(x, y);
  }
  endShape();

  strokeWeight(1.2);
  stroke(84, 214, 255, 110);
  beginShape();
  for (let i = 0; i < 361; i++) {
    let k = i * d;
    let r = rBase * sin(n * k);
    let x = r * cos(k);
    let y = r * sin(k);
    vertex(x, y);
  }
  endShape();

  stroke(255, 128, 172, 28);
  strokeWeight(3.6);
  beginShape();
  for (let i = 0; i < 361; i++) {
    let k = i;
    let r = rBase * sin(n * k);
    let x = r * cos(k);
    let y = r * sin(k);
    vertex(x, y);
  }
  endShape();

  stroke(255, 128, 172, 205);
  strokeWeight(2.1);
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
  text(`Math: r = sin(n * k)\nn: ${n}\nd: ${d}`, 40, 100);
}
