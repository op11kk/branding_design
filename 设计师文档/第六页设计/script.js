const paperStack = document.querySelector("#research-paper");
const paper = paperStack?.querySelector(".paper");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (paperStack) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        paperStack.classList.add("is-visible");
        observer.disconnect();
      }
    },
    { threshold: 0.18 },
  );

  observer.observe(paperStack);
}

if (paperStack && paper) {
  paperStack.addEventListener("pointermove", (event) => {
    if (reduceMotion.matches || event.pointerType === "touch") return;

    const bounds = paperStack.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    paper.style.setProperty("--rx", `${(-y * 1.8).toFixed(2)}deg`);
    paper.style.setProperty("--ry", `${(x * 2.4).toFixed(2)}deg`);
  });

  paperStack.addEventListener("pointerleave", () => {
    paper.style.setProperty("--rx", "0deg");
    paper.style.setProperty("--ry", "0deg");
  });
}

const closing = document.querySelector(".closing");
const closingLines = closing ? [...closing.querySelectorAll("p")] : [];

const splitWordsIntoLetters = (element, startDelay) => {
  const sentence = element.textContent.trim();
  const words = sentence.split(" ");
  let letterIndex = 0;

  element.setAttribute("aria-label", sentence);
  element.textContent = "";

  words.forEach((word, wordIndex) => {
    const wordElement = document.createElement("span");
    wordElement.className = "story-word";
    wordElement.setAttribute("aria-hidden", "true");

    [...word].forEach((character) => {
      const letter = document.createElement("span");
      letter.className = "story-letter";
      letter.textContent = character;
      letter.style.setProperty(
        "--letter-delay",
        `${startDelay + letterIndex * 24}ms`,
      );
      wordElement.append(letter);
      letterIndex += 1;
    });

    element.append(wordElement);
    if (wordIndex < words.length - 1) {
      element.append(document.createTextNode(" "));
    }
  });

  return startDelay + letterIndex * 24 + 520;
};

if (closing && closingLines.length) {
  let nextSentenceDelay = 120;

  closingLines.forEach((line) => {
    nextSentenceDelay = splitWordsIntoLetters(line, nextSentenceDelay);
  });

  document.documentElement.classList.add("js-letter-reveal");

  const closingObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        closing.classList.add("is-visible");
        closingObserver.disconnect();
      }
    },
    { threshold: 0.28 },
  );

  closingObserver.observe(closing);
}
