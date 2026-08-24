"use client";

import { useEffect, useRef } from "react";

const activities = [
  {
    title: "Making breakfast",
    price: "[30 minutes] • [$2-$6]",
    image: "/breakfast-source.png",
    isComposite: true,
  },
  {
    title: "Organizing a workspace",
    price: "[60 minutes] • [$10-$15]",
    image: "/workspace.jpeg",
    isComposite: false,
  },
  {
    title: "Packing everyday objects",
    price: "[45 minutes] • [$3-$7]",
    image: "/packing.jpeg",
    isComposite: false,
  },
];

export default function EarningsExperience() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    page.classList.add("scroll-enhanced");

    const colorStops = [
      { at: 0, color: [82, 126, 164] },
      { at: 0.22, color: [108, 157, 194] },
      { at: 0.47, color: [155, 198, 223] },
      { at: 0.68, color: [218, 213, 169] },
      { at: 0.84, color: [241, 223, 158] },
      { at: 1, color: [239, 246, 238] },
    ];

    const updateBackgroundTone = () => {
      const maxScroll = Math.max(1, page.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const nextIndex = colorStops.findIndex((stop) => stop.at >= progress);
      const end = colorStops[nextIndex === -1 ? colorStops.length - 1 : nextIndex];
      const start = colorStops[Math.max(0, (nextIndex === -1 ? colorStops.length - 1 : nextIndex) - 1)];
      const range = Math.max(0.001, end.at - start.at);
      const localProgress = Math.min(1, Math.max(0, (progress - start.at) / range));
      const color = start.color.map((channel, index) =>
        Math.round(channel + (end.color[index] - channel) * localProgress),
      );

      page.style.setProperty("--scroll-tone", `rgb(${color.join(" ")})`);
    };

    const revealItems = Array.from(page.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -22%", threshold: 0.2 },
    );

    revealItems.forEach((item) => observer.observe(item));
    updateBackgroundTone();
    window.addEventListener("scroll", updateBackgroundTone, { passive: true });
    window.addEventListener("resize", updateBackgroundTone);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateBackgroundTone);
      window.removeEventListener("resize", updateBackgroundTone);
    };
  }, []);

  return (
    <main className="earnings-page" ref={pageRef}>
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy reveal-item" data-reveal>
          <h1 id="page-title">How much could I earn?</h1>
          <p>What you earn depends mainly on what you do and how long you do it.</p>
        </div>
        <div className="scroll-cue" aria-hidden="true">
          <span />
        </div>
      </section>

      <section className="activity-story" aria-label="Example activities and earnings">
        {activities.map((activity, index) => (
          <article className="activity-step reveal-item" data-reveal key={activity.title}>
            <div className="activity-copy">
              <span className="step-marker" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2>{activity.title}</h2>
              <p>{activity.price}</p>
            </div>

            <figure className="activity-media">
              {activity.isComposite ? (
                <div
                  className="breakfast-photo"
                  role="img"
                  aria-label={activity.title}
                />
              ) : (
                <img src={activity.image} alt={activity.title} />
              )}
            </figure>
          </article>
        ))}
      </section>

      <section className="summary" aria-label="Earnings and payment details">
        <div className="summary-grid" aria-hidden="true" />
        <div className="summary-copy">
          <h2 className="reveal-line reveal-item" data-reveal>
            Average earnings: $2-$15 per hour
          </h2>
          <p className="reveal-line reveal-item" data-reveal>
            Rates vary depending on the activity, duration, and quality of the experience.
          </p>
          <p className="reveal-line reveal-item" data-reveal>
            You choose what&apos;s worth your time.
          </p>
          <p className="payment-note">
            Most payments are sent within about 14 days after review
          </p>
        </div>
      </section>
    </main>
  );
}
