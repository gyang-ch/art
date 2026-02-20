if (window.ScrollToPlugin) {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
} else {
  gsap.registerPlugin(ScrollTrigger);
}

const sections = gsap.utils.toArray("section");
const artSections = gsap.utils.toArray("section[data-mode]");
const navContainer = document.getElementById("progress-nav");
const glow = document.getElementById("transition-glow");
const tickerText = document.getElementById("ticker-text");
const previewLinks = gsap.utils.toArray(".preview-link");
const regenerateMolnarBtn = document.getElementById("regenerate-molnar-btn");
const scribbleControls = document.getElementById("scribble-controls");
const scribbleRandomnessInput = document.getElementById("scribble-randomness");
const scribbleDensityInput = document.getElementById("scribble-density");
const scribbleTextureInput = document.getElementById("scribble-texture");
const scribbleRandomnessValue = document.getElementById("scribble-randomness-value");
const scribbleDensityValue = document.getElementById("scribble-density-value");
const scribbleTextureValue = document.getElementById("scribble-texture-value");
const introSection = document.getElementById("intro");
const introTitle = document.getElementById("intro-title");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

// --- Panel Parallax Logic ---
window.addEventListener("mousemove", (e) => {
  if (prefersReducedMotion()) return;
  const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
  const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

  gsap.to(".active .panel", {
    x: xPercent * 15,
    y: yPercent * 15,
    rotateY: xPercent * 2,
    rotateX: -yPercent * 2,
    duration: 0.8,
    ease: "power2.out"
  });
});

window.updateCaptionFx = (title, desc) => {
  const panelEl = document.getElementById("info-panel");
  const captionEl = document.getElementById("caption");
  const hasCaption = Boolean(title && title.trim()) || Boolean(desc && desc.trim());

  if (!hasCaption) {
    gsap.to(panelEl, { opacity: 0, scale: 0.95, duration: 0.4, ease: "power2.inOut", onComplete: () => { panelEl.style.display = "none"; } });
    return;
  }

  panelEl.style.display = "block";
  gsap.to(captionEl, {
    opacity: 0,
    y: 8,
    duration: 0.25,
    ease: "power2.in",
    onComplete: () => {
      captionEl.innerHTML = `<span class='highlight'>${title}</span> <br>${desc}`;
      gsap.fromTo(captionEl,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }
      );
      gsap.to(panelEl, { opacity: 1, scale: 1, duration: 0.4 });
    }
  });
};

