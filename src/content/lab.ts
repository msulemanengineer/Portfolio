/**
 * Sheet 03 — Scratch. Small, honest experiments that run in the browser.
 * Exp. 01 uses the 20 published weights from the sentiment project README;
 * Exp. 02 and 03 use toy data and say so.
 */
import { intelligence } from "./intelligence";

export const lab = {
  intro: {
    kicker: "Sheet 03 — Scratch",
    title: "The lab.",
    lede: "Small experiments, built to be poked. Each one runs in your browser and shows one idea from my machine learning work, with nothing hidden behind the result.",
  },

  sentiment: {
    no: "01",
    title: "Sentiment, by hand",
    idea: "A linear model scores text by adding up word weights. Type a review and watch each word push the score.",
    note: "Uses only the 20 strongest weights from my sentiment model (the full model has 20,000 features) and omits the intercept, so it is a sketch of how the model decides, not the model itself.",
    examples: [
      "Great food and amazing service",
      "Not good. The worst delivery, terrible",
      "I don't love it but the screen is nice",
      "Great, it broke on day one",
    ],
    weights: [...intelligence.sentiment.weights.positive, ...intelligence.sentiment.weights.negative] as Array<[string, number]>,
    repo: "https://github.com/msulemanengineer/Customer-Review-Sentiment-Analysis",
  },

  neighbours: {
    no: "02",
    title: "Nearest neighbours",
    idea: "Retrieval ranks passages by the angle between vectors. Drag the question; the closest passages light up, and anything under the threshold is ignored.",
    note: "Toy two-dimensional vectors. Real embeddings have 384 dimensions, but cosine similarity works the same way: direction matters, length doesn’t.",
    passages: [
      { label: "Refund policy", x: 0.95, y: 0.2 },
      { label: "Payment failed", x: 0.9, y: 0.3 },
      { label: "Stripe checkout", x: 0.8, y: 0.44 },
      { label: "Invoice download", x: 0.46, y: 0.07 },
      { label: "Book a visit", x: 0.8, y: 0.66 },
      { label: "Reschedule", x: 0.6, y: 0.62 },
      { label: "Cancel booking", x: 0.7, y: 0.88 },
      { label: "Doctor hours", x: 0.4, y: 0.74 },
      { label: "Video consult", x: 0.24, y: 0.94 },
      { label: "Prescriptions", x: 0.14, y: 0.56 },
      { label: "Lab results", x: 0.1, y: 0.8 },
      { label: "Reset password", x: 0.22, y: 0.32 },
    ],
    repo: "https://github.com/msulemanengineer/AI-Document-Q-A-Assistant",
  },

  descent: {
    no: "03",
    title: "Gradient descent",
    idea: "A line learns from data one small step at a time. Add points, press play, and watch the error fall. Push the learning rate too far and it never settles.",
    note: "Linear regression on points you place, trained with plain batch gradient descent on mean squared error: the first algorithm in the Machine Learning Specialization.",
    rates: [0.05, 0.3, 1, 2.2],
  },
} as const;
