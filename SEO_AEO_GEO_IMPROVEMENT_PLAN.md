# SEO, AEO, and GEO Improvement Plan

Based on an audit against `portfolio-seo-aeo-geo-skill.md` (2026-07-29). Scope excludes `rgmazon-v3/`.

## Audit summary

The site already does metadata, JSON-LD, and FAQ content well. The dominant problem is structural: this is a pure client-side-rendered Vite/React SPA with no SSR/SSG/prerendering. Fetching the page without JS execution returns:

```html
<body><div id="root"></div></body>
```

Every section — Hero, About, Projects, Experience, FAQ — only exists after the JS bundle hydrates. Googlebot mostly copes via its render queue, but GPTBot, ClaudeBot, PerplexityBot, and CCBot are documented as unreliable at executing JS. Right now they see an empty page, which means the good copy, FAQ answers, and JSON-LD facts are effectively invisible for GEO citation purposes. Fixing this is the highest-leverage item below — everything else is secondary until it's addressed.

---

## P0 — Fix crawlable content (do this first)

### 0.1 Prerender the site to static HTML
The page is a single route (hash-anchored sections, no router), so a full framework migration isn't required — a build-time prerender is enough to get real content into the initial HTML response.

- Add a prerender step to the build (e.g. `vite-plugin-prerender`, or a small Puppeteer/Playwright script that renders the built `dist/index.html` in a headless browser after `vite build` and overwrites `dist/index.html` with the fully rendered DOM).
- Verify success with `curl https://rgmazon.pages.dev/ | grep "Rudolfh Mazon"` (or similar) — the raw HTML should contain real prose, not just `<div id="root">`.
- Client-side hydration still runs on top for interactivity (theme toggle, project modal, contact form) — this is a rendering-output fix, not a rewrite.
- If a Puppeteer-based approach adds too much build complexity, the fallback is migrating to a lightweight SSG (Astro islands, or Next.js static export) — bigger lift, but worth keeping on the table if the prerender script becomes brittle.

---

## P1 — Quick wins (low effort, real impact)

### 1.1 Expand AI crawler access in `robots.txt`
Currently only `GPTBot` and `Google-Extended` are explicitly allowed. Add the rest of the major AI crawlers so nothing is silently excluded:
```
User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: CCBot
Allow: /
```

### 1.2 Publish `llms.txt`
Add `public/llms.txt` with a short curated summary (name, role, stack, availability) and links to the homepage's key sections. Low cost, forward-looking bet per skill §5.2.

### 1.3 Fix sitemap entries
Drop the `#about`, `#projects`, `#faq`, `#contact` hash-fragment URLs from `sitemap.xml` — they aren't independently crawlable pages and add sitemap noise. Keep just the homepage entry unless/until real subpages exist.

### 1.4 Fix favicon MIME type
`index.html` declares `type="image/svg+xml"` for `favicon.ico`, which is actually an `.ico` file. Correct the `<link rel="icon">` type (or ship an actual `.svg` favicon to match the tag).

### 1.5 Self-host third-party images
Devicon skill icons (jsdelivr) and testimonial avatars (Unsplash) are hotlinked. Download and serve from `/public/assets` to remove the extra DNS/TLS hops and avoid breakage if the CDN changes URLs — minor CWV win, mostly a reliability fix.

---

## P2 — Content depth (feeds SEO + AEO + GEO simultaneously)

### 2.1 Turn project entries into real case studies
Current project cards/modal repeat the same one-paragraph marketing blurb. Per skill §2.4, restructure each project (in `Projects.jsx` / `ProjectModal.jsx`) around:
- **Problem** — what need this solved
- **Approach** — architecture/stack decisions and why
- **Challenge** — one specific technical obstacle and the fix (most citable part for GEO)
- **Result** — a concrete outcome if available (users, performance numbers, scale)

This is the single most reusable win — it strengthens indexable long-form content, gives AEO a natural Q&A shape, and gives GEO tools a specific, quotable technical detail to cite.

### 2.2 Add `SoftwareSourceCode` schema per project
Once case-study content exists, add a JSON-LD block per project (can live in `ProjectModal.jsx` or be injected when a project is opened) following skill §3.3, linking `codeRepository` to the GitHub links already present.

### 2.3 Add a visible "last updated" signal
There's currently only a hidden comment (`// last updated: January 2026`) in `Footer.jsx`. Make this a visible, dynamic date in the footer or About section — skill §5.5 flags this as a freshness signal AI systems weight for fast-moving tech stacks.

### 2.4 Consider a lightweight blog/writing section (optional, longer-term)
Not urgent for a single-freelancer portfolio, but it's the main lever the skill calls out for long-tail AEO queries ("how to X in React with Y"). Worth revisiting once the P0/P1 items are shipped and if there's bandwidth for 1–2 posts/month.

---

## Recommended order

1. Ship the prerender fix (P0.1) — validate with a raw `curl` fetch before moving on.
2. Robots.txt + llms.txt + sitemap + favicon fixes (P1.1–1.4) — all small, independent, same PR is fine.
3. Self-host hotlinked images (P1.5).
4. Rewrite project descriptions into case-study format (P2.1), then add per-project schema (P2.2).
5. Visible last-updated date (P2.3).
6. Blog section — revisit later, not blocking.

## Validation checklist after implementation

- [ ] `curl` the live homepage with no JS execution and confirm real text content is present in the HTML
- [ ] Google Rich Results Test passes for `Person`, `WebSite`, `Service`, `FAQPage`, and new `SoftwareSourceCode` blocks
- [ ] `robots.txt` allows all listed crawlers; `llms.txt` resolves at root
- [ ] Lighthouse SEO/Performance/Accessibility still 90+ after prerender step is added
- [ ] Manually prompt ChatGPT/Perplexity/Claude with "who is Rudolfh Mazon, the developer?" a few weeks after deploy to check citation behavior
