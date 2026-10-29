# Liquid Glass Redesign Plan

UI/UX audit of the current site and a phased plan to redesign it around Apple's Liquid Glass principles.

## 0. Read this first: what "real" Liquid Glass means on the web

Apple ships Liquid Glass as a **system material** for SwiftUI, UIKit and AppKit. Its docs describe it as a dynamic material that "combines the optical properties of glass with a sense of fluidity" and adapts to overlap, focus state and accessibility settings ([Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass), [overview](https://developer.apple.com/documentation/technologyoverviews/liquid-glass)). Apple publishes no web or CSS implementation, and I found no mention of the web in those pages.

So this plan does two separate things:

1. **Applies Apple's documented design principles** (layering, restraint, hierarchy, adaptivity, accessibility). These transfer to any platform.
2. **Approximates the material in CSS.** The recipes in section 5 are my own, not Apple's. They will look like glass; they will not behave like Apple's renderer. If you want the real material, that is a native iOS/macOS app.

## 1. Apple principles this plan follows (from the docs above)

| # | Principle | What it means here |
|---|---|---|
| P1 | Glass is a **distinct functional layer for controls and navigation**, floating above content | Navigation, buttons, badges and modal controls get glass. Content cards do **not**. |
| P2 | **Avoid overusing it.** Limit to the most important functional elements | Today ~every surface is `.glass`. Cut it down to a small set. |
| P3 | Don't layer glass on glass; don't crowd controls | No nested glass; standard spacing. |
| P4 | Remove custom backgrounds that interfere with the material | Navbar and modal controls lose their ad-hoc fills. |
| P5 | Keep legibility when content scrolls beneath controls (scroll edge effect) | Replace the `scrollY > 50` background toggle with an edge fade under the navbar. |
| P6 | Be judicious with colour in controls; let content show through | Brand colour only on one prominent CTA. |
| P7 | Concentric rounded shapes that match their containers | One radius scale; inner radius = outer radius minus padding. |
| P8 | Test with Reduce Transparency / Reduce Motion; the material must adapt | Required fallbacks in section 6. |
| P9 | Group glass effects for performance and fluid morphing (`GlassEffectContainer`) | Cap concurrent blur surfaces; morph shared shapes instead of cross-fading. |
| P10 | Clear navigation hierarchy, separate from content | Nav order matches page order; active-section indicator. |

I did not retrieve the HIG "Materials" page, so I am not claiming specifics about Apple's regular-versus-clear variant rules. Read that page before Phase 1 and adjust the tier definitions in section 5.

## 2. Current UI/UX audit

Method: read all 2,134 lines of `src/`, ran the site, and viewed dark/light at 1440px and 390px. Contrast ratios marked "calc" are my own calculations. The white-on-lavender value uses the browser's computed colour.

### 2.1 What works

- Clear single-page narrative: hero, about, projects, experience, testimonials, FAQ, contact.
- A consistent colour system (`@theme` tokens in [index.css](src/index.css)) with working dark and light themes and system-preference default.
- Good content: concrete project descriptions, real links, working contact form with success and error states.
- Responsive without horizontal overflow at 390px (measured: no overflow).
- Reasonable semantics: `<main>`, `<section id>`, `<details>` for FAQ, labelled form fields.

### 2.2 The core design problem (why it doesn't read as glass)

- **`.glass` is applied to nearly everything** (cards, badges, pills, form panels, FAQ, timeline, testimonial, footer icons, modal buttons). That violates P1/P2 and flattens hierarchy: nothing is "above" anything.
- **Glass has nothing to refract.** In dark mode the page is a uniform near-black void, so `backdrop-filter: blur(16px)` is invisible: cards look like flat dark boxes. In light mode the glass is a flat blue-grey fill. Glass needs colourful, varied content behind it.
- **The glass recipe is only blur + 50% fill + border** ([index.css:102-112](src/index.css#L102-L112)). No specular rim, no saturation boost, no depth shadow, no adaptive tint.
- **~200 animated dots** (50 in the hero and 30 in each of five other sections, via [BackgroundDots.jsx](src/components/BackgroundDots.jsx)) are decorative noise, cost performance, and give glass nothing meaningful to sit on.

### 2.3 Verified defects

| Sev | Finding | Where | Fix |
|---|---|---|---|
| 🔴 | **Light-mode accent text is invisible.** The italic serif accent uses `text-white`. The light-mode override lives in `@layer base`, so Tailwind utilities beat it. Measured computed colour `rgb(255,255,255)` on `rgb(216,216,232)`, about **1.4:1**. Affects every section heading. | [Hero:87](src/sections/Hero.jsx#L87), [About:44](src/sections/About.jsx#L44), [Projects:243](src/sections/Projects.jsx#L243), [Experience:70](src/sections/Experience.jsx#L70), [Testimonials:70](src/sections/Testimonials.jsx#L70), [Contact:97](src/sections/Contact.jsx#L97), [index.css:79](src/index.css#L79) | Use `text-foreground`; delete the override |
| 🔴 | **Phone link is broken**: `href=":+639524754587"` (missing `tel`) | [Contact:18](src/sections/Contact.jsx#L18) | `tel:+639524754587` |
| 🔴 | Navbar background depends on a scroll event. After a reload mid-page the header stays transparent over body text (observed: nav pill collided with paragraph text). | [Navbar:20-28](src/layout/Navbar.jsx#L20-L28) | Initialise from `window.scrollY`, or replace with the edge-fade approach |
| 🟡 | Small brand-colour text (eyebrow labels, tags) is below 4.5:1: about **3.8:1** on dark, about **3.5:1** on light (calc). Passes only for large text. | `text-secondary-foreground` uses in all section headers | Lighter or darker brand token for small text |
| 🟡 | **No `prefers-reduced-motion`** handling anywhere: drifting dots, marquees, floats, pulses, ping. | [index.css](src/index.css) | Section 6 |
| 🟡 | Invalid or typo'd Tailwind classes silently do nothing: `animate-dfade-in`, `bg-0primary/10`, `bborder-primary/30`, `focus:primary` (×3, so **inputs have no visible focus ring**), `group:hover:text-primary`, `bg-surface-2`, `tracking-light` | [Hero:73](src/sections/Hero.jsx#L73), [About:88](src/sections/About.jsx#L88), [Experience:108](src/sections/Experience.jsx#L108), [Contact:124](src/sections/Contact.jsx#L124), [Projects:302](src/sections/Projects.jsx#L302), [ProjectModal:254](src/components/ProjectModal.jsx#L254), [Navbar:32](src/layout/Navbar.jsx#L32) | Fix each |
| 🟡 | Stale teal from the old palette: `rgba(32,178,166,…)` and `#26c4b8` | [Experience:83](src/sections/Experience.jsx#L83), [index.css:241](src/index.css#L241) | Use `--color-primary` |
| 🟡 | Project card is a `div role=button` containing real links (nested interactive), handles Enter but not Space. Tags look clickable (`hover:cursor-pointer`) but do nothing. | [Projects:256-264](src/sections/Projects.jsx#L256-L264), [Projects:319-322](src/sections/Projects.jsx#L319-L322) | Make the title the button; links outside it; drop the hover affordance on tags |
| 🟡 | Modal: no focus trap, no focus return, no initial focus. Carousel arrows are always visible and unlabeled-on-hover only. | [ProjectModal.jsx](src/components/ProjectModal.jsx) | Focus management; native `<dialog>` is the least code |
| 🟡 | Icon-only controls lack accessible names: mobile menu button (no `aria-label`/`aria-expanded`), testimonial prev/next and dots | [Navbar:59](src/layout/Navbar.jsx#L59), [Testimonials:105-123](src/sections/Testimonials.jsx#L105-L123) | Add labels |
| 🟢 | `<a><button>` nesting (invalid) for both hero CTAs | [Hero:103-114](src/sections/Hero.jsx#L103-L114) | Render the button component as an anchor |
| 🟢 | Nav order (About, Experience, Projects) differs from page order (About, Projects, Experience); Testimonials is in the footer but not the nav | [Navbar:5-11](src/layout/Navbar.jsx#L5-L11), [App.jsx:19-25](src/App.jsx#L19-L25) | Match page order (P10) |
| 🟢 | Skill marquees repeat content with no `aria-hidden`; icons are 15 third-party CDN requests | [Hero:175-199](src/sections/Hero.jsx#L175-L199) | `aria-hidden` on the duplicates; self-host later |
| 🟢 | Hero H1 wraps with an orphan ("apps") at 1440px; hero repeats the name twice (badge and paragraph) | [Hero:74-95](src/sections/Hero.jsx#L74-L95) | Shorter copy, `text-balance` |

### 2.4 Content note (your call, not a design change)

All four testimonials use stock Unsplash photos, and two are "Anonymous". Visitors may read this as unverified. Real names or initials-only avatars would build more trust than stock faces. I haven't changed any content.

## 3. Redesign concept: three layers

```
L2  GLASS    navbar · theme toggle · hero badges · CTA buttons · filter/pills ·
             modal controls · mobile menu     (small, functional, floating)
L1  CONTENT  cards · forms · timeline · FAQ · testimonial   (matte, opaque-ish)
L0  BACKDROP ambient colour field + hero imagery            (gives glass something to refract)
```

- **L0** replaces the 200 dots with 2–3 large, slow, blurred colour orbs (single elements, `transform`-only animation) plus the existing hero photo. Dark and light each get a palette with enough hue variation for glass to pick up.
- **L1** content surfaces become matte: solid token fill, 1px hairline, soft shadow, **no `backdrop-filter`**. This is the single biggest change toward P1/P2.
- **L2** is the only place the material appears.

### Glass inventory (the whole list, on purpose)

| Element | Tier | Notes |
|---|---|---|
| Navbar capsule (links + theme toggle) | regular | Floating, inset from edges; tone adapts to the section behind it |
| Mobile: floating bottom dock for section nav | regular | Minimises on scroll down, expands on scroll up (Apple's tab-bar-minimise behaviour, P10) |
| Hero floating badges ("Available", "3+ yrs") | clear | Over the photo, so they stay light |
| Primary CTA ("Let's Talk") | prominent (brand-tinted) | The only brand-coloured glass (P6) |
| Secondary CTA, social icon buttons | regular | |
| Project modal: close, arrows, counter, fullscreen | clear | Floating over the media |
| Mobile menu sheet | regular | Replaces the opaque dropdown |
| Contact form status message | none | Matte; it's content |

Everything else is L1.

## 4. Design tokens

Add to the `@theme` block in [index.css](src/index.css). Names are suggestions; values need tuning in the browser.

```css
/* radius scale (P7: inner = outer − padding) */
--radius-card: 1.75rem;   --radius-control: 999px;   --radius-chip: 0.75rem;

/* glass */
--glass-blur: 18px;       --glass-saturate: 170%;
--glass-fill: 14%;        /* opacity of tint over backdrop */
--glass-tint: #ffffff;    /* dark theme; light theme uses a darker tint */
--glass-rim: rgb(255 255 255 / 0.45);      /* top specular edge */
--glass-rim-low: rgb(0 0 0 / 0.12);        /* bottom edge */
--glass-shadow: 0 10px 30px rgb(0 0 0 / 0.22);

/* matte content surfaces (L1) */
--surface-1: …;  --surface-2: …;  --hairline: …;
```

Light mode gets its own values for every token above. Don't reuse the dark ones.

## 5. The glass primitive (approximation, my own recipe)

One utility, three tiers, defined in `@layer components` (replacing `.glass` and `.glass-strong`):

```css
.glass {
  background: color-mix(in srgb, var(--glass-tint) var(--glass-fill), transparent);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  box-shadow:
    inset 0 1px 0 var(--glass-rim),        /* specular top edge */
    inset 0 -1px 0 var(--glass-rim-low),   /* lower edge */
    var(--glass-shadow);
}
.glass-clear     { --glass-fill: 6%;  --glass-blur: 10px; }
.glass-prominent { --glass-tint: var(--color-primary); --glass-fill: 55%; }
```

Enhancements, in order of cost; stop wherever it looks right:

1. **Pointer-lit specular**: a `::before` radial gradient positioned by `--mx/--my` set on `pointermove` (a few lines of JS, only on hover-capable devices).
2. **Adaptive tone**: an `IntersectionObserver` sets `data-tone="light|dark"` on the navbar based on the section behind it, flipping tint and text colour. This mimics Apple's "adapts to what's behind it".
3. **Refraction** with an SVG `feDisplacementMap` used as `backdrop-filter: url(#…)`. I believe this only works in Chromium, so it must be progressive enhancement behind `@supports`, with plain blur everywhere else. **Verify support before relying on it.** It is optional and should be the last thing built.

**Pitfalls to design around:**
- A child with `backdrop-filter` inside a parent that has `backdrop-filter`, `filter` or `opacity < 1` only sees the parent's pixels, not the page. Another reason (with P3) to **never nest glass**.
- Never animate `blur()` radius; animate `transform`/`opacity` only.
- **Budget: at most about 4–5 blur surfaces visible at once.** The navbar, dock, two hero badges and CTAs already come close.

## 6. Accessibility and fallbacks (P8, required)

| Condition | Behaviour |
|---|---|
| No `backdrop-filter` support | `@supports not (backdrop-filter: blur(1px))`: solid `--surface-2` fill |
| `prefers-reduced-transparency: reduce` | Opaque fill, no blur. Browser support for this query varies, so **verify**; also cover with the contrast query below |
| `prefers-contrast: more` | Opaque fill + 2px solid border, no rim effects |
| `prefers-reduced-motion: reduce` | No orb drift, marquee paused, no morphing, no float/pulse/ping; fade only |
| Text on glass | Every text/glass pair ≥ 4.5:1 against the *worst* backdrop it can sit on. Test over bright and dark hero regions. |
| Focus | Visible 2px ring on every control, including on glass (fixes the missing input rings) |
| Targets | Controls ≥ 44×44 px on touch |

## 7. Section-by-section changes

| Section | Change |
|---|---|
| **Navbar** ([Navbar.jsx](src/layout/Navbar.jsx)) | Floating capsule, inset from the top edge. Links reordered to page order; add Testimonials. Scrollspy indicator: a glass "lens" that slides under the active link (P10). Edge-fade under the bar replaces the scroll toggle (P5). Theme toggle lives inside the capsule. Mobile: bottom dock + sheet, with proper `aria-label`/`aria-expanded`. |
| **Hero** ([Hero.jsx](src/sections/Hero.jsx)) | Dedupe the name; shorter paragraph; `text-balance` headline. Keep the photo (it is the best backdrop on the site). Badges become clear glass; "Let's Talk" becomes prominent glass; resume becomes regular glass. Marquees stay but `aria-hidden` and pause on reduced motion. |
| **About** ([About.jsx](src/sections/About.jsx)) | Highlight cards and the two callouts become matte L1. Fix the icon tile class. Pull-quote loses its glow border. |
| **Projects** ([Projects.jsx](src/sections/Projects.jsx)) | Matte cards with image-first layout. Title is the single button; link icons sit outside it. Tags become static chips. |
| **Project modal** ([ProjectModal.jsx](src/components/ProjectModal.jsx)) | Native `<dialog>` for focus handling. Panel is matte; **controls are clear glass floating over the media**. Optional: View Transitions API to morph the card image into the modal (progressive enhancement; verify support). |
| **Experience** ([Experience.jsx](src/sections/Experience.jsx)) | Matte cards; fix the teal glow and `bborder`. Timeline line uses brand token. |
| **Testimonials** ([Testimonials.jsx](src/sections/Testimonials.jsx)) | One matte card; prev/next become regular glass with `aria-label`s; dots get labels. |
| **FAQ** ([FAQ.jsx](src/sections/FAQ.jsx)) | Matte `<details>`; smooth open via `interpolate-size` or a simple grid-rows trick (verify support). |
| **Contact** ([Contact.jsx](src/sections/Contact.jsx)) | Fix `tel:` and focus rings; matte form panel; the submit button is prominent glass. |
| **Footer** ([Footer.jsx](src/layout/Footer.jsx)) | Matte; social icons are plain buttons, not glass. |
| **Global** ([index.css](src/index.css)) | Replace `.glass`/`.glass-strong`; delete the `.text-white` override and stale teal; add tokens and fallbacks. Delete `BackgroundDots` and replace it with the orb backdrop. |

## 8. Phased roadmap

Each phase is independently shippable and leaves the site working.

| Phase | Scope | Size | Done when |
|---|---|---|---|
| **0. Fix what's broken** | Everything in 2.3 (typos, `tel:`, contrast, labels, focus rings, `<a><button>`, stale teal). No visual redesign. | S | Lighthouse a11y has no new failures; light-mode headings ≥ 4.5:1 |
| **1. Foundation** | Tokens, radius scale, matte surface utilities, the `.glass` primitive with tiers and all section-6 fallbacks. Not yet applied broadly. | S–M | A test page shows 3 tiers in light and dark + all 4 fallback modes |
| **2. Backdrop** | Remove `BackgroundDots`; add the orb layer; tune palettes. | S | About 200 animated nodes → 3; glass visibly picks up colour in both themes |
| **3. Navigation** | Navbar capsule, scrollspy lens, edge fade, mobile dock/sheet. | M | Works after reload mid-page; keyboard and screen-reader pass |
| **4. Content to matte** | Convert every L1 surface; reduce `.glass` usage to the inventory in section 3. | M | `.glass` appears only on listed elements |
| **5. Controls and modal** | Buttons, hero badges, modal on `<dialog>` with clear-glass controls. | M | Focus is trapped and restored; Esc closes |
| **6. Polish (optional)** | Pointer-lit specular, adaptive tone, refraction, View Transitions. | M | Each guarded by `@supports`, each removable |

Order matters: **0 → 1 → 2 → 3** gets the visible redesign; 4–6 refine it. Phase 0 is valuable even if you never do the rest.

## 9. What this plan deliberately does not do

- No WebGL/Three.js shaders, no animation library, **no new dependencies**. Everything is CSS plus a few lines of JS.
- No copy rewrite beyond trimming duplicate hero text.
- No migration to the Next.js rebuild described in [portfolio-improvement-plan.md](portfolio-improvement-plan.md). This plan is compatible with it, because it is tokens plus CSS.
- No claim of visual parity with Apple's renderer.

## 10. Verification plan

- `pnpm lint`, `pnpm build` after every phase.
- Lighthouse accessibility audit before and after Phase 0 and after Phase 5.
- Contrast check of every text/glass pair over the brightest and darkest backdrop region, in both themes.
- Emulate `prefers-reduced-motion`, `prefers-contrast: more`, and (where supported) `prefers-reduced-transparency`. Also test with `backdrop-filter` disabled.
- Browsers: Chrome, Safari, Firefox; one low-end Android device for scroll FPS with the glass on.
- Keyboard-only pass: nav, project open/close, carousel, form, FAQ.
- Visual check at 390, 768, 1440 px in dark and light.

## 11. Defaults I chose (change any of them)

1. **Keep both themes.** Glass works in both, but light needs its own tuned tokens.
2. **Keep the brand colour and fonts** (#5966cc, Google Sans Flex + Georgia italic accent). Liquid Glass is a material, not a palette.
3. **Mobile gets a bottom dock** instead of a hamburger. This is the largest UX change; the fallback is a top capsule plus sheet.
4. **Drop the drifting dots entirely.**

## 12. Risks

- Fidelity: the CSS approximation will not match Apple's material, and refraction is likely Chromium-only.
- Performance: `backdrop-filter` is expensive on low-end phones. The surface budget and the fallbacks are the mitigation; test on a real device.
- Contrast: translucent surfaces make text contrast depend on what's behind them. Phase 1 and 4 checks are mandatory, not optional.
- Browser support for `prefers-reduced-transparency`, `interpolate-size`, `<dialog>` styling details and View Transitions should be verified at implementation time.