// --- Magnetic Effect Logic ---
previewLinks.forEach(link => {
  link.addEventListener("mousemove", (e) => {
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(link, {
      x: x * 0.3,
      y: y * 0.3,
      rotateX: -y * 0.1,
      rotateY: x * 0.1,
      duration: 0.4,
      ease: "power2.out"
    });
  });
  link.addEventListener("mouseleave", () => {
    gsap.to(link, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
  });
});

// --- Intro Title Parallax ---
window.addEventListener("mousemove", (e) => {
  if (prefersReducedMotion()) return;
  const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
  const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

  if (introSection.classList.contains("active")) {
    gsap.to(introTitle, {
      x: xPercent * 20,
      y: yPercent * 20,
      rotateY: xPercent * 5,
      rotateX: -yPercent * 5,
      duration: 1,
      ease: "power2.out"
    });
  }
});

let activeMode = 0;
let introTitleFloatTween = null;
let navScrollTween = null;
let navJumpTargetId = null;
let introTitleChars = [];
const navLinks = [];
const starProgressStops = [];
const svgNS = "http://www.w3.org/2000/svg";
let constellationFluidRect = null;
let constellationFluidWave = null;
let constellationBarBottom = 0;
let constellationBarHeight = 0;
const prefersReducedMotion = () => reducedMotionQuery.matches;
const MOTION = {
  fast: prefersReducedMotion() ? 0.12 : 0.3,
  medium: prefersReducedMotion() ? 0.2 : 0.65,
  slow: prefersReducedMotion() ? 0.25 : 1.05,
  easeOut: "power2.out",
  easeInOut: "power2.inOut"
};
if (window.setReducedMotion) {
  window.setReducedMotion(prefersReducedMotion());
}

function splitIntroTitleChars() {
  if (!introTitle || introTitle.dataset.splitReady === "true") return;
  const lines = introTitle.innerHTML
    .split(/<br\s*\/?>/i)
    .map(line => line.trim())
    .filter(Boolean);

  const splitMarkup = lines.map(line => {
    const chars = Array.from(line).map(char => {
      if (char === " ") {
        return "<span class=\"title-char title-char-space\" aria-hidden=\"true\">&nbsp;</span>";
      }
      return `<span class="title-char" data-char="${char}" aria-hidden="true">${char}</span>`;
    }).join("");
    return `<span class="title-line">${chars}</span>`;
  }).join("");

  introTitle.setAttribute("aria-label", lines.join(" "));
  introTitle.innerHTML = splitMarkup;
  introTitle.dataset.splitReady = "true";
  introTitleChars = gsap.utils.toArray("#intro-title .title-char");
}

function animateIntroTitle() {
  if (!introTitle || introTitleChars.length === 0) return;
  if (introTitleFloatTween) {
    introTitleFloatTween.kill();
    introTitleFloatTween = null;
  }
  introTitle.classList.add("title-fx-ink");

  if (prefersReducedMotion()) {
    gsap.set(introTitleChars, {
      opacity: 1,
      yPercent: 0,
      x: 0,
      y: 0,
      rotateX: 0,
      rotateZ: 0,
      filter: "none",
      "--ink-reveal": "0%"
    });
    gsap.set(introTitle, { yPercent: 0, autoAlpha: 1, filter: "none" });
    return;
  }

  gsap.set(introTitleChars, {
    clearProps: "transform,filter,opacity",
    "--ink-reveal": "100%",
    transformOrigin: "50% 100%"
  });
  gsap.set(introTitle, { yPercent: 0, autoAlpha: 1, filter: "none" });
  gsap.set(introTitleChars, { "--ink-reveal": "100%", opacity: 1, yPercent: 0, rotateX: 0 });
  gsap.timeline()
    .fromTo(
      introTitleChars,
      { "--ink-reveal": "100%", yPercent: 24, filter: "blur(2px)" },
      {
        "--ink-reveal": "0%",
        yPercent: 0,
        filter: "blur(0px)",
        duration: 0.72,
        ease: "power2.out",
        stagger: 0.04
      }
    );

  if (introTitle.dataset.glitchBound !== "true") {
    // Hover-triggered shake effect for the intro title.
    introTitle.addEventListener("mouseenter", () => {
      gsap.to(introTitleChars, {
        x: () => (Math.random() - 0.5) * 10,
        y: () => (Math.random() - 0.5) * 10,
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        ease: "none",
        onComplete: () => gsap.to(introTitleChars, { x: 0, y: 0, duration: 0.2 })
      });
    });
    introTitle.dataset.glitchBound = "true";
  }

  introTitleFloatTween = gsap.to(introTitle, {
    yPercent: -2,
    duration: 2.6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });
}

function stopPreviewRailAnimation() {
  if (previewLinks.length) {
    gsap.killTweensOf(previewLinks);
    gsap.set(previewLinks, { autoAlpha: 1, y: 0, scale: 1, filter: "none" });
  }
}

function animatePreviewRail() {
  if (!previewLinks.length) return;
  stopPreviewRailAnimation();

  if (prefersReducedMotion()) {
    return;
  }

  gsap.fromTo(
    previewLinks,
    { autoAlpha: 0, y: 18, scale: 0.98, filter: "blur(4px)" },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.52,
      ease: "power2.out",
      stagger: 0.045
    }
  );
}

