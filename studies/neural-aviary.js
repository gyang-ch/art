// STUDY 5: THE NEURAL AVIARY
let aviaryParticles = [];
let aviaryNumParticles = 1200;
let aviaryFlowField = [];
let aviaryResolution = 20;
let aviaryCols = 0;
let aviaryRows = 0;
let aviarySeed = 0;
let aviaryZoff = 0; // NEW: Added time variable for dynamic flow
let aviaryPalettes = [
  ["#000000", "#1E5631", "#A4DE02", "#76BA99", "#FFFFFF"],
  ["#0B0C10", "#1F2833", "#C5C6C7", "#66FCF1", "#45A29E"],
  ["#230F2B", "#F21D41", "#EBEBBC", "#BCE3C5", "#82B3AE"]
];
let aviaryCurrentPalette = aviaryPalettes[0];
let aviaryStartFrame = 0;
let aviaryRenderComplete = false;

function initNeuralAviary() {
  aviarySeed = floor(random(10000));
  randomSeed(aviarySeed);
  noiseSeed(aviarySeed);
  
  aviaryZoff = random(1000); // Initialize with a random starting point in the noise space

  aviaryCols = floor(width / aviaryResolution);
  aviaryRows = floor(height / aviaryResolution);
  aviaryFlowField = new Array(aviaryCols * aviaryRows);
  aviaryParticles = [];

  aviaryCurrentPalette = random(aviaryPalettes);
  background(aviaryCurrentPalette[0]);

  for (let i = 0; i < aviaryNumParticles; i++) {
    aviaryParticles[i] = new AviaryParticle();
  }

  aviaryStartFrame = frameCount;
  aviaryRenderComplete = false;
}

function drawNeuralAviary() {
  let yoff = 0;
  for (let y = 0; y < aviaryRows; y++) {
    let xoff = 0;
    for (let x = 0; x < aviaryCols; x++) {
      let index = x + y * aviaryCols;
      
      // CHANGED: Added aviaryZoff to the noise function so the field shifts over time
      let angle = noise(xoff, yoff, aviaryZoff) * TWO_PI * 4; 
      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.5);
      aviaryFlowField[index] = v;
      
      // CHANGED: Reduced increment from 0.1 to 0.05 for smoother spatial transitions
      xoff += 0.05; 
    }
    yoff += 0.05;
  }
  
  // NEW: Increment zoff to evolve the flow field slowly each frame
  aviaryZoff += 0.003; 

  if (!aviaryRenderComplete) {
    blendMode(ADD);
    for (let i = 0; i < aviaryParticles.length; i++) {
      aviaryParticles[i].follow(aviaryFlowField);
      aviaryParticles[i].update();
      aviaryParticles[i].show();
      aviaryParticles[i].edges();
    }
    blendMode(BLEND);
  }

  if (!aviaryRenderComplete && frameCount - aviaryStartFrame > 600) {
    aviaryRenderComplete = true;
    console.log("Rendering Complete");
  }
}

class AviaryParticle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = random(1.5, 3.5); // Slightly bumped max speed to allow more fluid motion

    let c = color(random(aviaryCurrentPalette.slice(1)));
    c.setAlpha(15);
    this.color = c;
    this.prevPos = this.pos.copy();
  }

  follow(vectors) {
    let x = floor(this.pos.x / aviaryResolution);
    let y = floor(this.pos.y / aviaryResolution);
    x = constrain(x, 0, aviaryCols - 1);
    y = constrain(y, 0, aviaryRows - 1);
    let index = x + y * aviaryCols;
    let force = vectors[index];
    if (force) this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    // NEW: Add a tiny bit of random "wander" force to break up strict lines
    let wander = p5.Vector.random2D();
    wander.mult(0.1); 
    this.applyForce(wander);

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    stroke(this.color);
    let weight = map(this.vel.mag(), 0, 3, 2, 0.5);
    strokeWeight(weight);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

    if (random(1) < 0.005) {
      stroke(255, 30);
      strokeWeight(0.5);
      let offset = p5.Vector.random2D().mult(20);
      line(this.pos.x, this.pos.y, this.pos.x + offset.x, this.pos.y + offset.y);
    }

    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }
}