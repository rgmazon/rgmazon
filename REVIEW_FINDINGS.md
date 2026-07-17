# Project Review — Findings & Implementation Plan

Date: 2026-07-17
Scope: full repo review (React 19 + Vite + Tailwind portfolio, EmailJS contact form). Verified via `eslint`, `pnpm build`, `pnpm audit`, and manual read-through of all components/sections.

---

## 1. Bugs

### 1.1 `ReferenceError` in Contact form error handler
- **File:** `src/sections/Contact.jsx:69`
- **Issue:** `catch (err) { ... setSubmitStatus({ ..., message: error.text || ... }) }` — the variable is named `err`, but `error` is referenced instead. `error` is undefined, so this throws inside the `catch` block itself.
- **Impact:** When EmailJS actually fails (bad keys, network error, rate limit), the user never sees the intended error message — the catch body throws before `setSubmitStatus` can update state. The form just silently fails to show feedback.
- **Fix:** Change `error.text` → `err.text`.
- **Effort:** trivial (1 line).
- **Status:** ✅ fixed.

### 1.2 `setState` called synchronously inside `useEffect`
- **File:** `src/components/ProjectModal.jsx:17` (inside `Carousel`)
- **Issue:** `useEffect(() => { setIndex(0); }, [project])` triggers an extra render pass every time the modal opens with a new project. Flagged by React's `react-hooks/set-state-in-effect` rule.
- **Impact:** Minor perf cost only, no visible bug today — but it's the kind of pattern that gets worse if the component grows.
- **Fix:** Prefer resetting via a `key={project.title}` prop on `<Carousel />` so it remounts naturally, instead of an effect-driven reset.
- **Effort:** small (move logic to parent, drop the effect).
- **Status:** ✅ fixed — `Carousel` now takes `key={project.title}` in `ProjectModal.jsx`; the reset effect was removed.

### 1.3 `Math.random()` called during render (decorative background dots)
- **Files:** originally found in `src/sections/About.jsx`, `src/sections/Contact.jsx`, `src/sections/Experience.jsx`, `src/sections/Projects.jsx` — same pattern also existed in `Hero.jsx` (50 dots) and `Testimonials.jsx` (different animation duration range), fixed alongside the rest.
- **Issue:** Each section rendered "green dots" with `left`, `top`, `animation`, and `animationDelay` computed via `Math.random()` directly in JSX during render.
- **Impact:** Every re-render (theme toggle, any parent state change, React 19 double-invoke in StrictMode) reshuffled all dot positions — wasted computation and a visible jump for users if it happened post-mount.
- **Fix:** Compute the dot configs once via `useState(() => Array.from({length:30}, () => ({...})))` or `useMemo(() => ..., [])`, then map over the stored array instead of calling `Math.random()` inline.
- **Effort:** small, but repeated in 6 files — extracted a shared `<BackgroundDots />` component to fix it once and remove duplication.
- **Status:** ✅ fixed — added `src/components/BackgroundDots.jsx` (props: `count`, `color`, `durationMin`, `durationRange`, `delayMax`, memoized once via `useState`). All 6 sections (`Hero`, `About`, `Experience`, `Projects`, `Testimonials`, `Contact`) now use it in place of their inline dot-rendering blocks.

---

## 2. Security

No high-severity findings. Items checked and cleared:

| Check | Result |
|---|---|
| Secrets in repo (`.env`, API keys hardcoded) | Clean — `.env` is gitignored, EmailJS keys read from `import.meta.env` only |
| XSS surface (`dangerouslySetInnerHTML`, unsanitized user input rendered as HTML) | None found — static portfolio, no backend, no user-generated HTML |
| Reverse-tabnabbing (`target="_blank"` without `rel="noreferrer"`) | Clean — both instances in `ProjectModal.jsx` set `rel="noreferrer"` |
| `.idea`, `node_modules` tracked in git | Not tracked — correctly gitignored |
| `pnpm audit` | 12 advisories, **all in devDependencies** (transitive `minimatch`/`flatted` via `eslint`, `@babel/core` via `@vitejs/plugin-react`). Build-time only, not shipped to the deployed bundle. Low real-world risk. |