function setupPreviewSheen() {
  if (!previewLinks.length) return;

  const createPreviewSvg = (width, height, className, childType, childAttributes) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add(className);
    svg.setAttributeNS("http://www.w3.org/2000/svg", "viewBox", `0 0 ${width} ${height}`);
    const child = document.createElementNS("http://www.w3.org/2000/svg", childType);
    for (const attr in childAttributes) {
      child.setAttribute(attr, childAttributes[attr]);
    }
    svg.appendChild(child);
    return { svg, child };
  };

  previewLinks.forEach(link => {
    const sheen = link.querySelector(".preview-sheen");
    if (!sheen) return;
    gsap.set(sheen, { xPercent: -140, opacity: 0, skewX: -16 });

    if (!link.dataset.fxReady) {
      const width = Math.max(72, Math.round(link.offsetWidth));
      const height = Math.max(42, Math.round(link.offsetHeight));
      const radius = Math.max(8, parseInt(getComputedStyle(link).borderRadius, 10) || 10);

      const strokeGroup = document.createElement("div");
      strokeGroup.classList.add("preview-stroke");
      const { svg: strokeSvg } = createPreviewSvg(width, height, "stroke-line", "rect", {
        x: "0",
        y: "0",
        width: "100%",
        height: "100%",
        rx: radius,
        ry: radius,
        pathLength: "10"
      });
      const strokeClone = strokeSvg.cloneNode(true);
      strokeGroup.appendChild(strokeSvg);
      strokeGroup.appendChild(strokeClone);
      link.appendChild(strokeGroup);
      link.dataset.fxReady = "true";
    }

    link.addEventListener("pointerenter", () => {
      if (prefersReducedMotion()) return;
      link.classList.add("fx-active");
      gsap.killTweensOf(sheen);
      gsap.fromTo(
        sheen,
        { xPercent: -140, opacity: 0, skewX: -16 },
        {
          xPercent: 180,
          skewX: -16,
          duration: 1.1,
          ease: "power2.out",
          keyframes: [
            { opacity: 0.0, duration: 0.0 },
            { opacity: 0.9, duration: 0.32, ease: "power2.out" },
            { opacity: 0.0, duration: 0.78, ease: "power2.out" }
          ]
        }
      );
    });

    link.addEventListener("pointerleave", () => {
      link.classList.remove("fx-active");
      gsap.killTweensOf(sheen);
      gsap.to(sheen, { opacity: 0, duration: 0.2, ease: "power2.out" });
    });
  });
}


function buildConstellationPoints(progressStops, barY, barHeight, trackX) {
  return progressStops.map((stop) => ({
    x: trackX,
    y: barY + gsap.utils.clamp(0, 1, stop) * barHeight
  }));
}

function getScrollMax() {
  const docMax = (document.documentElement.scrollHeight || 0) - window.innerHeight;
  const triggerMax = ScrollTrigger.maxScroll(window) || 0;
  return Math.max(1, docMax, triggerMax);
}

function getSectionNavTargetTop(section) {
  if (!section) return 0;
  const maxScroll = getScrollMax();
  const anchorTop = section.offsetTop - window.innerHeight * 0.5;
  return gsap.utils.clamp(0, maxScroll, anchorTop);
}

function getSectionNavProgress(section) {
  const maxScroll = getScrollMax();
  return gsap.utils.clamp(0, 1, getSectionNavTargetTop(section) / maxScroll);
}

function getNavProgressFromScroll(scrollY) {
  if (!artSections.length) return 0;
  const y = Number(scrollY) || 0;
  const maxScroll = getScrollMax();
  return gsap.utils.clamp(0, 1, y / maxScroll);
}

function setConstellationProgress(percent) {
  if (!constellationFluidRect || !constellationFluidWave) return;
  const bounded = gsap.utils.clamp(0, 1, percent);
  const fluidHeight = Math.max(0, constellationBarHeight * bounded);
  const topY = constellationBarBottom - constellationBarHeight;
  const frontierY = topY + fluidHeight;
  constellationFluidRect.setAttribute("y", String(topY));
  constellationFluidRect.setAttribute("height", String(fluidHeight));

  if (fluidHeight <= 0.5) {
    constellationFluidWave.setAttribute("d", "");
    return;
  }

  const waveY = frontierY;
  const leftX = Number(constellationFluidRect.getAttribute("x"));
  const barWidth = Number(constellationFluidRect.getAttribute("width"));
  const rightX = leftX + barWidth;
  const d = `M ${leftX} ${waveY} L ${rightX} ${waveY}`;
  constellationFluidWave.setAttribute("d", d);
}

