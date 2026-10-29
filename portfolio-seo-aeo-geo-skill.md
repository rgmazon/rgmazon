# Portfolio SEO, AEO & GEO Optimization Skill
### A complete playbook for making a fullstack developer's portfolio discoverable by search engines, answer engines, and generative AI systems

---

## How to use this document

This is a reference skill, not a one-time checklist. Work through it in order:

1. **SEO (Search Engine Optimization)** — get indexed and ranked by Google/Bing.
2. **AEO (Answer Engine Optimization)** — get pulled into featured snippets, voice assistants, and "People Also Ask" boxes.
3. **GEO (Generative Engine Optimization)** — get cited by ChatGPT, Perplexity, Claude, Google AI Overviews, and other LLM-powered answer tools.

All three layers reinforce each other: clean technical SEO is the foundation, structured/answer-first content wins AEO, and clear entity signals + machine-readable context win GEO.

---

## 1. Technical SEO Foundations

### 1.1 Core Web Vitals & Performance
Search engines use real-user performance data as a ranking signal. For a dev portfolio, this is also a live demo of your skills — treat it as a resume line item.

- **LCP (Largest Contentful Paint) < 2.5s** — optimize your hero image/text, preload critical fonts, avoid render-blocking JS.
- **INP (Interaction to Next Paint) < 200ms** — replaces FID; avoid heavy main-thread JS on load.
- **CLS (Cumulative Layout Shift) < 0.1** — set explicit width/height on images and embeds, reserve space for fonts/ads.
- Use `next/image` (Next.js), `<link rel="preload">` for fonts, and self-host fonts instead of pulling from third-party CDNs when possible.
- Ship minimal JS. A portfolio doesn't need a huge SPA bundle — consider static generation (Next.js `getStaticProps`, Astro, or SSG in general) over full client-side rendering.
- Compress images (WebP/AVIF), lazy-load below-the-fold images (`loading="lazy"`), and use responsive `srcset`.
- Test with **Lighthouse**, **PageSpeed Insights**, and **WebPageTest**. Target 90+ on all four categories.

### 1.2 Crawlability & Indexing
- **`robots.txt`** at the root — allow all major crawlers, explicitly allow AI crawlers if you want GEO visibility (see Section 3).
- **`sitemap.xml`** — auto-generate on build (e.g., `next-sitemap`), submit to Google Search Console and Bing Webmaster Tools.
- Canonical tags (`<link rel="canonical">`) on every page to avoid duplicate-content issues, especially if you have `/blog` posts syndicated elsewhere (Dev.to, Medium, Hashnode).
- Avoid orphan pages — every project/case-study page should be linked from a nav, index, or sitemap page.
- Use clean, descriptive URLs: `/projects/realtime-chat-app` not `/projects?id=4`.
- HTTPS everywhere, single canonical domain (redirect `www` ↔ non-`www` consistently, no mixed content).

### 1.3 Mobile & Accessibility
- Fully responsive layout — mobile-first is now the default for Google indexing.
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`) — helps both crawlers and screen readers.
- Sufficient color contrast, keyboard navigability, alt text on all images (dual benefit: accessibility + image SEO).
- Accessibility (WCAG 2.1 AA) is increasingly correlated with better rankings and is a good signal of engineering quality to recruiters.

---

## 2. On-Page SEO Content Strategy

### 2.1 Metadata
Every page needs unique, hand-written (not templated) metadata:

```html
<title>Jane Doe — Fullstack Developer (React, Node.js, PostgreSQL)</title>
<meta name="description" content="Fullstack developer specializing in React, Node.js, and PostgreSQL. Explore case studies, open-source contributions, and how to hire me for your next project.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://janedoe.dev/">
```

- **Title tags**: 50–60 characters, include your name + core stack/specialty + role. Front-load the most important keyword.
- **Meta descriptions**: 140–160 characters, written as a compelling summary (this is your "ad copy" in search results) — not stuffed with keywords.
- Unique titles/descriptions per project page, blog post, and the homepage. Never duplicate across pages.

### 2.2 Open Graph & Social Metadata
Improves click-through from shared links (LinkedIn, Twitter/X, Slack) — an indirect but real ranking and traffic driver.

```html
<meta property="og:title" content="Jane Doe — Fullstack Developer">
<meta property="og:description" content="React, Node.js & PostgreSQL specialist. View projects and case studies.">
<meta property="og:image" content="https://janedoe.dev/og-image.png">
<meta property="og:url" content="https://janedoe.dev/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

