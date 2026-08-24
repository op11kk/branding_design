const page = document.querySelector("#page");
const form = document.querySelector("#accessForm");
const input = document.querySelector("#join");

window.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  page.style.setProperty("--mx", x.toFixed(3));
  page.style.setProperty("--my", y.toFixed(3));
}, { passive: true });

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!input.reportValidity()) return;
  form.classList.add("is-complete");
  form.innerHTML = '<div class="success-message" role="status"><span>✓</span>You\'re on the early access list.</div>';
});

document.querySelector("#navCta")?.addEventListener("click", () => input.focus());