function pingStar(star) {
  if (!star || prefersReducedMotion()) return;
  const core = star.querySelector(".star-core");
  const orbit = star.querySelector(".star-orbit");
  if (!core) return;
  
  gsap.killTweensOf([core, orbit]);
  
  // Smooth elastic pop for the inner core
  gsap.fromTo(
    core,
    { scale: 0.8 },
    { scale: 1.25, duration: 0.8, ease: "elastic.out(1.2, 0.4)", transformOrigin: "center" }
  );

  if (orbit) {
    // Elegant ring expansion
    gsap.fromTo(
      orbit,
      { scale: 0.5, opacity: 0 },
      { scale: 1.15, opacity: 1, duration: 0.8, ease: "power2.out", transformOrigin: "center" }
    );
  }
}

function buildConstellationNav() {
  if (!navContainer) return;
  navContainer.innerHTML = "";
  navLinks.length = 0;
  starProgressStops.length = 0;

  const width = 110;
  const height = 550;
  const barWidth = 34; // Wider polished bar
  const barHeight = height - 68;
  const barX = Math.round((width - barWidth) / 2);
  const barY = 34;
  const barRadius = 17; // Perfect pill shape
  const trackCenterX = barX + barWidth / 2;
  const progressStops = artSections.map((section) => getSectionNavProgress(section));
  const points = buildConstellationPoints(progressStops, barY, barHeight, trackCenterX);

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("class", "constellation-map");
  svg.setAttribute("aria-hidden", "true");

  const defs = document.createElementNS(svgNS, "defs");
  const gradientId = "fluid-gradient";
  const gradient = document.createElementNS(svgNS, "linearGradient");
  gradient.setAttribute("id", gradientId);
  gradient.setAttribute("x1", "0%");
  gradient.setAttribute("y1", "100%");
  gradient.setAttribute("x2", "0%");
  gradient.setAttribute("y2", "0%");
  const stop1 = document.createElementNS(svgNS, "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("style", "stop-color: #2EC4B6; stop-opacity: 0.95");
  const stop2 = document.createElementNS(svgNS, "stop");
  stop2.setAttribute("offset", "45%");
  stop2.setAttribute("style", "stop-color: #4CC9F0; stop-opacity: 0.96");
  const stop3 = document.createElementNS(svgNS, "stop");
  stop3.setAttribute("offset", "100%");
  stop3.setAttribute("style", "stop-color: #F72585; stop-opacity: 0.92");
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  gradient.appendChild(stop3);
  
  if (!prefersReducedMotion()) {
    const animate = document.createElementNS(svgNS, "animateTransform");
    animate.setAttribute("attributeName", "gradientTransform");
    animate.setAttribute("type", "translate");
    animate.setAttribute("values", "0 0; 0 -24; 0 0");
    animate.setAttribute("dur", "5.6s");
    animate.setAttribute("repeatCount", "indefinite");
    gradient.appendChild(animate);
  }

  const clipPath = document.createElementNS(svgNS, "clipPath");
  const clipId = "bar-fluid-clip";
  clipPath.setAttribute("id", clipId);
  const clipRect = document.createElementNS(svgNS, "rect");
  clipRect.setAttribute("x", String(barX));
  clipRect.setAttribute("y", String(barY));
  clipRect.setAttribute("width", String(barWidth));
  clipRect.setAttribute("height", String(barHeight));
  clipRect.setAttribute("rx", String(barRadius));
  clipRect.setAttribute("ry", String(barRadius));
  clipPath.appendChild(clipRect);

  defs.appendChild(gradient);
  defs.appendChild(clipPath);
  svg.appendChild(defs);

  // Outer glassmorphism casing
  const trackBorderOuter = document.createElementNS(svgNS, "rect");
  trackBorderOuter.setAttribute("class", "constellation-track-border-outer");
  trackBorderOuter.setAttribute("x", String(barX - 7));
  trackBorderOuter.setAttribute("y", String(barY - 7));
  trackBorderOuter.setAttribute("width", String(barWidth + 14));
  trackBorderOuter.setAttribute("height", String(barHeight + 14));
  trackBorderOuter.setAttribute("rx", String(barRadius + 7));
  trackBorderOuter.setAttribute("ry", String(barRadius + 7));

  const trackFill = document.createElementNS(svgNS, "rect");
  trackFill.setAttribute("class", "constellation-track-fill");
  trackFill.setAttribute("x", String(barX));
  trackFill.setAttribute("y", String(barY));
  trackFill.setAttribute("width", String(barWidth));
  trackFill.setAttribute("height", String(barHeight));
  trackFill.setAttribute("rx", String(barRadius));
  trackFill.setAttribute("ry", String(barRadius));

  const fluidLayer = document.createElementNS(svgNS, "g");
  fluidLayer.setAttribute("class", "constellation-fluid-layer");
  fluidLayer.setAttribute("clip-path", `url(#${clipId})`);

  const fluidRect = document.createElementNS(svgNS, "rect");
  fluidRect.setAttribute("class", "constellation-fluid-fill");
  fluidRect.setAttribute("x", String(barX));
  fluidRect.setAttribute("y", String(barY));
  fluidRect.setAttribute("width", String(barWidth));
  fluidRect.setAttribute("height", "0");
  fluidRect.setAttribute("fill", `url(#${gradientId})`);

  const fluidWave = document.createElementNS(svgNS, "path");
  fluidWave.setAttribute("class", "constellation-fluid-wave");
  fluidWave.setAttribute("d", "");

  fluidLayer.appendChild(fluidRect);
  fluidLayer.appendChild(fluidWave);

  const trackBorder = document.createElementNS(svgNS, "rect");
  trackBorder.setAttribute("class", "constellation-track-border");
  trackBorder.setAttribute("x", String(barX));
  trackBorder.setAttribute("y", String(barY));
  trackBorder.setAttribute("width", String(barWidth));
  trackBorder.setAttribute("height", String(barHeight));
  trackBorder.setAttribute("rx", String(barRadius));
  trackBorder.setAttribute("ry", String(barRadius));

  svg.appendChild(trackBorderOuter);
  svg.appendChild(trackFill);
  svg.appendChild(fluidLayer);
  svg.appendChild(trackBorder);

  artSections.forEach((section, index) => {
    const point = points[index];
    const ratio = progressStops[index];
    const group = document.createElementNS(svgNS, "g");
    group.setAttribute("class", "star-node");
    group.setAttribute("transform", `translate(${point.x} ${point.y})`);
    group.dataset.sectionId = section.id;
    group.dataset.progress = String(ratio);
    group.setAttribute("role", "button");
    group.setAttribute("tabindex", "0");
    group.setAttribute("aria-label", section.dataset.label || `Study ${index + 1}`);

    const halo = document.createElementNS(svgNS, "circle");
    halo.setAttribute("class", "star-halo");
    halo.setAttribute("cx", "0");
    halo.setAttribute("cy", "0");
    halo.setAttribute("r", "20"); // Expanded hover area

    const orbit = document.createElementNS(svgNS, "circle");
    orbit.setAttribute("class", "star-orbit");
    orbit.setAttribute("cx", "0");
    orbit.setAttribute("cy", "0");
    orbit.setAttribute("r", "15"); // Solid highlight ring

    const core = document.createElementNS(svgNS, "circle");
    core.setAttribute("class", "star-core");
    core.setAttribute("cx", "0");
    core.setAttribute("cy", "0");
    core.setAttribute("r", "7.5"); // Sleeker core dot

    const core2 = document.createElementNS(svgNS, "circle");
    core2.setAttribute("class", "star-core2");
    core2.setAttribute("cx", "0");
    core2.setAttribute("cy", "0");
    core2.setAttribute("r", "3"); // Tiny center highlight

    group.appendChild(halo);
    group.appendChild(orbit);
    group.appendChild(core);
    group.appendChild(core2);
    svg.appendChild(group);
    navLinks.push(group);
    starProgressStops.push(ratio);

    const clickHandler = (event) => {
      event.preventDefault();
      const targetId = group.dataset.sectionId;
      if (!targetId) return;
      setActiveNav(targetId);
      const sectionIndex = sections.findIndex(currentSection => currentSection.id === targetId);
      scrollToSectionIndex(sectionIndex, targetId);
    };
    group.addEventListener("click", clickHandler);
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        clickHandler(event);
      }
    });
  });

  navContainer.appendChild(svg);
  constellationFluidRect = fluidRect;
  constellationFluidWave = fluidWave;
  constellationBarBottom = barY + barHeight;
  constellationBarHeight = barHeight;

  if (!prefersReducedMotion()) {
    gsap.fromTo(
      gradient,
      { attr: { y1: "100%", y2: "0%" } },
      {
        attr: { y1: "110%", y2: "-10%" },
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }
    );
    gsap.fromTo(
      svg,
      { autoAlpha: 0, y: 20, filter: "blur(6px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out" }
    );
  }
  setConstellationProgress(0);
}


