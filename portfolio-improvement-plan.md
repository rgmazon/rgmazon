# RG Mazon Portfolio Rebuild — Full Project Context

This document is a complete, self-contained snapshot of this project: what
it is, what's been decided, what's been built so far, and what's left. It's
written to be pasted into a new AI conversation (any model/tool) so that
assistant has full grounding without needing the original chat history.

---

## 1. Project summary

Rebuilding a personal portfolio site (`rgmazon/rgmazon`) from a static
Vite + React + JavaScript SPA into a **Next.js + TypeScript + Supabase**
application with:

1. A public-facing portfolio site, content driven by a database instead of
   hardcoded arrays
2. A login-gated `/admin` area to create/edit/hide all of that content
3. A visual redesign based on a custom design system (`design_skill`,
   described below)
4. TypeScript, learned deliberately as part of this project — the developer
   is a TS beginner with a PHP background

This is a **fresh rebuild**, not an in-place migration of the old repo, and
not a continuation of an earlier, separate Next.js/Supabase admin panel
project the developer had also started — that earlier project was
explicitly set aside in favor of starting clean here.

Local repo name/path: `rgmazon` (developer works in WSL: Ubuntu-24.04),
package manager **pnpm**.

## 2. Developer context (for tone/depth calibration)

- Learning TypeScript as a beginner; strong background in PHP/Laravel, also
  comfortable with React, Next.js, Supabase, Tailwind, MySQL
- **Working style note (has changed once already — confirm current
  preference before assuming):** the project started with the developer
  wanting to write/run all code themselves, with the assistant guiding
  step-by-step and explaining concepts before/alongside instructions.
  Partway through Phase 3, the developer explicitly changed this to
  **wanting full code handed over directly by default**, without being
  asked to try it first. Concepts that don't transfer from PHP/Laravel
  should still be explained (Postgres schemas, Tailwind v4's `@theme`
  syntax, RLS vs GRANT layering, Server vs Client Components, etc.) —
  what changed is *who types the code*, not whether reasoning is explained.
- Tracking/planning documents (like this one) are maintained by the
  assistant directly regardless of the code-writing preference in effect.

## 3. Project standards (non-negotiable, apply to every phase)

- **Industry standard practices** — conventional Next.js/TypeScript project
  structure and naming; avoid idiosyncratic shortcuts
- **Security-minded** — proper environment variable handling; Supabase RLS
  policies written for every table as it's created, not deferred to later;
  real auth checks enforced at the route/middleware level (not just hidden
  UI links — the developer explicitly acknowledged an unlinked `/admin`
  page is still publicly reachable without an actual gate); input
  validation via Zod on both client and server
- **Scalable** — structured so new sections, tables, or admin pages can be
  added without restructuring existing code
- **Small, reusable components** — public sections composed from small,
  single-purpose components. Established convention (see Section 7):
  `components/ui/` holds generic, reusable-anywhere primitives (`Button`,
  `Section`); `components/<SectionName>/` holds section-specific
  composition assembled from those primitives

## 4. Old repo audit (`rgmazon/rgmazon`, for reference only — not being reused)

Stack: React 19 + Vite 7 (rolldown-vite) + Tailwind v4, plain JS/JSX, no
TypeScript. EmailJS-based contact form. Path alias `@/` → `src/`
(Vite-config only, no `jsconfig.json`, so editor autocomplete didn't work
for it).

Sections it had: Hero, About (bio + a 2x2 grid of icon/title/description
"highlight" cards), Experience, Projects (with a `ProjectModal.jsx` for
expanded details), Testimonials, Contact (EmailJS form). Layout: Navbar,
Footer. A `ThemeContext` provided light/dark toggling.

Things worth preserving *conceptually* in the rebuild (done, as of Phase 3):
- Tailwind v4 `@theme` token system for color/font design tokens — carried
  forward
- The About section's "highlight cards" concept — carried forward as a new
  `about_highlights` table (didn't exist in the original schema plan; added
  once we realized the old repo had this content and the plan didn't
  account for it — see Section 6)