- OG image: 1200×630px, includes your name, role, and a strong visual — generate dynamically per project page if possible (Vercel OG Image API is a good fit for a Next.js portfolio).

### 2.3 Heading Structure & Keyword Placement
- One `<h1>` per page (your name + role on homepage; project title on project pages).
- Logical `<h2>`/`<h3>` hierarchy — don't skip levels.
- Naturally include target keywords in headings: role + stack + location/niche (e.g., "Fullstack Developer specializing in React & Node.js").
- Avoid keyword stuffing — write for humans first, search engines second.

### 2.4 Content Depth (Case Studies > Screenshots)
This is the single highest-leverage content move for a dev portfolio, and it feeds directly into AEO/GEO too.

For each project, write a genuine case study, not just a screenshot + tech-stack badges:
- **Problem** — what need or pain point did this solve?
- **Approach** — architecture decisions, tradeoffs, why this stack.
- **Challenges** — a specific technical obstacle and how you solved it (this is gold for both search and AI citation — specific, quotable, technical detail).
- **Results/impact** — metrics if you have them (performance gains, users, load handling).
- **Code snippets** — real, syntax-highlighted, relevant.

This does three things at once: real long-form content for Google to index, natural Q&A structure for AEO, and citable expertise signals for GEO.

### 2.5 A Blog/Writing Section
Recruiters, search engines, and AI models all reward demonstrated expertise over claimed expertise.
- Write 1–2 technical posts/month on real problems you solved (debugging stories, "how I built X," architecture deep-dives).
- Target long-tail, specific queries developers actually search: "how to debounce search input in React with TypeScript" beats "React tips."
- Internally link blog posts to relevant project case studies, and vice versa.

---

## 3. Structured Data (Schema.org) — The SEO/GEO Bridge

Structured data (JSON-LD) is the single most important lever for AEO and GEO — it gives crawlers and LLMs unambiguous, machine-readable facts instead of forcing them to infer from prose.

### 3.1 `Person` schema (homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jane Doe",
  "url": "https://janedoe.dev",
  "image": "https://janedoe.dev/jane-doe.jpg",
  "jobTitle": "Fullstack Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance / Current Company"
  },
  "knowsAbout": ["React", "Node.js", "PostgreSQL", "TypeScript", "AWS", "System Design"],
  "sameAs": [
    "https://github.com/janedoe",
    "https://linkedin.com/in/janedoe",
    "https://twitter.com/janedoe",
    "https://stackoverflow.com/users/janedoe"
  ]
}
```
`sameAs` is critical — it links your identity across platforms so search engines and AI systems build a confident "entity graph" of who you are, rather than treating each profile as unrelated.

### 3.2 `WebSite` schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Jane Doe — Fullstack Developer Portfolio",
  "url": "https://janedoe.dev"
}
```

### 3.3 `CreativeWork` / `SoftwareSourceCode` schema (per project)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "Realtime Chat App",
  "description": "A realtime chat application built with React, Socket.io, and Redis pub/sub, supporting 10k concurrent connections.",
  "programmingLanguage": ["TypeScript", "JavaScript"],
  "codeRepository": "https://github.com/janedoe/realtime-chat",
  "author": { "@type": "Person", "name": "Jane Doe" }
}
```

### 3.4 `FAQPage` schema (for AEO — see Section 4)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What tech stack does Jane Doe specialize in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jane specializes in React, Node.js, PostgreSQL, and AWS, with a focus on scalable realtime applications."
      }
    }
  ]
}
```

### 3.5 `BreadcrumbList` schema
Helps both ranking display and disambiguation of site structure for crawlers — add on project/blog subpages.

**Validate everything** with Google's Rich Results Test and Schema.org Validator before shipping.

---

## 4. AEO — Answer Engine Optimization

AEO targets featured snippets, "People Also Ask," voice assistants (Siri, Alexa, Google Assistant), and instant-answer boxes. The core principle: **structure content so the answer is extractable in one paragraph or list, independent of surrounding fluff.**

