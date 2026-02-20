// STUDY 7: MOLNAR QUADRILATERAL STRUCTURE
let molnarCells = [];

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
    [188, 88, 58, 0.62],
    [73, 128, 126, 0.58],
    [72, 96, 148, 0.6],
    [32, 32, 34, 0.72],
    [126, 102, 145, 0.58]
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
          random(half - jitter, half + jitter), random(-half - jitter, -half + jitter),
          random(half - jitter, half + jitter), random(half - jitter, half + jitter),
          random(-half - jitter, -half + jitter), random(half - jitter, half + jitter)
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