function setArtworkContrastMode(modeNumber) {
  document.body.classList.toggle("light-artwork", modeNumber === 7 || modeNumber === 8 || modeNumber === 10);
}

function setActiveNav(id) {
  navLinks.forEach((link) => {
    const isActive = Boolean(id) && link.dataset.sectionId === id;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
      pingStar(link);
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function setActivePreview(id) {
  previewLinks.forEach(link => {
    const isActive = link.dataset.target === id;
    link.classList.toggle("active", isActive);
  });
}

function updateTicker(section) {
  if (!section || !tickerText) return;
  const newLabel = section.dataset.label || section.id || "Live";

  if (prefersReducedMotion()) {
    tickerText.textContent = newLabel;
    return;
  }

  gsap.to(tickerText, {
    opacity: 0,
    x: -12,
    duration: 0.18,
    ease: "power2.in",
    onComplete: () => {
      tickerText.textContent = newLabel;
      gsap.fromTo(tickerText,
        { opacity: 0, x: 12 },
        { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  });
}

function setReachedDots(percent) {
  navLinks.forEach((link, index) => {
    const stop = starProgressStops[index] || Number(link.dataset.progress || 0);
    link.classList.toggle("reached", percent >= stop);
  });
  setConstellationProgress(percent);
}

function runModeTransitionFx() {
  const reduced = prefersReducedMotion();
  const tl = gsap.timeline();

  tl.fromTo(
    "#canvas-container",
    reduced
      ? { scale: 1, filter: "none" }
      : {
          scale: 1.08,
          filter: "blur(15px) saturate(1.5) contrast(1.1)",
          skewX: 1
        },
    {
      scale: 1,
      filter: "none",
      skewX: 0,
      duration: MOTION.slow,
      ease: "expo.out"
    }
  );

  // Flash effect
  tl.fromTo(glow,
    { opacity: 0.8, scale: 1.2 },
    { opacity: 0, scale: 1, duration: MOTION.medium, ease: "power2.out" },
    0
  );
}

function syncScribbleControlLabels() {
  if (!scribbleRandomnessInput || !scribbleDensityInput || !scribbleTextureInput) return;
  if (scribbleRandomnessValue) {
    scribbleRandomnessValue.textContent = `${scribbleRandomnessInput.value}%`;
  }
  if (scribbleDensityValue) {
    scribbleDensityValue.textContent = scribbleDensityInput.value;
  }
  if (scribbleTextureValue) {
    scribbleTextureValue.textContent = scribbleTextureInput.value;
  }
}

function applyScribbleControlValues() {
  if (!scribbleRandomnessInput || !scribbleDensityInput || !scribbleTextureInput) return;
  if (!window.setScribbleGridParams) return;
  window.setScribbleGridParams({
    randomness: Number(scribbleRandomnessInput.value) / 100,
    density: Number(scribbleDensityInput.value),
    texture: Number(scribbleTextureInput.value)
  });
  if (window.regenerateScribbleGrid) {
    window.regenerateScribbleGrid();
  }
}

function activateSection(section) {
  const newMode = Number(section.dataset.mode);

  if (!Number.isNaN(newMode) && newMode !== activeMode) {
    changeMode(newMode);
    activeMode = newMode;
    setArtworkContrastMode(activeMode);
    runModeTransitionFx();
  }

  sections.forEach(s => s.classList.remove("active"));
  section.classList.add("active");
  stopPreviewRailAnimation();
  setActiveNav(section.id);
  setActivePreview(section.id);
  updateTicker(section);
  if (regenerateMolnarBtn) {
    regenerateMolnarBtn.classList.toggle("visible", section.id === "s7");
  }
  if (scribbleControls) {
    scribbleControls.classList.toggle("visible", section.id === "s8");
  }
}

function getCurrentSectionIndex() {
  const activeIdx = sections.findIndex(section => section.classList.contains("active"));
  if (activeIdx >= 0) return activeIdx;

  let closestIdx = 0;
  let closestDist = Infinity;
  const y = window.scrollY;
  sections.forEach((section, idx) => {
    const dist = Math.abs(section.offsetTop - y);
    if (dist < closestDist) {
      closestDist = dist;
      closestIdx = idx;
    }
  });
  return closestIdx;
}

function scrollToSectionIndex(index, targetId = null) {
  const bounded = gsap.utils.clamp(0, sections.length - 1, index);
  const targetTop = getSectionNavTargetTop(sections[bounded]);
  navJumpTargetId = targetId || sections[bounded].id || null;
  if (navScrollTween) {
    navScrollTween.kill();
    navScrollTween = null;
  }
  if (window.ScrollToPlugin) {
    navScrollTween = gsap.to(window, {
      scrollTo: { y: targetTop, autoKill: true },
      duration: prefersReducedMotion() ? 0.01 : 0.68,
      ease: "power2.inOut",
      onComplete: () => {
        const targetSection = sections[bounded];
        navJumpTargetId = null;
        if (targetSection && targetSection.dataset && targetSection.dataset.mode) {
          activateSection(targetSection);
        }
        navScrollTween = null;
      },
      onInterrupt: () => {
        navJumpTargetId = null;
        navScrollTween = null;
      }
    });
  } else {
    if (prefersReducedMotion()) {
      window.scrollTo({ top: targetTop, behavior: "auto" });
      const targetSection = sections[bounded];
      navJumpTargetId = null;
      if (targetSection && targetSection.dataset && targetSection.dataset.mode) {
        activateSection(targetSection);
      }
      return;
    }
    const positionProxy = { y: window.scrollY };
    navScrollTween = gsap.to(positionProxy, {
      y: targetTop,
      duration: 0.68,
      ease: "power2.inOut",
      onUpdate: () => {
        window.scrollTo(0, positionProxy.y);
      },
      onComplete: () => {
        const targetSection = sections[bounded];
        navJumpTargetId = null;
        if (targetSection && targetSection.dataset && targetSection.dataset.mode) {
          activateSection(targetSection);
        }
        navScrollTween = null;
      },
      onInterrupt: () => {
        navJumpTargetId = null;
        navScrollTween = null;
      }
    });
  }
}

sections.forEach((section, i) => {
  const panel = section.querySelector(".panel");
  if (!panel) return;

  const baseX = i % 2 === 0 ? -60 : 60;
  if (prefersReducedMotion()) {
    gsap.fromTo(
      panel,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: MOTION.fast,
        ease: MOTION.easeOut,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  } else {
    gsap.fromTo(
      panel,
      { autoAlpha: 0, x: baseX, y: 16, filter: "blur(8px)" },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        ease: MOTION.easeOut,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 45%",
          scrub: MOTION.medium
        }
      }
    );
  }
});

artSections.forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onEnter: () => {
      if (navJumpTargetId && navJumpTargetId !== section.id) return;
      activateSection(section);
    },
    onEnterBack: () => {
      if (navJumpTargetId && navJumpTargetId !== section.id) return;
      activateSection(section);
    }
  });
});

if (introSection) {
  ScrollTrigger.create({
    trigger: introSection,
    start: "top center",
    end: "bottom center",
    onEnter: () => {
      if (navJumpTargetId) return;
      sections.forEach(s => s.classList.remove("active"));
      introSection.classList.add("active");
      animatePreviewRail();
      setActiveNav("");
      setActivePreview("");
      updateTicker({ dataset: { label: "Front Page" }, id: "intro" });
      if (regenerateMolnarBtn) regenerateMolnarBtn.classList.remove("visible");
      if (scribbleControls) scribbleControls.classList.remove("visible");
      if (activeMode !== 0) {
        changeMode(0);
        activeMode = 0;
        setArtworkContrastMode(activeMode);
        runModeTransitionFx();
      }
    },
    onEnterBack: () => {
      if (navJumpTargetId) return;
      sections.forEach(s => s.classList.remove("active"));
      introSection.classList.add("active");
      animatePreviewRail();
      setActiveNav("");
      setActivePreview("");
      updateTicker({ dataset: { label: "Front Page" }, id: "intro" });
      if (regenerateMolnarBtn) regenerateMolnarBtn.classList.remove("visible");
      if (scribbleControls) scribbleControls.classList.remove("visible");
      if (activeMode !== 0) {
        changeMode(0);
        activeMode = 0;
        setArtworkContrastMode(activeMode);
        runModeTransitionFx();
      }
    }
  });
}

ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: () => {
    const percent = getNavProgressFromScroll(window.scrollY);
    setReachedDots(percent);
    if (window.setScrollProgress) {
      window.setScrollProgress(percent);
    }
  }
});

