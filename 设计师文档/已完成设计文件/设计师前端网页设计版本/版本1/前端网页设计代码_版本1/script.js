const homeView = document.querySelector('#home-view');
const applyView = document.querySelector('#apply-view');
const orbit = document.querySelector('#orbit');
const cards = [...document.querySelectorAll('.orbit-card')];
const trackInput = document.querySelector('#track');
const selectedTrack = document.querySelector('#selected-track');
const form = document.querySelector('#waitlist-form');
const success = document.querySelector('#success');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 680px)');
const beachStory = document.querySelector('#beach-story');
const beachVisual = document.querySelector('#beach-visual');
const beachDragLayer = document.querySelector('#beach-drag-layer');
const beachMainImage = document.querySelector('.beach-main-image');
const splitExperience = document.querySelector('#split-experience');
const peopleMap = document.querySelector('.people-map');
const valuePhonePanel = document.querySelector('.value-phone-panel');
const recordControl = document.querySelector('.record-control');
const recordSwitch = document.querySelector('#record-switch');
const recordStatus = document.querySelector('#record-status');
const storyScrollHint = document.querySelector('.story-scroll-hint');
const pricePoints = [...document.querySelectorAll('.price-point')];
const phoneAmount = document.querySelector('#phone-amount');
const clipViewer = document.querySelector('#clip-viewer');
const clipFrame = document.querySelector('#clip-frame');
const waitlistSection = document.querySelector('#waitlist');
const memoryGallery = document.querySelector('#home');
const memoryWheel = document.querySelector('#memory-wheel');
const memoryCards = [...document.querySelectorAll('.memory-card')];
const joyHero = document.querySelector('.joy-hero');
const growthStory = document.querySelector('.growth-story');
const growthCounter = document.querySelector('#growth-counter');
const growthWaterFx = document.querySelector('.growth-water-fx');
const growthFxContext = growthWaterFx?.getContext('2d');

if (joyHero) {
  joyHero.addEventListener('pointermove', (event) => {
    const rect = joyHero.getBoundingClientRect();
    joyHero.style.setProperty('--joy-x', ((event.clientX - rect.left) / rect.width - .5).toFixed(3));
    joyHero.style.setProperty('--joy-y', ((event.clientY - rect.top) / rect.height - .5).toFixed(3));
  }, { passive: true });
}

function growthClamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function growthEase(value) {
  const p = growthClamp(value);
  return p * p * (3 - 2 * p);
}

function growthRange(start, end, value) {
  return growthEase((value - start) / (end - start));
}

let growthFxWidth = 0;
let growthFxHeight = 0;