### 2.1 Dev-dependency vulnerabilities (low priority)
- **Packages:** `minimatch` (<3.1.4, 3 ReDoS advisories via `eslint`), `flatted` (<3.4.0, DoS + prototype pollution via `eslint`'s cache), `@babel/core` (<=7.29.0, arbitrary file read via sourcemap comment, via `@vitejs/plugin-react`), plus `picomatch`, `ajv`, `brace-expansion`, `postcss`, `js-yaml` (all transitive).
- **Plan:** run `pnpm update` for these transitive deps (or bump `eslint` / `@vitejs/plugin-react` to versions that pull in patched sub-deps) during a routine maintenance pass. Not urgent — none of this code ships to production.
- **Status:** ✅ fixed — ran `pnpm update`, which bumped `react`/`react-dom` 19.2.4→19.2.7, `tailwindcss`/`@tailwindcss/vite` 4.1.18→4.3.3, `eslint` 9.39.2→9.39.5, `@vitejs/plugin-react` 5.1.2→5.2.0, `@types/react` 19.2.10→19.2.17, `eslint-plugin-react-hooks` 7.0.1→7.1.1 (all patch/minor, no breaking changes). `pnpm audit` now reports **no known vulnerabilities**. Verified `eslint`, `pnpm build`, and dev server still work after the bump.

---

## 3. Enhancements / Housekeeping

### 3.1 ESLint config doesn't recognize Node globals in config files
- **File:** `eslint.config.js`
- **Issue:** `vite.config.js` uses `__dirname`, which ESLint flags as `no-undef` because the config only sets `globals.browser`. It works fine at runtime (Vite runs config files under Node), it's just a lint false positive.
- **Fix:** add a config-file override, e.g.:
  ```js
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  }
  ```
- **Status:** ✅ fixed — added the override to `eslint.config.js`; `__dirname` no-undef error is gone.

### 3.2 Stray `Zone.Identifier` files committed under `public/assets`
- **Location:** `public/assets/projects/graveLocator/...:Zone.Identifier`, `public/assets/projects/heroDex/...:Zone.Identifier`
- **Issue:** Windows-download metadata files, not meant to be served or tracked.
- **Fix:** delete them and confirm they're excluded going forward (add `*:Zone.Identifier` to `.gitignore` if on a machine that generates these).
- **Status:** ✅ fixed — removed all 14 tracked `Zone.Identifier` files via `git rm` (staged, not yet committed) and added `*:Zone.Identifier` to `.gitignore`.

### 3.3 Placeholder project links
- **Files:** `src/sections/Projects.jsx` — several entries have `link: "#"` or `github: "#"` (Applemax Stream, FLIQUEY Landing Page, Image Converter's `link`, etc.)
- **Issue:** Not a bug, but worth confirming intentional before the portfolio is shared with recruiters/clients — dead links reduce credibility.
- **Fix:** either fill in real URLs or remove the link/github affordance for projects that don't have one (e.g. conditionally hide the icon instead of linking to `#`).
- **Status:** ✅ fixed (partial) — `Projects.jsx` card overlay and `ProjectModal.jsx`'s "Live"/"Code" buttons now only render when `project.link`/`project.github` is set **and** isn't the `"#"` placeholder (previously `ProjectModal` rendered on any truthy value, including `"#"`; `Projects.jsx` always rendered both icons regardless). The overlay links in `Projects.jsx` also now open in a new tab with `rel="noreferrer"`, matching `ProjectModal`. Still open: the actual placeholder URLs (Applemax Stream, FLIQUEY Landing, etc.) need real links supplied by you when available — this only stops dead `#` links from being clickable in the meantime.

---

## 4. Implementation Plan

Suggested order, grouped by effort and blast radius:

1. **Quick correctness fixes (do first, ~10 min total)**
   - [x] 1.1 Fix `err`/`error` typo in `Contact.jsx`
   - [ ] 3.1 Add Node globals override to `eslint.config.js`
   - [ ] 3.2 Delete stray `Zone.Identifier` files

2. **Small refactors (~30–45 min)**
   - [x] 1.3 Extract shared `<BackgroundDots />` component, memoize the random values once, replace the duplicated inline blocks (6 sections)
   - [x] 1.2 Fix `ProjectModal` carousel reset via `key` prop instead of effect-driven `setState`

3. **Content/housekeeping (no code risk, do whenever)**
   - [ ] 3.3 Review and fill in or hide placeholder project links
   - [ ] 2.1 `pnpm update` to pick up patched dev-dependency versions; re-run `pnpm audit` to confirm clean

Each item is independent — no ordering dependency between groups, so they can be done in any order or split across sessions.
