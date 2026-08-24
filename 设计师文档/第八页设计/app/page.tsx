const metrics = [
  {
    value: "$1M+",
    label: "IN CUSTOMER ORDERS",
    detail: "Contracted by real customers in robotics.",
    className: "orders",
  },
  {
    value: "100,000+",
    label: "HOURS CONTRACTED",
    detail: "First-person experience scheduled for delivery.",
    className: "hours",
  },
  {
    value: "$500,000+",
    label: "EXPECTED NETWORK PAYOUT",
    detail: "Value expected to flow back to contributors.",
    className: "payout",
  },
  {
    value: "50,000+",
    label: "PEOPLE IN OUR NETWORK",
    detail: "A distributed capture network built to scale.",
    className: "people",
  },
];

export default function Home() {
  return (
    <main className="trust-page">
      <section className="founder-strip" aria-label="Meet the founder">
        <p className="founder-kicker">01 / PEOPLE BEHIND UBL</p>
        <div className="founder-message">
          <h2>Meet the founder</h2>
          <p>Building the data layer for physical AI from Silicon Valley.</p>
        </div>
        <a href="https://x.com" target="_blank" rel="noreferrer">
          MEET THE FOUNDER ON X <span>↗</span>
        </a>
      </section>

      <div className="hero-shell">
        <header className="topline">
          <a className="wordmark" href="#top" aria-label="UBL home">
            UBL<span />
          </a>
          <p><i /> EGOCLIP / PHYSICAL AI DATA</p>
          <p>TRUST FILE · 01</p>
        </header>

        <section className="intro" id="top" aria-labelledby="page-title">
          <div className="intro-title">
            <h1 id="page-title">WHY SHOULD<br />I TRUST <span>UBL</span>?</h1>
          </div>
          <div className="intro-copy">
            <p>UBL is built by a <strong>Silicon Valley-based team</strong> already working with <strong>robotics companies</strong>.</p>
            <p>We raised <strong>hundreds of thousands of dollars</strong> from investors—and turned that belief into <strong>orders, delivery capacity, and contributor payouts</strong>.</p>
            <a href="#proof">VIEW THE EVIDENCE <span>↓</span></a>
          </div>
        </section>

        <div className="evidence-label">
          <p>REAL CUSTOMERS. REAL ORDERS. REAL BUSINESS.</p>
          <span>Figures supplied by UBL · 2026</span>
        </div>
      </div>

      <section className="evidence" id="proof" aria-label="UBL business evidence">
        <div className="metric-grid">
          {metrics.map((metric, index) => (
            <article className={`metric-card ${metric.className}`} key={metric.value}>
              <span className="card-index">0{index + 1}</span>
              <p className="metric-value">{metric.value}</p>
              <div className="metric-copy">
                <h2>{metric.label}</h2>
                <p>{metric.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
