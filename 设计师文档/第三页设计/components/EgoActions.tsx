"use client";

import { useEffect, useRef, useState } from "react";

type ActiveAction = "works" | "earning" | null;

export default function EgoActions() {
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const activate = (action: Exclude<ActiveAction, null>) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setActiveAction(action);

    if (action === "works") {
      window.dispatchEvent(new CustomEvent("egoclip:spin"));
    }

    timerRef.current = window.setTimeout(() => setActiveAction(null), 1800);
  };

  return (
    <div className="cta-row" aria-label="EgoClip actions">
      <article className="cta-block">
        <button
          className={`cta-button cta-secondary${activeAction === "works" ? " is-active" : ""}`}
          type="button"
          onClick={() => activate("works")}
          aria-pressed={activeAction === "works"}
        >
          <span>See How It Works</span>
          <span className="cta-arrow" aria-hidden="true">↻</span>
        </button>
      </article>

      <article className="cta-block cta-earning">
        <button
          className={`cta-button cta-primary${activeAction === "earning" ? " is-active" : ""}`}
          type="button"
          onClick={() => activate("earning")}
          aria-pressed={activeAction === "earning"}
          aria-describedby="start-earning"
        >
          <span>Start Earning</span>
          <span className="cta-arrow" aria-hidden="true">→</span>
        </button>
        <p className={activeAction === "earning" ? "is-active" : ""} id="start-earning">
          The first 1,000 EgoClip members get early access to paid experiences. $0 to
          jion. No card. No payment today.
        </p>
      </article>
    </div>
  );
}