### 4.1 Answer-First Writing
- Open sections with a direct, self-contained 1–3 sentence answer, *then* elaborate.
- Bad: "There are many ways to think about state management in React, and it depends on your use case, but generally speaking..."
- Good: "Use React Context for simple global state and Zustand or Redux Toolkit for complex, high-frequency updates. Context re-renders all consumers on change, which hurts performance at scale."

### 4.2 Build a Real FAQ Section
Add a dedicated FAQ block to your homepage and/or an "About" page targeting queries people actually ask about hiring/working with you:
- "What is Jane Doe's tech stack?"
- "Is Jane Doe available for freelance work?"
- "What industries has Jane Doe worked in?"
- "How can I contact Jane Doe for a project?"

Mark it up with `FAQPage` schema (Section 3.4) — this is what gets pulled into Google's expandable FAQ rich results and voice-assistant answers.

### 4.3 Use Lists, Tables, and Definitions
Answer engines heavily favor scannable, structured formats over dense prose:
- Numbered steps for "how to" content.
- Comparison tables for "X vs Y" content (e.g., "REST vs GraphQL" if you write about it).
- Bolded key terms followed by a one-line definition.

### 4.4 Target Question-Shaped Long-Tail Keywords
Instead of optimizing only for "fullstack developer," also target the actual questions your audience types:
- "how to hire a fullstack developer for a startup MVP"
- "what does a fullstack developer do day to day"
- "react vs next.js for a portfolio site"

Use tools like AnswerThePublic, AlsoAsked, or Google's "People Also Ask" box to mine real question phrasing, then answer them directly in blog posts.

### 4.5 Conversational, Natural-Language Phrasing
Voice search queries are longer and more conversational than typed queries ("who is the best React developer near me" vs "React developer NYC"). Write section headers as natural questions where it fits, since these often become the exact snippet Google extracts.

---

## 5. GEO — Generative Engine Optimization

GEO targets citation and inclusion in AI-generated answers from ChatGPT, Perplexity, Google AI Overviews, Claude, and similar systems. These tools don't "rank" pages the way Google does — they retrieve, synthesize, and cite the clearest, most authoritative, most structured source they can find. Optimizing for this is newer than SEO/AEO and best practices are still evolving, but the following are well-supported by current guidance from major AI labs and SEO researchers.