if (!prefersReducedMotion()) {
  ScrollTrigger.create({
    snap: {
      snapTo: (value) => {
        if (navJumpTargetId) return value;
        const currentIdx = getCurrentSectionIndex();
        const rawIdx = Math.round(value * (sections.length - 1));
        const boundedIdx = gsap.utils.clamp(currentIdx - 1, currentIdx + 1, rawIdx);
        const steps = sections.length - 1;
        return boundedIdx / steps;
      },
      duration: MOTION.medium,
      ease: MOTION.easeInOut
    }
  });
}

reducedMotionQuery.addEventListener("change", (event) => {
  if (window.setReducedMotion) {
    window.setReducedMotion(event.matches);
  }
  if (event.matches) {
    gsap.set(".preview-sheen", { opacity: 0, xPercent: -140, skewX: -16 });
    previewLinks.forEach(link => {
      link.classList.remove("fx-active");
    });
  }
  animateIntroTitle();
  setConstellationProgress(getNavProgressFromScroll(window.scrollY));
  if (introSection && introSection.classList.contains("active")) {
    animatePreviewRail();
  } else {
    stopPreviewRailAnimation();
  }
  ScrollTrigger.refresh();
});

buildConstellationNav();
splitIntroTitleChars();
animateIntroTitle();
setActiveNav("");
setActivePreview("");
setReachedDots(0);
updateTicker({ dataset: { label: "Front Page" }, id: "intro" });
setupPreviewSheen();
if (regenerateMolnarBtn) {
  regenerateMolnarBtn.classList.remove("visible");
  regenerateMolnarBtn.addEventListener("click", () => {
    if (window.regenerateMolnarStudy) {
      window.regenerateMolnarStudy();
    }
  });
}
if (scribbleControls && scribbleRandomnessInput && scribbleDensityInput && scribbleTextureInput) {
  scribbleControls.classList.remove("visible");
  if (window.getScribbleGridParams) {
    const initial = window.getScribbleGridParams();
    scribbleRandomnessInput.value = String(Math.round((initial.randomness || 0) * 100));
    scribbleDensityInput.value = String(initial.density || 120);
    scribbleTextureInput.value = String(initial.texture || 3000);
  }
  syncScribbleControlLabels();
  [scribbleRandomnessInput, scribbleDensityInput, scribbleTextureInput].forEach((input) => {
    input.addEventListener("input", () => {
      syncScribbleControlLabels();
      applyScribbleControlValues();
    });
  });
}
changeMode(0);
setArtworkContrastMode(0);
runModeTransitionFx();
