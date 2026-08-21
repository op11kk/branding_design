import type { Metadata } from "next";
import "./page.css";

export const metadata: Metadata = {
  title: "How much could I earn?",
  description:
    "Explore typical earnings for everyday experience activities and choose what is worth your time.",
};

const activities = [
  {
    number: "01",
    title: "Making breakfast",
    detail: "[30 minutes] · [$2–$6]",
    imageClass: "activity-image breakfast",
    image: null,
    alt: "Preparing breakfast in a sunlit kitchen",
  },
  {
    number: "02",
    title: "Packing everyday objects",
    detail: "[45 minutes] · [$3–$7]",
    imageClass: "activity-image",
    image: "/packing.jpeg",
    alt: "Packing everyday clothes into a suitcase",
  },
  {
    number: "03",
    title: "Organizing a workspace",
    detail: "[60 minutes] · [$10–$15]",
    imageClass: "activity-image",
    image: "/workspace.jpeg",
    alt: "Organizing samples and sketches on a wooden desk",
  },
];

export default function Home() {
  return (
    <main className="earnings-page">
      <section className="hero" aria-labelledby="page-title">
        <div className="section-mark" aria-hidden="true">
          <span>03</span>
          <i />
        </div>

        <div className="hero-copy">
          <h1 id="page-title">
            How much could I <em>earn?</em>
          </h1>
          <p>
            What you earn depends mainly on <strong>what you do and how long you do it.</strong>
          </p>
        </div>

        <div className="orbit-mark" aria-hidden="true">
          <span>$</span>
        </div>
      </section>

      <section className="activities" aria-label="Example activities and earnings">
        {activities.map((activity, index) => (
          <article className={`activity-card card-${index + 1}`} key={activity.title}>
            <div className="image-shell">
              {activity.image ? (
                <img
                  className={activity.imageClass}
                  src={activity.image}
                  alt={activity.alt}
                />
              ) : (
                <div className={activity.imageClass} role="img" aria-label={activity.alt} />
              )}
              <span className="card-number" aria-hidden="true">
                {activity.number}
              </span>
            </div>
            <div className="activity-copy">
              <h2>{activity.title}</h2>
              <p>{activity.detail}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="earnings-summary" aria-label="Earnings and payment details">
        <div className="summary-main">
          <div className="signal" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h2>Average earnings: $2–$15 per hour</h2>
          <p>Rates vary depending on the activity, duration, and quality of the experience.</p>
        </div>

        <div className="summary-side">
          <p className="choice">You choose what&apos;s worth your time.</p>
          <div className="divider" />
          <p className="payment">
            Most payments are sent within about <strong>14 days</strong> after review
          </p>
          <span className="check" aria-hidden="true">✓</span>
        </div>
      </section>
    </main>
  );
}