- Solid SEO groundwork in `index.html` (canonical URL, OG/Twitter tags,
  JSON-LD Person/WebSite schema, sitemap) — **not yet replicated** in the
  rebuild; planned for Phase 6 using Next.js's `metadata` API
- A `ThemeContext`-style light/dark toggle — **not rebuilt**; `design_skill`
  only defines one warm-cream palette, no dark variant exists yet. Treated
  as an optional future addition, not part of the current plan.

Real bugs found in the old code (do not carry these forward):
- `Contact.jsx`: catch block referenced `error.text` but the caught
  variable was named `err` — threw inside the catch block itself, silently
  swallowing the real EmailJS error message
- Phone `href` was missing the `tel:` prefix (`href: ":+639..."` instead of
  `tel:+639...`)
- An identical 30-dot animated background block was copy-pasted in both
  `Projects.jsx` and `Contact.jsx`, using inline `Math.random()` on every
  render (wasteful, and a duplication smell)

Deliberate departures from the old repo's approach in the rebuild:
- Old `Navbar.jsx` had a light/dark theme toggle — dropped (see above)
- Old repo's `ProjectModal.jsx` (a popup/modal for project details) —
  replaced with a **dedicated page per project** at `/projects/[id]`,
  per explicit developer preference, plus a mouse-following hover preview
  on the projects list itself (see Section 7, Projects)

## 5. Design system (`design_skill`)

A separate skill file, reverse-engineered visually from a screenshot of the
Anthropic Academy / Skilljar course platform. Not an official brand kit —
approximate values, treated as a starting design language.

**Palette** (warm, muted, editorial — never pure white/black):
```
--color-bg: #f5f1e8        (page background, warm cream)
--color-bg-alt: #e8e4da    (secondary surface, e.g. sidebar)
--color-surface: #ffffff   (higher-contrast surfaces, used sparingly)
--color-text: #1f1d1a      (primary text, near-black)
--color-text-muted: #55524b
--color-text-inverse: #f5f1e8
--color-blue: #7c9cb4
--color-blue-dark: #5d7e97
--color-green: #aec0b0
--color-green-dark: #8fa695
--color-dark: #2e2c29      (primary buttons, tooltips, dark surfaces)
--color-dark-hover: #403d38
--color-border: #ddd8cb
--color-success: #7c9c7e
--color-warning: #c9a464
--color-error: #b4746a
```

**Typography:**
- Serif (headings + body copy) — implemented using **Source Serif 4** via
  `next/font/google` (free equivalent to the originally-specced Tiempos
  Text/GT Sectra, which are commercial fonts)
- Sans-serif (UI chrome only: buttons, inputs, badges, tooltips, nav
  microcopy) — implemented using **Inter** via `next/font/google`
- Rule, preserved throughout every section built so far: long-form/heading
  content stays serif; small interactive UI elements stay sans-serif

**`globals.css` structure (as currently implemented):**
- `@theme inline { ... }` block defines all color/font CSS variables above
- `body { background: var(--color-bg); color: var(--color-text);
  font-family: var(--font-serif); }`
- `@layer components { ... }` block defines `.btn`/`.btn-primary`/
  `.btn-secondary`/`.btn-ghost`, `.card`/`.card-blue`/`.card-green`,
  `.badge`, `.tooltip`. **Known gotcha:** this `@layer components` block
  was originally omitted when `globals.css` was first written in Phase 1
  (only the `@theme` token block was given) — this caused every `.card`/
  `.badge` usage in About and Skills to silently render as unstyled text
  for a while, since Tailwind doesn't error on an undefined class name, it
  just does nothing. Fixed once caught; **worth double-checking this block
  is present and complete if styling ever silently "doesn't apply."**
