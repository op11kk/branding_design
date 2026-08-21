export default function Home() {
  return (
    <main className="page-shell">
      <div className="top-rule" aria-hidden="true" />

      <section className="intro" aria-labelledby="page-title">
        <h1 id="page-title">02 — What do I actually have to do?</h1>
        <p>Wear it. Live your day. Earn.</p>
      </section>

      <section className="feature-grid" aria-label="How it works">
        <article className="feature">
          <div className="feature-copy">
            <h2>Wear EgoClip</h2>
            <p>Put it on and go about your day.</p>
          </div>
        </article>

        <article className="feature">
          <div className="feature-copy">
            <h2>Do what you already do</h2>
            <p>Cook, clean, organize, use tools, walk the dog, and more.</p>
          </div>
        </article>

        <article className="feature">
          <div className="feature-copy">
            <h2>Earn from your experience</h2>
            <p>Your everyday experience can earn you money.</p>
          </div>
        </article>
      </section>

      <section className="visual-grid" aria-label="EgoClip in everyday life">
        <figure className="visual visual-wear">
          <img
            src="/visuals/wear-egoclip.png"
            alt="A person wearing EgoClip outdoors"
          />
          <div className="floating-panel panel-wear" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </figure>

        <figure className="visual visual-day">
          <img
            src="/visuals/walk-the-dog.jpeg"
            alt="Walking three dogs on an autumn path"
          />
          <div className="floating-panel panel-day" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </figure>
      </section>

      <footer className="closing-note">
        <p>
          Before you start, you&apos;ll see exactly what to do, what it can earn,
          and what we&apos;re looking for.
        </p>
      </footer>
    </main>
  );
}
