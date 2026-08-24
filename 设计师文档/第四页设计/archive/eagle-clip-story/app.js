const story = document.querySelector(".story");
const landscape = document.querySelector(".landscape");
const photos = [...document.querySelectorAll(".photo")];
const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let scrollProgress = 0;
let pointerX = 0;
let pointerY = 0;
let ticking = false;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOutExpo = (value) => (value === 1 ? 1 : 1 - 2 ** (-10 * value));
const easeOutBack = (value) => {
  const c1 = 1.36;
  const c3 = c1 + 1;
  return 1 + c3 * (value - 1) ** 3 + c1 * (value - 1) ** 2;
};

function measureScroll() {
  const rect = story.getBoundingClientRect();
  const distance = story.offsetHeight - window.innerHeight;
  scrollProgress = clamp(-rect.top / Math.max(distance, 1));
}

function render() {
  ticking = false;
  const revealRaw = clamp((scrollProgress - 0.12) / 0.46);
  const reveal = reducedMotion.matches ? (revealRaw > 0.15 ? 1 : 0) : easeOutBack(revealRaw);
  const opacity = clamp((scrollProgress - 0.12) / 0.12);
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;

  photos.forEach((photo, index) => {
    const x = Number(photo.dataset.x) * viewW * reveal;
    const mobileY = photo.dataset.yMobile;
    const yFactor = viewW <= 760 && mobileY !== undefined ? Number(mobileY) : Number(photo.dataset.y);
    const y = yFactor * viewH * reveal;
    const stagger = clamp((revealRaw * 1.25) - index * 0.018);
    const scale = 0.16 + easeOutExpo(stagger) * 0.84;
    photo.style.setProperty("--tx", `${x.toFixed(2)}px`);
    photo.style.setProperty("--ty", `${y.toFixed(2)}px`);
    photo.style.setProperty("--scale", scale.toFixed(3));
    photo.style.setProperty("--photo-opacity", opacity.toFixed(3));
  });

  landscape.style.setProperty("--bg-scale", (1.06 + scrollProgress * 0.055).toFixed(3));
  landscape.style.setProperty("--bg-y", `${(-scrollProgress * viewH * 0.022 + pointerY * 5).toFixed(2)}px`);
  landscape.style.setProperty("--bg-x", `${(pointerX * 7).toFixed(2)}px`);
  root.style.setProperty("--scroll-progress", scrollProgress.toFixed(3));
  const pointIn = clamp((scrollProgress - 0.08) / 0.08);
  const pointOut = 1 - clamp((scrollProgress - 0.38) / 0.14);
  root.style.setProperty("--point-opacity", (pointIn * pointOut).toFixed(3));
  root.style.setProperty("--point-scale", (0.7 + revealRaw * 2.2).toFixed(3));
}

function requestRender() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(render);
}

window.addEventListener("scroll", () => { measureScroll(); requestRender(); }, { passive: true });
window.addEventListener("resize", () => { measureScroll(); requestRender(); });
window.addEventListener("pointermove", (event) => {
  if (reducedMotion.matches) return;
  pointerX = event.clientX / window.innerWidth - 0.5;
  pointerY = event.clientY / window.innerHeight - 0.5;
  requestRender();
}, { passive: true });
reducedMotion.addEventListener("change", requestRender);
measureScroll();
render();
