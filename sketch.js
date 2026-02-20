let mode = 0;

let scrollPos = 0;
let transitionPulse = 0;
let reducedMotion = false;
let motionFactor = 1;

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
  initScribbleGridStudy();
};

window.regenerateMolnarStudy = function() {
  initMolnarQuadrilateralStudy();
};

window.regenerateArtwork10 = function() {
  art10Dirty = true;
};

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("canvas-container");

  changeMode(0);
  window.changeMode = changeMode;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (mode === 2) initChromaticResonatorStudy();
  if (mode === 3) initBezierLoomWebGL();
  if (mode === 4) initQuantumWebGL();
  if (mode === 5) initNeuralAviary();
  if (mode === 6) initConstellationSegments();
  if (mode === 7) initMolnarQuadrilateralStudy();
  if (mode === 8) initScribbleGridStudy();
  if (mode === 9) initRibbonSurfaceStudy();
  if (mode === 10) initArtwork10Study();
  if (mode === 11) initArtwork11Study();
}

function draw() {
  if (mode === 0) {
    background(8);
  } else if (mode === 1) {
    drawMaurerRose();
  } else if (mode === 2) {
    drawRetroWave();
  } else if (mode === 3) {
    drawBezierLoom();
  } else if (mode === 4) {
    drawOscilloscope();
  } else if (mode === 5) {
    drawNeuralAviary();
  } else if (mode === 6) {
    drawConstellationSegments();
  } else if (mode === 7) {
    drawMolnarQuadrilateralStudy();
  } else if (mode === 8) {
    drawScribbleGridStudy();
  } else if (mode === 9) {
    drawRibbonSurfaceStudy();
  } else if (mode === 10) {
    drawArtwork10Study();
  } else if (mode === 11) {
    drawArtwork11Study();
  }

  drawTransitionOverlay();
}

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

function changeMode(newMode) {
  mode = newMode;

  const event = new CustomEvent("modeChanged", { detail: { mode: newMode } });
  window.dispatchEvent(event);

  if (mode === 0) {
    background(8);
    setCaption("", "");
  } else if (mode === 1) {
    background(10);
    setCaption("01 // Rose.", "Based on 'Generative Art with Math'. <br><b>Interact:</b> Move mouse X (petals) and Y (angle).");
  } else if (mode === 2) {
    initChromaticResonatorStudy();
    setCaption(
      "02 // The Chromatic Resonator.",
      "3D harmonic field in additive WEBGL. <br><b>Interact:</b> Mouse distance controls amplitude, click inverts rotation."
    );
  } else if (mode === 3) {
    background(10);
    initBezierLoomWebGL();
    setCaption("03 // Loom.", "Higher-order Bezier (De Casteljau). <br><b>Interact:</b> Mouse X controls density, mouse Y controls spread.");
  } else if (mode === 4) {
    background(0);
    initQuantumWebGL();
    oscPoints = [];
    setCaption("04 // Quantum.", "A tribute to Laposky & Franke. <br><b>Interact:</b> Mouse X changes frequency ratio, mouse Y changes rotation speed.");
  } else if (mode === 5) {
    initNeuralAviary();
    setCaption(
      "05 // The Neural Aviary.",
      "Flow-field particle painting with additive synaptic trails. <br><b>Interact:</b> Click to reseed composition; press S to export PNG."
    );
  } else if (mode === 6) {
    background(5);
    initConstellationSegments();
    setCaption(
      "06 // Constellation.",
      "Emergent 3D proximity network with collision repulsion. <br><b>Interact:</b> Move cursor away from center for larger expansion and stronger collisions; move toward center for tighter calm motion. Click/tap to pulse."
    );
  } else if (mode === 7) {
    background(242, 240, 232);
    initMolnarQuadrilateralStudy();
    setCaption(
      "07 // Quadrilateral Structure.",
      "Molnar-inspired generative grid. <br><b>Interact:</b> Click to regenerate composition."
    );
  } else if (mode === 8) {
    background(242, 238, 225);
    initScribbleGridStudy();
    setCaption(
      "08 // Rotated Scribble Grid.",
      "Layered perimeter lines with subtle mouse response. <br><b>Interact:</b> Use right-side sliders and regenerate for new composition."
    );
  } else if (mode === 9) {
    background(0);
    initRibbonSurfaceStudy();
    setCaption(
      "09 // Ribbon Surface.",
      "Twisted torus-like parametric ribbon in additive WEBGL. <br><b>Interact:</b> Drag to orbit."
    );
  } else if (mode === 10) {
    background(242, 240, 235);
    initArtwork10Study();
    setCaption(
      "10 // Fractured Web.",
      "Layered lines, arcs, and facets on a vintage-paper field. <br><b>Interact:</b> Click to regenerate composition."
    );
  } else if (mode === 11) {
    background(8, 10, 14);
    initArtwork11Study();
    setCaption(
      "11 // Isometric Pillar Wave.",
      "WebGL isometric heightfield driven by a radial sine wave. <br><b>Interact:</b> Motion is autonomous."
    );
  }
}

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

function mousePressed(event) {
  if (event && event.target && event.target.closest("#scribble-controls, .regenerate-btn")) {
    return;
  }
  if (mode === 2) {
    invertChromaticResonatorRotation();
  }
  if (mode === 5) {
    initNeuralAviary();
  }
  if (mode === 6) {
    triggerConstellationBurst();
  }
  if (mode === 7) {
    initMolnarQuadrilateralStudy();
  }
  if (mode === 8) {
    initScribbleGridStudy();
  }
  if (mode === 10) {
    art10Dirty = true;
  }
}

function keyPressed() {
  if (mode === 5 && (key === "s" || key === "S")) {
    saveCanvas("Emergent_Flux_" + aviarySeed, "png");
    return false;
  }
  return true;
}
