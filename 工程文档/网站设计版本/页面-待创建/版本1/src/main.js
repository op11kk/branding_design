const root = document.documentElement;
const wallet = document.querySelector("[data-wallet]");
const productCard = document.querySelector("[data-product-card]");
const shellButtons = document.querySelectorAll("[data-shell]");
const wearClip = document.querySelector("[data-wear-clip]");
const form = document.querySelector("[data-waitlist]");
const formStatus = document.querySelector("[data-form-status]");
const chapter = document.querySelector("[data-chapter]");
const header = document.querySelector("[data-header]");
const moments = document.querySelector("#moments");
const momentRail = document.querySelector("[data-moment-rail]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function openWallet() {
  wallet.classList.add("is-open");
  wallet.setAttribute("aria-expanded", "true");
  window.setTimeout(() => document.querySelector("#product").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" }), reduceMotion.matches ? 0 : 820);
}
document.querySelectorAll("[data-open-wallet], [data-wallet]").forEach((button) => button.addEventListener("click", openWallet));

productCard.addEventListener("click", () => {
  const product = document.querySelector("#product");
  const isOpen = product.classList.toggle("is-expanded");
  productCard.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) window.setTimeout(() => document.querySelector("#moments").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" }), reduceMotion.matches ? 0 : 520);
});

shellButtons.forEach((button) => button.addEventListener("click", () => {
  shellButtons.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  wearClip.style.setProperty("--shell", button.dataset.shell);
  wearClip.classList.remove("shell-change");
  requestAnimationFrame(() => wearClip.classList.add("shell-change"));
}));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = form.elements.email;
  if (!input.validity.valid) {
    form.dataset.state = "error"; formStatus.textContent = "Please enter a valid email address."; input.focus(); return;
  }
  form.dataset.state = "loading"; form.querySelector("button").disabled = true; formStatus.textContent = "Saving your place…";
  window.setTimeout(() => { form.dataset.state = "success"; formStatus.textContent = "You're on the list. We'll be in touch."; form.querySelector("button").textContent = "You’re in ✓"; }, reduceMotion.matches ? 0 : 650);
});

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
}), { threshold: 0.16, rootMargin: "0px 0px -6%" });
document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  chapter.textContent = entry.target.dataset.section;
  header.classList.toggle("on-dark", entry.target.matches(".product, .app-panel, .waitlist"));
}), { threshold: 0.52 });
document.querySelectorAll("[data-section]").forEach((section) => sectionObserver.observe(section));

let scrollTick = 0;
window.addEventListener("scroll", () => {
  if (scrollTick) return;
  scrollTick = requestAnimationFrame(() => {
    root.style.setProperty("--page-y", `${window.scrollY}px`);
    if (window.innerWidth > 900) {
      const rect = moments.getBoundingClientRect();
      const travel = Math.max(1, moments.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const maxShift = Math.max(0, momentRail.scrollWidth - window.innerWidth + window.innerWidth * 0.08);
      momentRail.style.setProperty("--rail-x", `${(-progress * maxShift).toFixed(1)}px`);
    }
    scrollTick = 0;
  });
}, { passive: true });
