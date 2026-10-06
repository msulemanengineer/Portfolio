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
      idea: "Describe every movie with its own words, turn those words into a vector, and recommend the movies whose vectors point the same way.",
      how: [
        "Combine title, genres, keywords, cast, crew and overview into one text per movie.",
        "Vectorise with TF-IDF, so rare, specific words weigh more than common ones.",
        "Rank every other movie by cosine similarity to the one you picked.",
        "Serve recommendations from FastAPI, enrich them with posters and details from the TMDB API, and browse them in Streamlit.",
      ],
      decisions: [
        "Content-based, not collaborative: it needs no user history, so it works from the first visit.",
        "The TF-IDF matrix is precomputed and pickled, so a recommendation is a lookup and a sort — not a re-fit.",
      ],
      limits: [
        "It only knows what the metadata says: two films that feel alike but are described differently look unrelated.",
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
      idea: "A linear model gives every word a weight. The prediction is their sum, so every decision can be read back, word by word.",
      how: [
        "2,982 real, human-labelled review sentences from the UCI repository — IMDb, Yelp and Amazon.",
        "TF-IDF over single words and word pairs, so “not good” can carry a weight of its own.",
        "Logistic Regression against Multinomial Naive Bayes, tuned by cross-validation on the training set only.",
        "Scored once on 597 reviews the models never saw, then served in a Streamlit app that shows which words pushed each call.",
      ],
      decisions: [
        "C = 10 and min_df = 1 were chosen by cross-validation, not left at defaults.",
        "Logistic Regression shipped. Its 1-point lead over Naive Bayes is within the CV spread, so the real reason is interpretability.",
      ],
      limits: [
        "Train accuracy 1.000 against 0.821 on test: it memorises. Cross-validation (0.838) and the test set agree, so the estimate holds.",
        "No neutral class, and sarcasm fails — “Great, it broke on day one” reads as positive.",
        "“and” earned +4.53. That is a quirk of a small corpus, not language — the kind of thing more data fixes.",
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
      idea: "Keyword counting says “ML modelling” and “machine learning” have nothing in common. Sentence embeddings compare meaning; a skill dictionary keeps the result explainable.",
      how: [
        "Extract the resume from PDF with PyMuPDF and clean both documents.",
        "Split each into ~180-word chunks with a 30-word overlap, embed every chunk with all-MiniLM-L6-v2 and average them into one 384-dimension vector.",
        "Cosine similarity between the two vectors gives semantic similarity.",
        "In parallel, a 50-skill dictionary with aliases gives skill coverage.",
        "Overall = 0.7 × semantic + 0.3 × coverage — and the UI always shows that formula next to the number.",
      ],
      decisions: [
        "Two independent paths: embeddings for meaning, a dictionary for explainability. Each can be inspected, and defended, on its own.",
        "If a posting names no dictionary skill, the score falls back to pure semantic similarity instead of penalising the candidate for a blind spot.",
      ],
      limits: [
        "A learning prototype, not a hiring tool: the score measures how similar two texts are, not competence.",
        "Scores are uncalibrated (cosine typically lands between 0.3 and 0.8) — useful for comparing resumes against one posting, not as a grade.",
        "The 0.7 / 0.3 weights are a design choice, not learned parameters.",
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
      idea: "Find the passages that match the question, then let the model answer using nothing else — with those passages on screen so the answer can be checked.",
      how: [
        "Extract text from an uploaded PDF with pypdf.",
        "Chunk it into 1,000-character passages with a 200-character overlap.",
        "Embed every passage with all-MiniLM-L6-v2 and index the vectors in FAISS.",
        "Embed the question and retrieve the top 4 passages scoring at least 0.20 cosine similarity.",
        "A strict prompt tells the LLM to answer only from those passages — or to say the answer isn’t in the document.",
        "Every answer ships with its sources: the passage, its page number and its similarity score.",
      ],
      decisions: [
        "No LangChain. The pipeline is plain Python, so every stage can be read, changed and explained.",
        "Pluggable LLM providers — OpenAI, Anthropic, any OpenAI-compatible endpoint, or a mock mode that runs with no API key.",
        "A FastAPI backend (/upload, /ask, /reset) with interactive docs, and tests covering extraction, chunking, search, RAG and the API.",
      ],
      limits: [
        "An in-memory index, one document at a time, not multi-user: a local demo, not a deployed service.",
        "Pure dense retrieval, so exact identifiers and rare acronyms can be missed.",
        "Retrieval quality hasn’t been measured against a labelled set, so no accuracy is claimed.",
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
