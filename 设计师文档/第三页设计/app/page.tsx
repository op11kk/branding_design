"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const introSceneRef = useRef<HTMLElement>(null);
  const processStoryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = introSceneRef.current;
    const story = processStoryRef.current;
    if (!scene || !story) return;

    let frame = 0;

    const updateIntro = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const distance = Math.max(scene.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
      const reveal = Math.min(Math.max((progress - 0.68) / 0.32, 0), 1);
      scene.style.setProperty("--intro-progress", progress.toFixed(4));
      scene.style.setProperty("--intro-reveal", reveal.toFixed(4));

      const storyRect = story.getBoundingClientRect();
      const storyDistance = Math.max(story.offsetHeight - window.innerHeight, 1);
      const storyProgress = Math.min(
        Math.max(-storyRect.top / storyDistance, 0),
        1,
      );
      const smoothStep = (value: number) => value * value * (3 - 2 * value);
      let phase = 0;

      if (storyProgress < 0.18) {
        phase = 0;
      } else if (storyProgress < 0.42) {
        phase = smoothStep((storyProgress - 0.18) / 0.24);
      } else if (storyProgress < 0.58) {
        phase = 1;
      } else if (storyProgress < 0.82) {
        phase = 1 + smoothStep((storyProgress - 0.58) / 0.24);
      } else {
        phase = 2;
      }
      story.style.setProperty("--story-progress", storyProgress.toFixed(4));

      story.querySelectorAll<HTMLElement>(".process-card").forEach((card, index) => {
        const opacity = Math.min(Math.max(1 - Math.abs(phase - index), 0), 1);
        card.style.setProperty("--card-opacity", opacity.toFixed(4));
        card.style.setProperty("--card-scale", (0.985 + opacity * 0.015).toFixed(4));
        card.style.visibility = opacity < 0.002 ? "hidden" : "visible";
      });
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateIntro);
    };

    updateIntro();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <main className="process-page">
      <section className="intro-scene" ref={introSceneRef}>
        <header className="intro" aria-labelledby="page-title">
          <div className="intro-copy">
            <h1 id="page-title">
              <span className="intro-word">What do </span>
              <span className="intro-word">I </span>
              <span className="intro-word">actually </span>
              <span className="intro-word">have to </span>
              <span className="intro-word">do?</span>
            </h1>
            <p>Wear it. Live your day. Earn.</p>
          </div>
          <span className="scroll-hint" aria-hidden="true">
            <span>Scroll to explore</span>
            <i />
          </span>
        </header>
      </section>

      <section
        className="process-story"
        ref={processStoryRef}
        aria-label="How EgoClip works"
      >
        <div className="process-stage">
          <article className="process-card wear-card">
          <header className="card-copy">
            <span className="step-label">STEP 01</span>
            <h2>Wear EgoClip</h2>
            <p>Put it on and go about your day.</p>
          </header>

          <figure className="single-visual">
            <img
              src="/visuals/wear-egoclip.png"
              alt="A person wearing EgoClip outdoors"
            />
          </figure>
          </article>

          <article className="process-card activity-card">
          <header className="card-copy">
            <span className="step-label">STEP 02</span>
            <h2>Do what you already do</h2>
            <p>Cook, clean, organize, use tools, walk the dog, and more.</p>
          </header>

          <div className="activity-collage" aria-label="Everyday activities">
            <figure>
              <img
                src="/visuals/walk-the-dog.jpeg"
                alt="Walking dogs in a park"
              />
            </figure>
            <figure>
              <img
                src="/visuals/cooking-at-home.jpeg"
                alt="Preparing food in a kitchen"
              />
            </figure>
            <figure>
              <img
                src="/visuals/making-pasta.jpeg"
                alt="Cooking pasta at home"
              />
            </figure>
            <figure>
              <img
                src="/visuals/gardening-herbs.jpeg"
                alt="Cutting fresh herbs in a garden"
              />
            </figure>
          </div>
          </article>

          <article className="process-card earn-card">
          <header className="card-copy">
            <span className="step-label">STEP 03</span>
            <h2>Earn from your experience</h2>
            <p>Your everyday experience can earn you money.</p>
            <p className="final-note">
              Before you start, you&apos;ll see exactly what to do, what it can
              earn, and what we&apos;re looking for.
            </p>
          </header>

          <figure className="phone-visual">
            <img
              src="/visuals/earnings-phone-cutout.png"
              alt="EgoClip earnings screen showing a completed experience"
            />
          </figure>
          </article>

          <div className="story-progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>
    </main>
  );
}
