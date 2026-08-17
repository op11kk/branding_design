const root = document.documentElement;
const body = document.body;
const header = document.querySelector("[data-header]");
const chapterLabel = document.querySelector("[data-chapter]");
const progress = document.querySelector("[data-progress]");
const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-nav]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const saveData = Boolean(navigator.connection?.saveData);

function closeMenu() {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
  body.classList.remove("nav-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = !navigation.classList.contains("is-open");
  navigation.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  body.classList.toggle("nav-open", isOpen);
});

navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    menuButton.focus();
  }
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sections = [...document.querySelectorAll("[data-section]")];
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const section = visible.target;
  chapterLabel.textContent = section.dataset.section;
  header.classList.toggle("on-dark", section.dataset.theme === "dark");
}, { threshold: [0.2, 0.45, 0.68], rootMargin: "-20% 0px -32%" });
sections.forEach((section) => sectionObserver.observe(section));

let scrollFrame = 0;
function updateScrollState() {
  const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  root.style.setProperty("--progress", Math.min(1, window.scrollY / scrollable).toFixed(4));
  header.classList.toggle("is-scrolled", window.scrollY > 18);
  scrollFrame = 0;
}
window.addEventListener("scroll", () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateScrollState);
}, { passive: true });
updateScrollState();

const shellPreview = document.querySelector("[data-shell-preview]");
const shellName = document.querySelector("[data-shell-name]");
const productViewer = document.querySelector("[data-product-viewer]");
const shellButtons = document.querySelectorAll("[data-shell-src]");

shellButtons.forEach((button) => button.addEventListener("click", () => {
  if (button.getAttribute("aria-pressed") === "true") return;
  shellButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  productViewer.classList.add("is-changing");
  productViewer.style.setProperty("--viewer-accent", button.dataset.shellColor);
  const nextImage = new Image();
  nextImage.src = button.dataset.shellSrc;
  const applyShell = () => {
    shellPreview.src = button.dataset.shellSrc;
    shellPreview.alt = `EgoClip concept with ${button.dataset.shellName.toLowerCase()} exterior shell`;
    shellName.textContent = button.dataset.shellName;
    requestAnimationFrame(() => productViewer.classList.remove("is-changing"));
  };
  if (nextImage.complete) applyShell();
  else nextImage.addEventListener("load", applyShell, { once: true });
}));

function mediaButtonFor(video) {
  return video.parentElement.querySelector("[data-media-control]");
}

function syncMediaButton(video) {
  const button = mediaButtonFor(video);
  if (!button) return;
  const paused = video.paused;
  button.classList.toggle("is-paused", paused);
  button.setAttribute("aria-label", `${paused ? "Play" : "Pause"} ${video.getAttribute("aria-label") || "video"}`);
  button.querySelector("span").textContent = paused ? "Play film" : "Pause film";
}

const videos = [...document.querySelectorAll("[data-media]")];
const userPaused = new WeakSet();
videos.forEach((video) => {
  const button = mediaButtonFor(video);
  video.addEventListener("play", () => syncMediaButton(video));
  video.addEventListener("pause", () => syncMediaButton(video));
  button?.addEventListener("click", async () => {
    if (video.paused) {
      userPaused.delete(video);
      try { await video.play(); } catch { /* poster remains available */ }
    } else {
      userPaused.add(video);
      video.pause();
    }
    syncMediaButton(video);
  });
  if (reduceMotion.matches || saveData) video.pause();
  syncMediaButton(video);
});

const mediaObserver = new IntersectionObserver((entries) => {
  entries.forEach(async (entry) => {
    const video = entry.target;
    if (!entry.isIntersecting || entry.intersectionRatio < 0.45) {
      video.pause();
      return;
    }
    if (reduceMotion.matches || saveData || userPaused.has(video)) return;
    try { await video.play(); } catch { syncMediaButton(video); }
  });
}, { threshold: [0, 0.45, 0.8] });
videos.forEach((video) => mediaObserver.observe(video));

document.addEventListener("visibilitychange", () => {
  if (document.hidden) videos.forEach((video) => video.pause());
});

reduceMotion.addEventListener?.("change", (event) => {
  if (event.matches) videos.forEach((video) => video.pause());
});

const stateDemo = document.querySelector("[data-state-demo]");
const stateToggle = document.querySelector("[data-state-toggle]");
const stateTitle = document.querySelector("[data-state-title]");
stateToggle.addEventListener("click", () => {
  const active = !stateDemo.classList.contains("is-active");
  stateDemo.classList.toggle("is-active", active);
  stateToggle.setAttribute("aria-pressed", String(active));
  stateToggle.querySelector("span").textContent = active ? "Pause concept state" : "Start concept state";
  stateTitle.textContent = active ? "Visible. Active. Chosen." : "Ready when you are.";
});

const reviewItems = [...document.querySelectorAll("[data-review-item]")];
const reviewFeedback = document.querySelector("[data-review-feedback]");
const appPrimary = document.querySelector("[data-app-primary]");
function updateReviewState() {
  const selected = reviewItems.filter((item) => item.getAttribute("aria-pressed") === "true").length;
  appPrimary.disabled = selected === 0;
  appPrimary.textContent = selected ? `Choose ${selected} moment${selected === 1 ? "" : "s"}` : "Choose moments";
  reviewFeedback.textContent = selected
    ? `${selected} selected for the concept flow. Nothing leaves this page.`
    : "Nothing selected. Your moments stay private.";
}
reviewItems.forEach((item) => item.addEventListener("click", () => {
  const selected = item.getAttribute("aria-pressed") !== "true";
  item.setAttribute("aria-pressed", String(selected));
  updateReviewState();
}));
appPrimary.addEventListener("click", () => {
  reviewFeedback.textContent = "Concept choice confirmed locally. No data was sent.";
});

const form = document.querySelector("[data-waitlist]");
const formStatus = document.querySelector("[data-form-status]");
const submitButton = form.querySelector('button[type="submit"]');
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = form.elements.email;
  if (!email.validity.valid) {
    form.dataset.state = "error";
    formStatus.textContent = "Please enter a valid email address.";
    email.focus();
    return;
  }

  const endpoint = form.dataset.endpoint.trim();
  if (!endpoint) {
    form.dataset.state = "demo";
    formStatus.textContent = "Form validated. Connect a production endpoint before launch; this preview did not send or store your email.";
    submitButton.textContent = "Preview ready ✓";
    return;
  }

  form.dataset.state = "loading";
  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
  formStatus.textContent = "Saving your place…";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, locale: navigator.language, source: "landing-page" }),
    });
    if (!response.ok) throw new Error(`Waitlist request failed: ${response.status}`);
    form.dataset.state = "success";
    formStatus.textContent = "You're on the list. We'll be in touch when there is something worth sharing.";
    submitButton.textContent = "You're in ✓";
  } catch {
    form.dataset.state = "error";
    formStatus.textContent = "We couldn't save your place. Please try again.";
    submitButton.disabled = false;
    submitButton.textContent = "Try again";
  }
});
