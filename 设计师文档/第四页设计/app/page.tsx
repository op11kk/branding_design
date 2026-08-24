import type { Metadata } from "next";
import EarningsExperience from "./EarningsExperience";
import "./page.css";

export const metadata: Metadata = {
  title: "How much could I earn?",
  description: "What you earn depends mainly on what you do and how long you do it.",
};

export default function Home() {
  return <EarningsExperience />;
}
