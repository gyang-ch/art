// Global runtime variables shared across all artwork modes.
let mode = 0;

let scrollPos = 0;
let transitionPulse = 0;
let reducedMotion = false;
let motionFactor = 1;

// Values pushed in by the scroll/controller layer.
window.setScrollProgress = function(p) {
  scrollPos = p;
};

window.setTransitionPulse = function(v) {
  transitionPulse = constrain(v, 0, 1);
};

window.setReducedMotion = function(v) {
  reducedMotion = !!v;
  motionFactor = reducedMotion ? 0.45 : 1;
};

window.regenerateScribbleGrid = function() {
  initScribble();
};

window.regenerateMolnarStudy = function() {
  initMolnar();
};

// p5js setup(): create the canvas and expose mode switching.
function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("canvas-container");
  changeMode(0);
  window.changeMode = changeMode;
}

// Rebuild active artwork when viewport changes size.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (mode === 1) initResonator();
  if (mode === 2) initQuantum();
  if (mode === 3) initMolnar();
  if (mode === 4) initFractal();
  if (mode === 5) initAviary();
  if (mode === 6) initConstellation();
  if (mode === 8) initScribble();
  if (mode === 9) initAizawa();
  if (mode === 10) initWeb();
}

// p5 draw(): render exactly one active artwork each frame.
function draw() {
  if (mode === 0) {
    background(8);
  } else if (mode === 1) {
    drawResonator();
  } else if (mode === 2) {
    drawQuantum();
  } else if (mode === 3) {
    drawMolnar();
  } else if (mode === 4) {
    drawFractal();
  } else if (mode === 5) {
    drawAviary();
  } else if (mode === 6) {
    drawConstellation();
  } else if (mode === 7) {
    drawMaurerRose();
  } else if (mode === 8) {
    drawScribble();
  } else if (mode === 9) {
    drawAizawa();
  } else if (mode === 10) {
    drawWeb();
  }

  drawTransitionOverlay();
}

// Post-processing glow used during mode transitions.
function drawTransitionOverlay() {
  if (transitionPulse <= 0.001) return;

  push();
  resetMatrix();

  const ctx = drawingContext;
  const cx = width * 0.5 + (mouseX - width * 0.5) * 0.15;
  const cy = height * 0.5 + (mouseY - height * 0.5) * 0.15;
  const maxRadius = max(width, height) * 0.7;

  const glow = ctx.createRadialGradient(cx, cy, maxRadius * 0.08, cx, cy, maxRadius);
  glow.addColorStop(0, `rgba(255, 255, 255, ${0.16 * transitionPulse})`);
  glow.addColorStop(0.45, `rgba(0, 220, 255, ${0.1 * transitionPulse})`);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  pop();
}

// Central mode router: initialises artwork + updates caption text.
function changeMode(newMode) {
  mode = newMode;

  const event = new CustomEvent("modeChanged", { detail: { mode: newMode } });
  window.dispatchEvent(event);

  if (mode === 0) {
    background(8);
    setCaption("", "");
  } else if (mode === 1) {
    initResonator();
    setCaption(
      "1. Resonator.",
      "<b>Interact:</b> Mouse distance controls amplitude; click inverts rotation."
    );
  } else if (mode === 2) {
    background(0);
    initQuantum();
    setCaption("2. Quantum.", "<b>Interact:</b> Arrow keys rotate the camera.");
  } else if (mode === 3) {
    background(15, 15, 18);
    initMolnar();
    setCaption(
      "3. Halvorsen.",
      "<b>Interact:</b> Arrow keys rotate camera, press C to clear, click to reset."
    );
  } else if (mode === 4) {
    background(0);
    initFractal();
    setCaption(
      "4. Fractal Lattice.",
      "<b>Interact:</b> Use right-side controls for depth, rotation, hue, and gap."
    );
  } else if (mode === 5) {
    initAviary();
    setCaption(
      "5. The Neural Aviary.",
      "<b>Interact:</b> Click to regenerate."
    );
  } else if (mode === 6) {
    background(5);
    initConstellation();
    setCaption(
      "6. Constellation.",
      "<b>Interact:</b> Move cursor for expansion/calm; click to pulse."
    );
  } else if (mode === 7) {
    background(10);
    setCaption("7. Rose.", "<b>Interact:</b> Move mouse X (petals) and Y (angle).");
  } else if (mode === 8) {
    background(242, 238, 225);
    initScribble();
    setCaption(
      "8. Rotated Scribble Grid.",
      "<b>Interact:</b> Click to regenerate."
    );
  } else if (mode === 9) {
    background(5, 5, 10);
    initAizawa();
    setCaption(
      "9. Aizawa Attractor.",
      "<b>Interact:</b> Drag to orbit and inspect in 3D."
    );
  } else if (mode === 10) {
    background(242, 240, 235);
    initWeb();
    setCaption(
      "10. Fractured Web.",
      "<b>Interact:</b> Click to regenerate."
    );
  }
}

// Updates the top-right card, or delegates to animated caption handler.
function setCaption(title, desc) {
  if (window.updateCaptionFx) {
    window.updateCaptionFx(title, desc);
    return;
  }

  const panelEl = document.getElementById("info-panel");
  const captionEl = document.getElementById("caption");
  const hasCaption = Boolean(title && title.trim()) || Boolean(desc && desc.trim());

  if (panelEl) {
    panelEl.style.display = hasCaption ? "block" : "none";
  }

  if (captionEl) {
    if (!hasCaption) {
      captionEl.innerHTML = "";
      return;
    }
    captionEl.innerHTML = `<span class='highlight'>${title}</span> <br>${desc}`;
  }
}

// Shared click interactions for artworks that react to clicks.
function mousePressed(event) {
  if (event && event.target && event.target.closest("#rose-controls, #scribble-controls, #fractal-controls, #resonator-controls, .regenerate-btn")) {
    return;
  } else if (mode === 1) {
    invertResonatorRotation();
  } else if (mode === 3) {
    initMolnar();
  } else if (mode === 5) {
    initAviary();
  } else if (mode === 6) {
    triggerConstellationBurst();
  } else if (mode === 8) {
    initScribble();
  } else if (mode === 10) {
    art10Dirty = true;
  }
}

// Keep p5 keyboard hook available (currently no key action).
function keyPressed() {
  return true;
}

function keyReleased() {
  if (mode === 3) {
    handleMolnarKeyReleased();
  }
  return true;
}
