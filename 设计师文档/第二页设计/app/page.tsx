import EgoActions from "@/components/EgoActions";
import EgoClipScene from "@/components/EgoClipScene";

export default function Home() {
  return (
    <main className="ego-page">
      <EgoClipScene />
      <div className="background-veil" aria-hidden="true" />
      <section className="hero" aria-labelledby="page-title">
        <div className="message">
          <h1 id="page-title">What is this, and what’s in it for me?</h1>
          <div className="description">
            <p>Wear EgoClip while you cook, clean, work, or move through your day</p>
            <p>
              it turns you first-person, real-world experience into something robots can
              learn from – and a new way for you to earn .
            </p>
          </div>
        </div>
        <EgoActions />
      </section>
    </main>
  );
}
