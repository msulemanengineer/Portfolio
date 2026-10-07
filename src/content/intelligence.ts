/**
 * Sheet 02 — Learned. Every figure here is taken from the project READMEs,
 * `reports/metrics.json` (sentiment), the AI/ML resume, or LinkedIn.
 * Illustrations are labelled as such; nothing is estimated.
 */
import { identity } from "./identity";

const repo = (name: string) => `${identity.links.github}/${name}`;

export type FigureKind = "cosine" | "weights" | "blend" | "rag";

export interface Chapter {
  id: string;
  no: string;
  verb: string;
  step: string;
  title: string;
  short: string;
  question: string;
  idea: string;
  how: string[];
  decisions: string[];
  limits: string[];
  stack: string[];
  repo: string;
  figure: FigureKind;
}

export const intelligence = {
  intro: {
    kicker: "Sheet 02 — Learned",
    title: "Teaching software to read.",
    lede: "Four projects, one progression: turn text into numbers, numbers into meaning, and meaning into answers you can check. Built in Python, measured where measurement is possible — and honest where it isn’t.",
  },

  chapters: [
    {
      id: "count",
      no: "01",
      verb: "Count",
      step: "words → vectors",
      title: "Movie Recommendation System",
      short: "Movie recommender",
      question: "Which movies are like the one you just watched?",
      idea: "Turn each movie’s description into a vector and recommend the ones pointing the same way.",
      how: [
        "Genres, cast, crew and overview → one TF-IDF vector per movie.",
        "Rank every other movie by cosine similarity.",
        "Serve it with FastAPI and TMDB posters; browse in Streamlit.",
      ],
      decisions: [],
      limits: [
        "Not evaluated against user ratings, so no accuracy is claimed.",
      ],
      stack: ["Python", "pandas", "scikit-learn", "FastAPI", "Streamlit", "TMDB API"],
      repo: repo("movie-recommendation-system"),
      figure: "cosine",
    },
    {
      id: "weigh",
      no: "02",
      verb: "Weigh",
      step: "vectors → decisions",
      title: "Customer Review Sentiment Analysis",
      short: "Sentiment analysis",
      question: "Is this review positive or negative — and which words decided it?",
      idea: "Every word gets a learned weight; the prediction is their sum, so each decision can be read back.",
      how: [
        "2,982 labelled UCI reviews, TF-IDF over words and word pairs.",
        "Logistic Regression vs Naive Bayes, tuned by cross-validation.",
        "Scored once on 597 unseen reviews.",
      ],
      decisions: [],
      limits: [
        "No neutral class, and sarcasm fools it: “Great, it broke on day one” reads positive.",
      ],
      stack: ["Python", "pandas", "scikit-learn", "Matplotlib", "Streamlit", "pytest"],
      repo: repo("Customer-Review-Sentiment-Analysis"),
      figure: "weights",
    },
    {
      id: "embed",
      no: "03",
      verb: "Embed",
      step: "keywords → meaning",
      title: "AI Resume–Job Matching",
      short: "Resume–job matching",
      question: "How much does a resume overlap with a job — in meaning, not just keywords?",
      idea: "Compare resumes and jobs by meaning, not keywords, and always show how the score was made.",
      how: [
        "Embed both texts with all-MiniLM-L6-v2 (384 dimensions).",
        "Cosine similarity for meaning; a 50-skill dictionary for coverage.",
        "Overall = 0.7 × semantic + 0.3 × coverage, shown next to the number.",
      ],
      decisions: [],
      limits: [
        "A learning prototype, not a hiring tool: it measures text similarity, not competence.",
      ],
      stack: ["Python", "sentence-transformers", "PyMuPDF", "FastAPI", "Streamlit", "pytest"],
      repo: repo("AI-Resume-Job-Matching-System"),
      figure: "blend",
    },
    {
      id: "retrieve",
      no: "04",
      verb: "Retrieve",
      step: "meaning → answers",
      title: "Document Q&A Assistant (RAG)",
      short: "Document Q&A (RAG)",
      question: "Can a language model answer from your document — and only your document?",
      idea: "Answer from your document and nothing else, with the source passages on screen.",
      how: [
        "Chunk the PDF, embed each passage, index it in FAISS.",
        "Retrieve the top 4 passages above 0.20 similarity.",
        "A strict prompt answers only from them, or says “not found”.",
      ],
      decisions: [],
      limits: [
        "A local demo: one document at a time, in memory, and retrieval isn’t benchmarked yet.",
      ],
      stack: ["Python", "sentence-transformers", "FAISS", "pypdf", "FastAPI", "Streamlit", "pytest"],
      repo: repo("AI-Document-Q-A-Assistant"),
      figure: "rag",
    },
  ] satisfies Chapter[],

  /** reports/metrics.json — Logistic Regression, test set of 597 reviews. */
  sentiment: {
    testRows: 597,
    accuracy: 0.8208,
    f1Macro: 0.8208,
    rocAuc: 0.8952,
    cvMean: 0.8377,
    cvStd: 0.0119,
    trainAccuracy: 1.0,
    confusion: { tn: 246, fp: 53, fn: 54, tp: 244 },
    /** README “What the model learned”: the 10 strongest weights per class. */
    weights: {
      positive: [
        ["great", 10.49],
        ["good", 8.14],
        ["love", 5.12],
        ["nice", 5.11],
        ["amazing", 4.98],
        ["excellent", 4.83],
        ["and", 4.53],
        ["delicious", 4.28],
        ["wonderful", 4.24],
        ["well", 4.17],
      ],
      negative: [
        ["not", -9.33],
        ["bad", -7.43],
        ["poor", -5.14],
        ["terrible", -4.78],
        ["worst", -4.69],
        ["don", -4.26],
        ["disappointment", -3.59],
        ["stupid", -3.48],
        ["not good", -3.45],
        ["awful", -3.4],
      ],
    } as { positive: Array<[string, number]>; negative: Array<[string, number]> },
    notes: {
      and: "corpus quirk",
      "not good": "bigram",
      don: "from don’t",
    } as Record<string, string>,
  },

  /** README table: why keyword counting is not enough. */
  keywordVsMeaning: [
    ["machine learning", "ML modelling"],
    ["REST API development", "built endpoints with FastAPI"],
    ["data analysis", "analysed three years of transactions"],
  ] as Array<[string, string]>,

  curriculum: {
    title: "The foundations",
    lede: "The theory behind the projects, completed in 2026.",
    items: [
      {
        name: "Machine Learning Specialization",
        issuer: "DeepLearning.AI · Stanford Online",
        date: "Aug 2026",
        credential: "LR7QRIW5GY19",
        href: "https://www.coursera.org/account/accomplishments/specialization/LR7QRIW5GY19",
        courses: [
          {
            name: "Supervised Machine Learning: Regression and Classification",
            date: "Jul 2026",
            href: "https://www.coursera.org/account/accomplishments/verify/NF2KDPZCDU3V",
          },
          {
            name: "Advanced Learning Algorithms",
            date: "Aug 2026",
            href: "https://www.coursera.org/account/accomplishments/verify/KR317SDS1E0P",
          },
          {
            name: "Unsupervised Learning, Recommenders, Reinforcement Learning",
            date: "Aug 2026",
            href: "https://www.coursera.org/account/accomplishments/verify/0PJPG8JHACTK",
          },
        ],
      },
      {
        name: "Machine Learning with Python",
        issuer: "IBM",
        date: "Jul 2026",
        credential: "KN2NZ2VLF89L",
        href: "https://www.coursera.org/account/accomplishments/verify/KN2NZ2VLF89L",
        courses: [],
      },
    ],
  },

  toolkit: [
    { area: "Languages", items: ["Python", "SQL"] },
    {
      area: "Machine learning",
      items: ["Supervised & unsupervised learning", "Classification", "Regression", "Clustering", "Feature engineering", "Model evaluation", "Recommendation systems"],
    },
    {
      area: "NLP & generative AI",
      items: ["TF-IDF", "Text classification", "Embeddings", "Vector similarity", "RAG", "Prompt engineering"],
    },
    {
      area: "Libraries",
      items: ["NumPy", "pandas", "scikit-learn", "Matplotlib", "sentence-transformers", "FAISS"],
    },
    { area: "Serving & tools", items: ["FastAPI", "Streamlit", "Jupyter", "Docker", "Git"] },
  ],

  cta: {
    kicker: "Hiring for AI engineering?",
    title: "I build models that show their working — on systems that ship.",
    body: "Production software engineering at Endless Invo., machine learning fundamentals from DeepLearning.AI and Stanford, and four end-to-end AI projects you can read line by line.",
    primary: "Download AI/ML résumé",
    secondary: "Engineering background",
  },
} as const;