function resizeGrowthFx() {
  if (!growthWaterFx || !growthFxContext) return;
  const bounds = growthWaterFx.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  growthFxWidth = bounds.width;
  growthFxHeight = bounds.height;
  growthWaterFx.width = Math.max(1, Math.round(bounds.width * pixelRatio));
  growthWaterFx.height = Math.max(1, Math.round(bounds.height * pixelRatio));
  growthFxContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function growthRandom(seed) {
  const value = Math.sin(seed * 91.731) * 43758.5453;
  return value - Math.floor(value);
}

function drawGrowthDroplet(context, x, y, progress) {
  const base = Math.max(9, Math.min(growthFxWidth, growthFxHeight) * .014);
  const width = base * (1.08 - progress * .18);
  const height = base * (1.62 + progress * .6);

  context.save();
  context.translate(x, y);
  context.rotate((progress - .5) * .08);
  context.shadowColor = 'rgba(26, 77, 88, .35)';
  context.shadowBlur = base * 1.2;
  context.shadowOffsetY = base * .55;

  const water = context.createRadialGradient(-width * .22, -height * .24, 1, 0, 0, height);
  water.addColorStop(0, 'rgba(255, 255, 255, .98)');
  water.addColorStop(.2, 'rgba(219, 245, 249, .91)');
  water.addColorStop(.58, 'rgba(119, 190, 208, .82)');
  water.addColorStop(1, 'rgba(37, 108, 132, .72)');
  context.fillStyle = water;
  context.beginPath();
  context.moveTo(0, -height);
  context.bezierCurveTo(width * .22, -height * .55, width, -height * .12, width, height * .34);
  context.bezierCurveTo(width, height * .92, width * .45, height, 0, height);
  context.bezierCurveTo(-width * .56, height, -width, height * .82, -width, height * .3);
  context.bezierCurveTo(-width, -height * .12, -width * .2, -height * .58, 0, -height);
  context.closePath();
  context.fill();

  context.shadowColor = 'transparent';
  context.fillStyle = 'rgba(255, 255, 255, .82)';
  context.beginPath();
  context.ellipse(-width * .3, -height * .27, width * .17, height * .14, -.45, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawGrowthSplash(context, x, y, progress) {
  const fade = 1 - growthEase((progress - .48) / .52);
  const spread = Math.max(18, Math.min(growthFxWidth, growthFxHeight) * .035);

  context.save();
  context.globalCompositeOperation = 'screen';

  if (progress < .55) {
    const crown = context.createLinearGradient(0, y - spread, 0, y + 5);
    crown.addColorStop(0, `rgba(238, 253, 255, ${.62 * fade})`);
    crown.addColorStop(1, `rgba(86, 169, 190, ${.18 * fade})`);
    context.fillStyle = crown;
    context.beginPath();
    context.moveTo(x - spread, y + 2);
    for (let index = 0; index <= 12; index += 1) {
      const offset = index / 12;
      const px = x - spread + offset * spread * 2;
      const peak = index % 2 === 0 ? 3 : spread * (.28 + growthRandom(index + 4) * .5) * fade;
      context.lineTo(px, y - peak);
    }
    context.lineTo(x + spread, y + 5);
    context.closePath();
    context.fill();
  }

  for (let index = 0; index < 34; index += 1) {
    const direction = growthRandom(index + 11) * 2 - 1;
    const speedX = direction * (52 + growthRandom(index + 31) * 150);
    const speedY = -(64 + growthRandom(index + 71) * 170);
    const time = progress * .86;
    const px = x + speedX * time;
    const py = y - 3 + speedY * time + 265 * time * time;
    if (py > y + 4) continue;
    const radius = (1.1 + growthRandom(index + 101) * 2.7) * (.72 + fade * .45);
    const particle = context.createRadialGradient(px - radius * .3, py - radius * .35, .2, px, py, radius * 1.5);
    particle.addColorStop(0, `rgba(255, 255, 255, ${.88 * fade})`);
    particle.addColorStop(.42, `rgba(191, 234, 243, ${.72 * fade})`);
    particle.addColorStop(1, 'rgba(74, 150, 174, 0)');
    context.fillStyle = particle;
    context.beginPath();
    context.ellipse(px, py, radius, radius * (1.25 + Math.abs(speedY) / 330), direction * .22, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawGrowthWater(progress) {
  if (!growthFxContext || !growthFxWidth || !growthFxHeight) return;
  growthFxContext.clearRect(0, 0, growthFxWidth, growthFxHeight);
  if (progress > .32) return;

  const x = growthFxWidth * .5;
  const soilY = growthFxHeight * .58;
  const fallEnd = .18;

  if (progress < fallEnd) {
    const fall = growthClamp(progress / fallEnd);
    const ballistic = fall * fall;
    const y = -32 + (soilY + 25) * ballistic;
    drawGrowthDroplet(growthFxContext, x, y, fall);
  }

  if (progress >= .165) {
    const impact = growthClamp((progress - .165) / .14);
    drawGrowthSplash(growthFxContext, x, soilY - 2, impact);
  }
}

function updateGrowthStory() {
  if (!growthStory) return;

  if (prefersReducedMotion.matches) {
    growthStory.dataset.stage = 'tree';
    if (growthCounter) growthCounter.textContent = '04';
    return;
  }

  const rect = growthStory.getBoundingClientRect();
  const range = Math.max(1, growthStory.offsetHeight - window.innerHeight);
  const progress = growthClamp(-rect.top / range);
  const bridge = growthRange(0, .16, progress);
  const seedFrame = 1;
  const germinationFrame = growthRange(.12, .22, progress);
  const saplingFrame = growthRange(.32, .45, progress);
  const treeFrame = growthRange(.62, .78, progress);

  growthStory.style.setProperty('--growth', progress.toFixed(4));
  growthStory.style.setProperty('--bridge', bridge.toFixed(4));
  growthStory.style.setProperty('--frame-seed', seedFrame.toFixed(4));
  growthStory.style.setProperty('--frame-germination', germinationFrame.toFixed(4));
  growthStory.style.setProperty('--frame-sapling', saplingFrame.toFixed(4));
  growthStory.style.setProperty('--frame-tree', treeFrame.toFixed(4));
  drawGrowthWater(progress);

  let stage = 'drop';
  let number = '01';
  if (progress >= .2) { stage = 'root'; number = '02'; }
  if (progress >= .4) { stage = 'sprout'; number = '03'; }
  if (progress >= .7) { stage = 'tree'; number = '04'; }
  growthStory.dataset.stage = stage;
  if (growthCounter) growthCounter.textContent = number;
}

let growthUpdateFrame = 0;
function requestGrowthUpdate() {
  if (growthUpdateFrame) return;
  growthUpdateFrame = requestAnimationFrame(() => {
    growthUpdateFrame = 0;
    updateGrowthStory();
  });
}

window.addEventListener('scroll', requestGrowthUpdate, { passive: true });
window.addEventListener('resize', () => {
  resizeGrowthFx();
  requestGrowthUpdate();
});
resizeGrowthFx();
updateGrowthStory();

let rotation = 0;
let previousTime = performance.now();
let paused = false;
let storyProgress = 0;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const smoothstep = (from, to, value) => {
  const progress = clamp((value - from) / (to - from), 0, 1);
  return progress * progress * (3 - 2 * progress);
};

let memoryRotation = 0;
let memoryVelocity = 0;
let memoryPointer = null;
let memoryLastX = 0;
let memoryLastTime = 0;
let memoryDragDistance = 0;
let memorySnapTarget = null;
let memoryAutoSpinAfter = 0;
let memoryPinnedCard = null;
let memoryPinProgress = 0;
let memoryPreviousTime = performance.now();

const wrapDegrees = (degrees) => ((degrees + 180) % 360 + 360) % 360 - 180;

function selectMemoryCard(card, moveFocus = false, holdAtCenter = true) {
  if (!card) return;
  const angle = Number(card.dataset.angle);
  const baseTarget = -angle;
  memorySnapTarget = baseTarget + Math.round((memoryRotation - baseTarget) / 360) * 360;
  memoryVelocity = 0;
  memoryAutoSpinAfter = holdAtCenter ? Infinity : performance.now() + 1800;
  memoryPinnedCard = holdAtCenter ? card : null;
  memoryPinProgress = 0;

  memoryCards.forEach((item) => {
    const selected = item === card;
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });

  if (moveFocus) card.focus({ preventScroll: true });
}

function renderMemoryGallery(time) {
  if (!memoryWheel || !memoryCards.length) return;

  const elapsed = Math.min(time - memoryPreviousTime, 40);
  memoryPreviousTime = time;
  const galleryRect = memoryGallery.getBoundingClientRect();
  const isVisible = galleryRect.top < window.innerHeight && galleryRect.bottom > 0 && homeView.classList.contains('is-active');

  if (memorySnapTarget !== null) {
    const delta = memorySnapTarget - memoryRotation;
    memoryRotation += delta * Math.min(.22, elapsed * .014);
    if (Math.abs(delta) < .035) {
      memoryRotation = memorySnapTarget;
      memorySnapTarget = null;
    }
  } else if (isVisible && memoryPointer === null && !prefersReducedMotion.matches) {
    const autoSpin = time > memoryAutoSpinAfter ? .006 : 0;
    memoryRotation += elapsed * autoSpin + elapsed * memoryVelocity;
    memoryVelocity *= Math.pow(.925, elapsed / 16.67);
    if (Math.abs(memoryVelocity) < .00004) memoryVelocity = 0;
  }

  if (memoryPinnedCard && memoryPointer === null) {
    memoryPinProgress = Math.min(1, memoryPinProgress + elapsed * .0024);
  }

  const radius = clamp(Math.min(window.innerWidth, window.innerHeight) * .19, 92, 145);

  let frontCard = memoryCards[0];
  let frontDistance = -Infinity;

  memoryCards.forEach((card) => {
    const degrees = wrapDegrees(Number(card.dataset.angle) + memoryRotation);
    const radians = degrees * Math.PI / 180;
    const x = Math.sin(radians) * radius;
    const y = -Math.cos(radians) * radius;
    const depth = (y / radius + 1) / 2;
    const z = (depth - .5) * 90;
    let scale = .82 + depth * .18;
    let opacity = .76 + depth * .24;
    let cardX = x;
    let cardY = y;

    if (card === memoryPinnedCard) {
      const orbitAmount = 1 - memoryPinProgress;
      cardX *= orbitAmount;
      cardY *= orbitAmount;
      scale = lerp(scale, 1.06, memoryPinProgress);
      opacity = 1;
    }

    if (depth > frontDistance) {
      frontCard = card;
      frontDistance = depth;
    }

    card.style.zIndex = card === memoryPinnedCard ? '1000' : String(Math.round(depth * 100) + 1);
    card.style.opacity = opacity.toFixed(3);
    card.style.filter = `saturate(${(.88 + depth * .12).toFixed(3)})`;
    card.style.transform = `translate(-50%, -50%) translate3d(${cardX.toFixed(2)}px, ${cardY.toFixed(2)}px, ${z.toFixed(2)}px) scale(${scale.toFixed(3)})`;
  });

  memoryCards.forEach((card) => {
    const selected = memoryPinnedCard ? card === memoryPinnedCard : card === frontCard;
    card.classList.toggle('is-selected', selected);
    card.setAttribute('aria-pressed', String(selected));
  });

  requestAnimationFrame(renderMemoryGallery);
}

memoryWheel?.addEventListener('pointerdown', (event) => {
  memoryPointer = event.pointerId;
  memoryLastX = event.clientX;
  memoryLastTime = performance.now();
  memoryDragDistance = 0;
  memorySnapTarget = null;
  memoryPinnedCard = null;
  memoryPinProgress = 0;
  memoryVelocity = 0;
  memoryWheel.classList.add('is-dragging');
  memoryWheel.setPointerCapture(event.pointerId);
});

memoryWheel?.addEventListener('pointermove', (event) => {
  if (event.pointerId !== memoryPointer) return;
  const now = performance.now();
  const deltaX = event.clientX - memoryLastX;
  const deltaTime = Math.max(8, now - memoryLastTime);
  const deltaRotation = deltaX * .22;
  memoryRotation += deltaRotation;
  memoryDragDistance += Math.abs(deltaX);
  memoryVelocity = clamp((deltaRotation / deltaTime) * .72, -.18, .18);
  memoryLastX = event.clientX;
  memoryLastTime = now;
});

function releaseMemory(event) {
  if (event.pointerId !== memoryPointer) return;
  memoryPointer = null;
  memoryAutoSpinAfter = performance.now() + 2200;
  memoryWheel.classList.remove('is-dragging');
}

memoryWheel?.addEventListener('pointerup', releaseMemory);
memoryWheel?.addEventListener('pointercancel', releaseMemory);
memoryWheel?.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  const frontIndex = memoryCards.reduce((best, card, index) => {
    const distance = Math.abs(wrapDegrees(Number(card.dataset.angle) + memoryRotation));
    return distance < best.distance ? { index, distance } : best;
  }, { index: 0, distance: Infinity }).index;
  const direction = event.key === 'ArrowLeft' ? -1 : 1;
  const nextIndex = (frontIndex + direction + memoryCards.length) % memoryCards.length;
  selectMemoryCard(memoryCards[nextIndex], true);
});

memoryCards.forEach((card) => {
  card.addEventListener('click', () => {
    if (memoryDragDistance > 8) return;
    selectMemoryCard(card);
  });
});

selectMemoryCard(memoryCards[0], false, false);
requestAnimationFrame(renderMemoryGallery);

function updateBeachStory() {
  if (!beachStory || !homeView.classList.contains('is-active')) return;

  const rect = beachStory.getBoundingClientRect();
  const range = Math.max(1, beachStory.offsetHeight - window.innerHeight);
  storyProgress = clamp(-rect.top / range, 0, 1);

  const split = smoothstep(.2, .72, storyProgress);
  const introWidth = window.innerWidth;
  const introHeight = window.innerHeight;
  const endWidth = mobile.matches ? window.innerWidth : window.innerWidth * .5;
  const endHeight = mobile.matches ? window.innerHeight * .52 : window.innerHeight;
  const startX = 0;
  const startY = 0;

  beachVisual.style.left = `${lerp(startX, 0, split)}px`;
  beachVisual.style.top = `${lerp(startY, 0, split)}px`;
  beachVisual.style.width = `${lerp(introWidth, endWidth, split)}px`;
  beachVisual.style.height = `${lerp(introHeight, endHeight, split)}px`;
  beachVisual.style.borderRadius = '0px';

  beachDragLayer.style.opacity = String(1 - smoothstep(.36, .7, storyProgress));
  recordControl.style.opacity = String(1 - smoothstep(.18, .43, storyProgress));
  recordControl.style.pointerEvents = storyProgress < .34 ? 'auto' : 'none';

  splitExperience.style.opacity = String(smoothstep(.37, .68, storyProgress));
  splitExperience.classList.toggle('is-interactive', storyProgress > .68);
  storyScrollHint.style.opacity = String(1 - smoothstep(.48, .75, storyProgress));
  const flipOut = prefersReducedMotion.matches ? 0 : smoothstep(.84, 1, storyProgress);
  splitExperience.style.transform = `perspective(1500px) rotateX(${-58 * flipOut}deg) translateY(${-10 * flipOut}%)`;

  if (mobile.matches) {
    peopleMap.style.transform = `translateY(${lerp(-16, 0, split)}%)`;
    valuePhonePanel.style.transform = `translateY(${lerp(100, 0, split)}%)`;
  } else {
    peopleMap.style.transform = `translateX(${lerp(-18, 0, split)}%)`;
    valuePhonePanel.style.transform = `translateX(${lerp(100, 0, split)}%)`;
  }

  updateWaitlistFlip();
}

function updateWaitlistFlip() {
  if (!waitlistSection) return;
  const enter = smoothstep(.84, 1, storyProgress);
  const rotation = prefersReducedMotion.matches ? 0 : lerp(68, 0, enter);
  const shift = prefersReducedMotion.matches ? 0 : lerp(20, 0, enter);
  waitlistSection.style.transform = `perspective(1600px) rotateX(${rotation}deg) translateY(${shift}vh)`;
  waitlistSection.style.opacity = String(enter);
  waitlistSection.style.pointerEvents = enter > .94 ? 'auto' : 'none';
}

window.addEventListener('scroll', updateBeachStory, { passive: true });
window.addEventListener('resize', updateBeachStory);
updateBeachStory();

recordSwitch.addEventListener('click', (event) => {
  event.stopPropagation();
  const isOn = recordSwitch.getAttribute('aria-checked') === 'true';
  recordSwitch.setAttribute('aria-checked', String(!isOn));
  recordStatus.textContent = isOn ? 'Recording paused' : 'Recording allowed';
  homeView.classList.toggle('recording-enabled', !isOn);
});

let panX = 0;
let panY = 0;
let panVelocityX = 0;
let panVelocityY = 0;
let panPointer = null;
let panLastX = 0;
let panLastY = 0;

function renderPan() {
  if (panPointer === null) {
    panX += panVelocityX;
    panY += panVelocityY;
    panVelocityX *= .91;
    panVelocityY *= .91;
  }
  const maxX = beachVisual.clientWidth * .055;
  const maxY = beachVisual.clientHeight * .055;
  panX = clamp(panX, -maxX, maxX);
  panY = clamp(panY, -maxY, maxY);
  beachDragLayer.style.transform = `translate3d(${panX}px, ${panY}px, 0)`;
  requestAnimationFrame(renderPan);
}

beachVisual.addEventListener('pointerdown', (event) => {
  if (storyProgress > .36 || event.target.closest('.record-switch')) return;
  panPointer = event.pointerId;
  panLastX = event.clientX;
  panLastY = event.clientY;
  panVelocityX = 0;
  panVelocityY = 0;
  beachVisual.classList.add('is-dragging');
  beachVisual.setPointerCapture(event.pointerId);
});

beachVisual.addEventListener('pointermove', (event) => {
  if (event.pointerId !== panPointer) return;
  const deltaX = event.clientX - panLastX;
  const deltaY = event.clientY - panLastY;
  panX += deltaX;
  panY += deltaY;
  panVelocityX = deltaX * .72;
  panVelocityY = deltaY * .72;
  panLastX = event.clientX;
  panLastY = event.clientY;
});

function releasePan(event) {
  if (event.pointerId !== panPointer) return;
  panPointer = null;
  beachVisual.classList.remove('is-dragging');
}

beachVisual.addEventListener('pointerup', releasePan);
beachVisual.addEventListener('pointercancel', releasePan);
requestAnimationFrame(renderPan);

pricePoints.forEach((point) => {
  point.addEventListener('click', () => {
    pricePoints.forEach((item) => item.classList.toggle('is-selected', item === point));
    phoneAmount.textContent = Number(point.dataset.price).toFixed(2);
    phoneAmount.animate(
      [{ opacity: .2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 360, easing: 'cubic-bezier(.2,.75,.22,1)' }
    );
  });
});

const clipFrames = Array.from({ length: 21 }, (_, index) => `assets/egoclip-frames/clip-${String(index).padStart(2, '0')}.png`);
clipFrames.forEach((source) => { const image = new Image(); image.src = source; });
let clipIndex = 10;
let clipPointer = null;
let clipStartX = 0;
let clipStartIndex = 10;
let clipResumeAt = 0;

function showClipFrame(index) {
  clipIndex = clamp(Math.round(index), 0, clipFrames.length - 1);
  clipFrame.src = clipFrames[clipIndex];
}

clipViewer.addEventListener('pointerdown', (event) => {
  clipPointer = event.pointerId;
  clipStartX = event.clientX;
  clipStartIndex = clipIndex;
  clipViewer.setPointerCapture(event.pointerId);
});

clipViewer.addEventListener('pointermove', (event) => {
  if (event.pointerId !== clipPointer) return;
  showClipFrame(clipStartIndex + (event.clientX - clipStartX) / 5);
});

function releaseClip(event) {
  if (event.pointerId !== clipPointer) return;
  clipPointer = null;
  clipResumeAt = performance.now() + 1800;
}

clipViewer.addEventListener('pointerup', releaseClip);
clipViewer.addEventListener('pointercancel', releaseClip);

function animateClip(time) {
  if (clipPointer === null && time > clipResumeAt && !prefersReducedMotion.matches) {
    showClipFrame(10 + Math.sin(time / 1250) * 9);
  }
  requestAnimationFrame(animateClip);
}
requestAnimationFrame(animateClip);

function setTrack(track = 'General waitlist') {
  trackInput.value = track;
  selectedTrack.textContent = track.toLowerCase();
}

function showView() {
  const isApply = window.location.hash.startsWith('#apply');
  homeView.classList.toggle('is-active', !isApply);
  applyView.classList.toggle('is-active', isApply);
  document.title = isApply ? 'Join the waitlist — UBL' : 'UBL — Live what comes next';
  if (isApply) {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => document.querySelector('#name')?.focus({ preventScroll: true }));
  }
}

document.querySelectorAll('.js-apply').forEach((link) => {
  link.addEventListener('click', () => setTrack(link.dataset.track));
});

window.addEventListener('hashchange', showView);
showView();

function renderOrbit(time) {
  const elapsed = Math.min(time - previousTime, 40);
  previousTime = time;

  if (!paused && !prefersReducedMotion.matches && !mobile.matches && homeView.classList.contains('is-active')) {
    rotation = (rotation + elapsed * 0.004752) % 360;
  }

  if (!mobile.matches) {
    const rx = Math.min(window.innerWidth * .34, 590);
    const ry = Math.min(window.innerHeight * .265, 245);
    const centerX = window.innerWidth * .62;
    const centerY = window.innerHeight * .54;

    cards.forEach((card) => {
      const degrees = Number(card.dataset.angle) + rotation;
      const radians = degrees * Math.PI / 180;
      const x = Math.sin(radians) * rx;
      const y = Math.sin(radians * 2) * ry * .22 + Math.cos(radians) * ry;
      const depth = Math.cos(radians);
      const scale = .76 + ((depth + 1) / 2) * .25;
      const tilt = Math.sin(radians) * -12;

      card.style.left = `${centerX}px`;
      card.style.top = `${centerY}px`;
      card.style.zIndex = depth > 0 ? '5' : '1';
      card.style.opacity = `${.52 + ((depth + 1) / 2) * .48}`;
      card.style.filter = `blur(${depth < -.55 ? 1.1 : 0}px) saturate(${.82 + ((depth + 1) / 2) * .18})`;
      card.style.transform = `perspective(1100px) translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateY(${tilt}deg)`;
    });
  }

  requestAnimationFrame(renderOrbit);
}

orbit.addEventListener('pointerenter', () => { paused = true; });
orbit.addEventListener('pointerleave', () => { paused = false; });
orbit.addEventListener('focusin', () => { paused = true; });
orbit.addEventListener('focusout', () => { paused = false; });
requestAnimationFrame(renderOrbit);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const entry = Object.fromEntries(new FormData(form));
  const savedEntries = JSON.parse(localStorage.getItem('ubl-waitlist') || '[]');
  savedEntries.push({ ...entry, createdAt: new Date().toISOString() });
  localStorage.setItem('ubl-waitlist', JSON.stringify(savedEntries));

  form.hidden = true;
  document.querySelector('.apply__intro').hidden = true;
  success.hidden = false;
  success.querySelector('a').focus();
});
