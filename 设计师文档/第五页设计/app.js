const root = document.querySelector(".evidence");
const tabs = [...document.querySelectorAll(".company-tab")];
const backdrops = [...document.querySelectorAll(".backdrop")];
const sequence = document.querySelector(".sequence span");
const previousButton = document.querySelector(".arrow--previous");
const nextButton = document.querySelector(".arrow--next");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const cycleDuration = 9000;
let activeIndex = 0;
let cycleTimer;
let wheelLocked = false;
let pointerStartX = null;

function selectSlide(index, options = {}) {
  const nextIndex = (index + tabs.length) % tabs.length;
  activeIndex = nextIndex;
  root.dataset.active = String(nextIndex);
  sequence.textContent = String(nextIndex + 1).padStart(2, "0");

  tabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === nextIndex;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  backdrops.forEach((backdrop, backdropIndex) => {
    backdrop.classList.toggle("is-active", backdropIndex === nextIndex);
  });

  if (options.focus) {
    tabs[nextIndex].focus({ preventScroll: true });
  }

  if (options.scroll && window.innerWidth <= 780) {
    tabs[nextIndex].scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", inline: "center", block: "nearest" });
  }

  restartCycle();
}

function restartCycle() {
  window.clearInterval(cycleTimer);
  if (reducedMotion.matches || document.hidden) return;
  cycleTimer = window.setInterval(() => selectSlide(activeIndex + 1, { scroll: true }), cycleDuration);
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectSlide(index, { scroll: true }));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopPropagation();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    selectSlide(activeIndex + direction, { focus: true, scroll: true });
  });
});

previousButton?.addEventListener("click", () => selectSlide(activeIndex - 1, { scroll: true }));
nextButton?.addEventListener("click", () => selectSlide(activeIndex + 1, { scroll: true }));

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") selectSlide(activeIndex - 1, { scroll: true });
  if (event.key === "ArrowRight") selectSlide(activeIndex + 1, { scroll: true });
});

root.addEventListener(
  "wheel",
  (event) => {
    if (wheelLocked || Math.abs(event.deltaY) < 20) return;
    wheelLocked = true;
    selectSlide(activeIndex + (event.deltaY > 0 ? 1 : -1), { scroll: true });
    window.setTimeout(() => {
      wheelLocked = false;
    }, 720);
  },
  { passive: true },
);

root.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse") return;
  pointerStartX = event.clientX;
});

root.addEventListener("pointerup", (event) => {
  if (pointerStartX === null) return;
  const distance = event.clientX - pointerStartX;
  pointerStartX = null;
  if (Math.abs(distance) < 45) return;
  selectSlide(activeIndex + (distance < 0 ? 1 : -1), { scroll: true });
});

document.addEventListener("visibilitychange", restartCycle);
reducedMotion.addEventListener("change", restartCycle);
restartCycle();
