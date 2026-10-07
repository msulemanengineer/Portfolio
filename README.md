# Muhammad Suleman — Portfolio

**AI/ML Engineer · Lahore, Pakistan**

The personal site of Muhammad Suleman: a software engineer with a production background who now builds machine learning systems. It shows the work and how it was built: four AI/ML projects, three production platforms, and small ML experiments you can run in the browser.

**Live:** https://msulemanengineer.netlify.app

---

## What's inside

| Page | What it shows |
|---|---|
| **Origin** (`/`) | The name assembles from ~6,000 particles: noise reconstructed into a name. Move through it to push the particles; click to scatter them. |
| **Intelligence** (`/intelligence`) | Four AI/ML projects as one progression: a TF-IDF recommender, an interpretable sentiment model, embedding-based resume matching and a RAG document assistant. Measured results are shown with their source. |
| **Engineering** (`/engineering`) | Production work at Endless Invo.: a live architecture blueprint, a role timeline, and an explorer for three platforms. |
| **Case studies** (`/work/…`) | Telemedline, Tabbna Academy and Limoarc: users, features, hard problems and stack. |
| **Lab** (`/lab`) | Interactive experiments: score a review with real learned word weights, retrieve passages by cosine similarity, watch gradient descent fit a line. |
| **About** (`/about`) | The journey from 2023 to now, including the Web-e-Thon hackathon. |
| **Contact** (`/contact`) | Email, both résumés, LinkedIn and GitHub. |

## Principles

- **Honest content.** Every number traces to a repository, a résumé or a certificate. Illustrations are labelled as illustrations, and each ML project states its limits next to its score.
- **Motion with a reason.** Animations show an idea (rules becoming learning, requests moving through a system, a model converging) rather than decorating the page.
- **Fast and accessible.** Lighthouse scores 100 on desktop and 90–95 on simulated slow mobile for performance, with 100 for accessibility, best practices and SEO. The site works with the keyboard and respects `prefers-reduced-motion`.

## Tech

- **Next.js 16** (App Router), exported as a fully static site
- **React 19** and **TypeScript**
- **CSS Modules** with design tokens, plus **Tailwind CSS v4** for base tooling
- **Canvas 2D and SVG** for every interactive piece; no WebGL and no animation library
- **next/font** for self-hosted Instrument Sans, Newsreader, Instrument Serif and IBM Plex Mono
- **SEO:** metadata, Open Graph image (`next/og`), JSON-LD `Person` schema, sitemap and robots

## Project structure

```
src/
  app/            routes, layout, metadata, sitemap, robots, OG image
  components/     one folder per page (origin, engineering, intelligence, lab, about, contact, work)
    chrome/       persistent frame, navigation and title strip
    motion/       shared reveal primitive (InView)
  content/        all copy and data, typed — edit text here, not in components
  lib/            particle sampling, seeded random, site config
public/           résumés, project screenshots, hackathon photos
scripts/          post-build step for static hosting
```

All facts live in `src/content/` (`identity.ts`, `engineering.ts`, `intelligence.ts`, `about.ts`, `lab.ts`), so updating the site rarely means touching a component.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # static site in out/
npm run preview    # serve out/ locally to test the production build
npm run typecheck
```

## Deploy

The build output is a plain static folder, `out/`, so any static host works.

- **Netlify (manual):** run `npm run build`, then drag the `out/` folder onto *Deploys* in the Netlify dashboard.
- **Netlify (from Git):** `netlify.toml` already sets the build command and publish folder.
- **Custom domain:** set the public address at build time so canonical URLs, the sitemap and social previews point to it:

  ```bash
  NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
  ```

  Or change the fallback in `src/lib/site.ts`.

`public/_headers` serves the social-preview image with the right content type and caches hashed assets for a year.

## Contact

- Email: [sulemanaslam.engineer@gmail.com](mailto:sulemanaslam.engineer@gmail.com)
- LinkedIn: [in/msulemanengineer](https://www.linkedin.com/in/msulemanengineer/)
- GitHub: [msulemanengineer](https://github.com/msulemanengineer)

---

© Muhammad Suleman. The code is shared for reference; the written content, résumés and images belong to the author.