- `.card` originally had a `:hover { transform: translateY(-2px); }`
  lift effect — **explicitly removed** per developer feedback ("that's not
  how Anthropic's site hover effects behave"); cards should not move on
  hover

## 6. Chosen technical stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Server Components fetch from Supabase directly, no separate API layer needed |
| Database + Auth | Supabase (Postgres + Supabase Auth) | Single admin user, created manually via Supabase dashboard (Authentication → Users → Add user) — no in-app sign-up route exists or will exist |
| Styling | Tailwind CSS v4 | Tokens driven by `design_skill`, defined via `@theme`/`@layer components` in `globals.css` |
| Validation | Zod | Planned for admin forms in Phase 5 — not yet implemented |
| Images | Supabase Storage (planned, not yet implemented) | All `image_url` columns are currently `null`; components have fallback UI for the no-image case already |
| Icons | lucide-react | **Important gotcha:** the installed version (1.x) removed ALL brand/logo icons (GitHub, LinkedIn, etc.) entirely — not renamed, actually removed, for trademark reasons. `Github` and `Linkedin` imports will fail the build with "export doesn't exist." Workaround adopted: use a generic icon (`Code2`) where a "repository" concept is needed, and plain text links where no reasonable generic icon exists (e.g. LinkedIn in the Footer). Confirm any icon import actually exists in the installed version before using it — `grep -o 'export.*IconName' node_modules/lucide-react/dist/esm/lucide-react.mjs` is the fastest way to check. |
| Contact form | Not yet built | Old repo used EmailJS; rebuild approach (Route Handler vs EmailJS) not yet decided — no Contact section exists in the rebuild yet at all |
| Deploy | Vercel (planned) | Not yet set up |

## 7. Database schema (Postgres, Supabase)

Database: an existing shared Supabase project (developer calls it
`multi-projects`, hosting other unrelated apps too).

Schema: **`rgmazon_portfolio`** (custom, non-`public` schema, created for
isolation within the shared database; underscore naming deliberately, not
hyphenated, to avoid needing quoted identifiers everywhere in SQL/TS).

### Tables (current, final shape — 7 tables total)

**`profile`** — singleton row (hero/about/contact copy)
```sql
create table rgmazon_portfolio.profile (
  id uuid primary key default gen_random_uuid(),
  name text,
  tagline text,
  about text,
  email text,
  phone text,
  location text,
  github_url text,
  linkedin_url text,
  updated_at timestamptz not null default now()
);
```

**`projects`**
```sql
create table rgmazon_portfolio.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  tech_stack text[],
  live_url text,
  github_url text,
  sort_order int not null default 0,
  is_visible boolean not null default false,
  created_at timestamptz not null default now()
);
```
`is_visible` was originally named `published`, renamed via `ALTER TABLE`
to share the same visibility-toggle naming as `experience`/`testimonials`.
Default `false` for new projects — new project rows are presumed drafts
until explicitly published.

**`experience`**
```sql
create table rgmazon_portfolio.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  tech_stack text[],
  start_date date not null,
  end_date date,
  description text,
  sort_order int not null default 0,
  is_visible boolean not null default true
);
```
Dates: real Postgres `date` values, by convention always the 1st of the
month (e.g. `2024-01-01`); formatted client-side as "Jan 2024" (see
`src/lib/formatDate.ts` in Section 8). `end_date = null` means "Present."
`is_visible` defaults to `true` here (unlike `projects`) — a new
experience entry is presumed wanted-visible immediately.

**`skill_groups`** and **`skills`** (one-to-many; powers a "Skills" section
with editable category titles like "Front-end"/"Back-end"/"Tools", each
containing pill-style skill labels)
```sql
create table rgmazon_portfolio.skill_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort_order int not null default 0
);

create table rgmazon_portfolio.skills (
  id uuid primary key default gen_random_uuid(),
  skill_group_id uuid not null references rgmazon_portfolio.skill_groups(id) on delete cascade,
  label text not null,
  sort_order int not null default 0
);
```

**`testimonials`**
```sql
create table rgmazon_portfolio.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  quote text not null,
  avatar_url text,
  sort_order int not null default 0,
  is_visible boolean not null default true
);
```

**`about_highlights`** — added mid-Phase-3, not part of the original Phase
2 schema. Discovered missing when building the About section and checking
the old repo's `About.jsx`, which had a 2x2 grid of icon/title/description
cards that the original schema plan never accounted for.
```sql
create table rgmazon_portfolio.about_highlights (
  id uuid primary key default gen_random_uuid(),
  icon text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0
);
```
`icon` stores a plain string matching a `lucide-react` **export name**
(e.g. `"Layout"`, `"Server"`, `"MonitorSmartphone"`, `"ShieldCheck"`) — not
a component. Resolved at render time via `Icons[iconName as keyof typeof
Icons]` (see Section 8, About). No visibility toggle on this table
(considered core content, not something to selectively hide).

### Row Level Security (RLS)

RLS enabled on **all seven tables**. Access model:

| Table | `anon` (public) | `authenticated` (the developer, sole admin) |
|---|---|---|
| `profile` | `SELECT` | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `projects` | `SELECT` where `is_visible = true` | full `SELECT` + all writes |
| `experience` | `SELECT` where `is_visible = true` | full `SELECT` + all writes |
| `skill_groups` | `SELECT` | full `SELECT` + all writes |
| `skills` | `SELECT` | full `SELECT` + all writes |
| `testimonials` | `SELECT` where `is_visible = true` | full `SELECT` + all writes |
| `about_highlights` | `SELECT` | full `SELECT` + all writes |

Design assumption underpinning this: there is **no public sign-up** and
never will be — the only Supabase Auth account that will ever exist in
this project is the developer's own, **created manually via the Supabase
dashboard** (Authentication → Users → Add user, "Auto Confirm User"
checked), not through any in-app flow. This is why policies check
`to authenticated` broadly (any logged-in user) rather than a hardcoded
specific user UUID — those two things are equivalent here by construction.

### Critical operational gotcha discovered during Phase 2 (still applies to any future table)

Creating tables via raw SQL (rather than Supabase's Table Editor UI) does
**not** automatically make them reachable through Supabase's Data API.
Three independent layers all have to be correct, and a table can silently
fail at any one of them while looking fine at the others:

1. **Schema exposure** — Project Settings → Data API → Exposed schemas
   must include `rgmazon_portfolio`
2. **Table exposure** — Project Settings → Data API → Exposed tables has a
   *separate*, per-table toggle; tables created via SQL Editor do not get
   this automatically even if their schema is exposed (confirmed the hard
   way — all six original tables needed manual toggling)
3. **Grants** — Postgres-level `GRANT` statements must give `anon`/
   `authenticated` roles privileges on the schema/tables; separate from and
   prerequisite to RLS policies (`GRANT` = "can this role query the table
   at all", RLS = "which rows can they see once allowed to query")

The grants applied (including a forward-looking default so future tables
don't need this repeated):
```sql
grant usage on schema rgmazon_portfolio to anon, authenticated;

grant select, insert, update, delete
  on all tables in schema rgmazon_portfolio
  to anon, authenticated;

alter default privileges in schema rgmazon_portfolio
  grant select, insert, update, delete on tables to anon, authenticated;
```
**Confirmed working as intended:** when `about_highlights` was added later
in Phase 3, it appeared in Exposed Tables with a checkmark automatically —
no manual toggling needed that second time. This default-privileges fix is
solid; if a *brand new* table somehow still shows "API DISABLED," suspect
something else changed, not this mechanism.

### TypeScript types

Generated via the Supabase CLI to `src/lib/supabase/types.ts`:
```bash
npx supabase gen types typescript --project-id <ref> --schema rgmazon_portfolio > src/lib/supabase/types.ts
```
**Critical recurring gotcha:** this file is a point-in-time snapshot, not
auto-syncing. When `about_highlights` was added after the initial
generation, every reference to it in code failed to compile
(`TS2339`/`TS2769`, "Property does not exist" / "argument not assignable")
until this command was re-run. **Any time the schema changes — new table,
new column, new type — this command must be re-run**, or TypeScript will
be checking code against a stale, incomplete picture of the database.

## 8. Application architecture (as built)

### Supabase clients — two, not one

Next.js App Router needs separate browser vs. server Supabase clients:

**`src/lib/supabase/client.ts`** — for Client Components (`"use client"`)
```typescript
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**`src/lib/supabase/server.ts`** — for Server Components/Route
Handlers/Server Actions, handles cookie-based session reading
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — expected, safe to ignore
            // as long as middleware refreshes sessions (Phase 4).
          }
        },
      },
    }
  );
}
```
Env vars (`.env.local`, gitignored): `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon/public key only, never `service_role`
client-side).

**Important:** every query in this project must call `.schema("rgmazon_portfolio")`
explicitly — `supabase-js`'s default schema is `"public"`, and there is no
way to set a permanent default on the client itself.

### Data-access layer — `src/lib/data/`

Established pattern: Supabase queries live in dedicated functions here,
never inline inside components, wrapped in React's `cache()` for
per-request deduplication (not a persistent/global cache — scoped strictly
to one request's lifetime, resets on the next page load). One function per
table/concern so far:

- `getProfile()` — `profile.ts`, singleton via `.single()`
- `getAboutHighlights()` — `aboutHighlights.ts`, ordered array
- `getSkillGroups()` — `skillGroups.ts`, returns a joined/nested shape:
  ```typescript
  export type SkillGroup =
    Database["rgmazon_portfolio"]["Tables"]["skill_groups"]["Row"] & {
      skills: Database["rgmazon_portfolio"]["Tables"]["skills"]["Row"][];
    };
  ```
  via query `.select("*, skills(*)")` (PostgREST embedded-resource syntax
  following the FK relationship), with a `data as SkillGroup[]` type
  assertion since Supabase's generated types don't know about hand-written
  join shapes
- `getExperience()` — `experience.ts`, ordered array, no `is_visible`
  filter written explicitly (RLS handles it for anon requests)
- `getVisibleProjects()` and `getProjectById(id)` — `projects.ts`. The
  former explicitly filters `.eq("is_visible", true)` even though RLS
  would also enforce it (makes intent clear from reading the function);
  the latter has **no filter at all** — if a hidden project's UUID is
  requested directly, RLS blocks it and `.single()` returns null/error,
  same protection reused across both the list and detail code paths
- `getTestimonials()` — `testimonials.ts`, ordered array

### Component architecture

`src/components/` (sibling to `src/app/`, not nested inside it — folders
inside `app/` are routes in the App Router, so components must live
elsewhere to avoid ambiguity):

```
components/
  ui/
    Button.tsx       -- generic; variant: "primary" | "secondary" | "ghost"
    Section.tsx       -- shared section wrapper: py-24 px-6, max-w-5xl mx-auto, optional id prop
  layout/
    Header.tsx        -- Client Component (scroll state, mobile menu)
    Footer.tsx         -- Server Component (reads getProfile() for social links)
  Hero/
    Hero.tsx           -- Server Component, fetches getProfile()
    HeroContent.tsx    -- presentational, name + tagline
  About/
    About.tsx          -- Server Component, Promise.all([getProfile(), getAboutHighlights()])
    AboutHighlightCard.tsx  -- resolves icon string -> lucide-react component
  Skills/
    Skills.tsx         -- Server Component, getSkillGroups()
    SkillGroupCard.tsx
    SkillPill.tsx
  Experience/
    Experience.tsx     -- Server Component, getExperience()
    ExperienceItem.tsx -- uses formatMonthYear()
  Projects/
    Projects.tsx       -- Server Component, Promise.all([getVisibleProjects(), getProfile()])
    ProjectsList.tsx   -- Client Component ("use client") — mouse-tracked hover preview, responsive stacked layout below `sm`
  Testimonials/
    Testimonials.tsx
    TestimonialCard.tsx
```

Established convention going forward: **generic, reusable-anywhere
primitives go in `components/ui/`; section-specific composition goes in
its own named folder**, built from those primitives plus anything unique
to that one section.

`src/lib/formatDate.ts` — shared utility (not a component), used by
Experience, likely reusable elsewhere later:
```typescript
export function formatMonthYear(date: string | null): string {
  if (!date) return "Present";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC", // avoids off-by-one-day bug when parsing a date-only string
  }).format(new Date(date));
}
```

### Routing

- `src/app/page.tsx` — composes all sections in order: Hero, About,
  Skills, Experience, Projects, Testimonials
- `src/app/projects/[id]/page.tsx` — dynamic route, project detail page
  (replaces the old repo's modal approach per explicit developer
  preference). `params` is a `Promise<{ id: string }>` and must be
  `await`ed (recent Next.js change). Uses `notFound()` from
  `next/navigation` when `getProjectById` returns null.
- `src/app/layout.tsx` — root layout; wraps `<Header /> {children}
  <Footer />` inside `<body>` so both persist across every route; also
  where the two Google Fonts are loaded via `next/font/google` and
  exposed as CSS variables consumed by `globals.css`

### Notable UI/UX decisions made along the way

- Projects: **no modal** — clicking a project row navigates to a full
  `/projects/[id]` page. Hovering a row (desktop only, `hidden sm:block`
  on the preview) shows a small image/description preview that follows
  the mouse cursor, built with `useState` for `{x, y}` coordinates updated
  via `onMouseMove`, and `pointer-events-none` on the preview so it doesn't
  itself intercept hover events and cause flicker
- Projects list layout is fully responsive: a genuine restructure (not
  just hidden columns) between mobile (stacked flex column) and desktop
  (5-column CSS grid: `grid-cols-[2.5rem_1fr_auto_auto_auto]`), using
  `display: contents` (`sm:contents`) on a wrapper so icons can be grouped
  with mobile-only tech badges while still landing in separate grid
  columns on desktop
- Header nav links point to `/#about` etc. (not bare `#about`) — required
  because of the `/projects/[id]` detail page; a bare hash link only
  works if already on the homepage, `/#about` works correctly from any
  route
- Every section shares identical left/right margins via the common
  `Section` component (`max-w-5xl mx-auto` always on the outer container);
  any section wanting visually narrower content (Hero's centered text,
  Experience's timeline column) nests its own narrower `max-w-*` div
  *inside* that same consistent outer container, rather than changing the
  outer section's width — this was a real bug once (Section originally
  took a per-section `innerClassName` prop with different widths per
  section, causing visibly inconsistent margins) before being corrected
  to this single-fixed-outer-width approach

## 9. Phase plan and current status

- [x] **Phase 1 — Scaffold.** Next.js 16 + TS + Tailwind v4 via `pnpm
      create next-app` (TypeScript, ESLint, Tailwind, `src/` dir, App
      Router, default `@/*` alias). `design_skill` tokens wired into
      `globals.css`. Fonts wired via `next/font/google`.
- [x] **Phase 2 — Database.** `rgmazon_portfolio` schema, 7 tables (6
      original + `about_highlights` added mid-Phase-3), full RLS policy
      set, the 3-layer exposure/grants gotcha found and fixed (with a
      working forward-looking default), TypeScript types generated
      (regenerate after every schema change), placeholder seed data in
      all seven tables.
- [x] **Phase 3 — Public site.** All six sections built and rendering real
      Supabase data end-to-end (Hero, About, Skills, Experience, Projects,
      Testimonials), plus Header/Footer in the root layout. Responsive
      fixes applied to the Projects list. `globals.css`'s missing
      `@layer components` block found and fixed. `lucide-react` brand-icon
      removal gotcha found and worked around.
- [ ] **Phase 4 — Auth (in progress).** Decision made: admin account
      created manually via Supabase dashboard (Authentication → Users →
      Add user), no in-app sign-up route will ever exist. **Not yet done:**
      the actual account creation, the login page, and the `proxy.ts`
      middleware gate for `/admin/*` routes (real server-side auth check,
      not just hiding UI links).
- [ ] **Phase 5 — Admin CRUD.** Build admin pages one table at a time,
      starting with `projects` (most complex: `tech_stack` array, image
      upload, visibility toggle). Zod validation on both client and server
      for every form. Image uploads via Supabase Storage. Will need
      `types.ts` regenerated again if any admin-specific tables are added.
- [ ] **Phase 6 — Polish + deploy.** Animation pass, replicate the old
      repo's SEO setup using Next.js's `metadata` API (not yet done),
      decide on and build a Contact section/form (doesn't exist in the
      rebuild yet at all), deploy to Vercel.

## 10. Immediate next step

Phase 4: create the admin account in the Supabase dashboard (if not
already done), then build the login page and the `proxy.ts` middleware
gate for `/admin/*` routes, in that order (middleware's redirect target
needs the login page to exist first).