### 5.1 Give AI Crawlers Explicit Access
Check and explicitly allow (don't block) major AI crawlers in `robots.txt` if you want to be cited:

```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://janedoe.dev/sitemap.xml
```

Note: crawler names and policies change — verify current bot user-agent strings periodically (OpenAI, Google, Anthropic, Perplexity, and Common Crawl all publish theirs). Blocking these means you're invisible to AI Overviews/ChatGPT browsing/Perplexity citations entirely.

### 5.2 Publish an `llms.txt`
An emerging (not yet universal) convention — a plain-text file at your site root that gives LLMs a clean, curated map of your most important content, similar in spirit to `sitemap.xml` but written for language models rather than crawlers.

```
# Jane Doe — Fullstack Developer

> Fullstack developer specializing in React, Node.js, PostgreSQL, and AWS.
> Available for freelance and full-time roles.

## Key Pages
- [About](https://janedoe.dev/about): Background, skills, and experience
- [Projects](https://janedoe.dev/projects): Full case-study index
- [Realtime Chat App](https://janedoe.dev/projects/realtime-chat): Architecture deep-dive
- [Blog](https://janedoe.dev/blog): Technical writing
- [Contact](https://janedoe.dev/contact): How to reach me
```

Support is inconsistent across AI systems today, but it's low-cost to add and is gaining adoption — treat it as a forward-looking bet, not a guaranteed win.

### 5.3 Write for Extractability, Not Just Readability
LLMs synthesize answers by pulling self-contained factual chunks. Structure content so each paragraph/section can stand alone and be correctly attributed:
- State your name, role, and key facts explicitly and repeatedly across pages (don't rely on pronouns like "I" alone — LLMs handling scraped/chunked text lose context; anchor facts to "Jane Doe" by name periodically).
- Avoid burying key facts in images, PDFs-only content, or JS-rendered content that isn't in the initial HTML/SSR output (server-render or statically generate — don't rely purely on client-side rendering for facts you want cited).
- Prefer clear declarative sentences over marketing fluff: "Jane Doe has 6 years of experience building distributed systems in Go and Node.js" is directly citable; "Jane is a passionate problem-solver who loves crafting delightful experiences" is not.

### 5.4 Build Topical Authority & External Corroboration
LLMs (and Google's own AI Overviews) weight sources more heavily when the same facts are corroborated across multiple independent, credible sources — this is sometimes called "off-site GEO."
- Keep your GitHub, LinkedIn, Stack Overflow, Dev.to/Hashnode, and portfolio bios **consistent** in wording for your name, role, and stack.
- Contribute real answers on Stack Overflow / technical forums under a consistent identity — these get frequently cited/trained on and reinforce your expertise entity.
- Guest posts or being quoted on established dev publications (freeCodeCamp, Smashing Magazine, dev.to features) meaningfully boosts how "known" your entity is to these systems.
- Use identical `sameAs` links (Section 3.1) everywhere to reinforce a single, disambiguated entity.

### 5.5 Freshness Signals
AI systems and Google AI Overviews favor recently updated, dated content for anything skill/tool-related (frameworks change fast).
- Show visible "last updated" dates on project and blog pages.
- Periodically refresh older posts/project descriptions rather than leaving stale tech-stack claims (e.g., update if you migrated a project from JS to TypeScript).

### 5.6 Direct, Quotable Statements of Fact
Write a few unambiguous, self-contained sentences an AI could lift almost verbatim into a citation, e.g., on an About page:
> "Jane Doe is a fullstack developer based in [location] with 6 years of professional experience, specializing in React, Node.js, and distributed systems. She has shipped production systems handling over 1M monthly active users."

Specific numbers, roles, and technologies are far more citable than vague claims.

---

## 6. Measurement & Iteration

Set these up once, check monthly:

| Tool | What it tells you |
|---|---|
| Google Search Console | Indexing status, search queries, click-through rate, Core Web Vitals |
| Bing Webmaster Tools | Bing/Yahoo indexing (also feeds some AI systems) |
| PageSpeed Insights / Lighthouse | Performance, accessibility, best practices scores |
| Google Rich Results Test | Validates your structured data actually qualifies for rich results |
| Ahrefs / Ubersuggest (free tiers) | Keyword tracking, backlink monitoring |
| Manual prompts in ChatGPT/Perplexity/Claude | "Who is [your name], the developer?" / "recommend a fullstack developer skilled in React" — check if/how you're cited |

### Suggested cadence
- **Weekly**: skim Search Console for crawl errors.
- **Monthly**: publish 1–2 new case studies/blog posts, re-check Core Web Vitals after any redesign.
- **Quarterly**: re-validate all structured data, refresh stale project descriptions, re-check AI crawler access as bot policies evolve, manually query AI tools to see how you're being represented.

---

## 7. Quick-Reference Launch Checklist

- [ ] HTTPS, single canonical domain, clean URLs
- [ ] `sitemap.xml` submitted to Search Console + Bing Webmaster Tools
- [ ] `robots.txt` allows major search **and** AI crawlers
- [ ] Optional `llms.txt` published at root
- [ ] Unique title + meta description per page
- [ ] Open Graph + Twitter Card tags with a real OG image
- [ ] `Person`, `WebSite`, `SoftwareSourceCode`, and `FAQPage` JSON-LD schema implemented and validated
- [ ] Core Web Vitals all green (Lighthouse 90+)
- [ ] Semantic HTML + WCAG 2.1 AA accessibility pass
- [ ] Each project has a real case study (problem → approach → challenge → result), not just a screenshot
- [ ] Dedicated FAQ section targeting hiring-related questions
- [ ] Blog/writing section with question-shaped, long-tail technical posts
- [ ] Consistent name/role/stack wording and `sameAs` links across GitHub, LinkedIn, Stack Overflow, Twitter/X
- [ ] Visible "last updated" dates on content
- [ ] Explicit, specific, quotable facts about your experience (numbers, years, technologies, scale)
- [ ] Monthly monitoring routine set up (Search Console, manual AI-tool spot checks)

---

*This guide reflects search, answer-engine, and generative-engine best practices as broadly understood as of mid-2026. AI crawler policies, bot names, and LLM retrieval behavior are an actively moving target — re-verify crawler directives and emerging conventions (like `llms.txt` adoption) periodically rather than treating this as a permanently fixed spec.*
