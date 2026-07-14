# Portfolio Website — Comprehensive Replication Blueprint

> A complete architectural plan for rebuilding this single-page portfolio site with a different design language. Every section, component, data structure, feature, animation, and integration is documented below.

---

## Table of Contents

1. [Tech Stack & Tooling](#1-tech-stack--tooling)
2. [Project Scaffolding & Configuration](#2-project-scaffolding--configuration)
3. [Architecture Overview](#3-architecture-overview)
4. [Design System & Theming](#4-design-system--theming)
5. [Layout Components](#5-layout-components)
6. [Sections (Page Blocks)](#6-sections-page-blocks)
7. [Reusable UI Components](#7-reusable-ui-components)
9. [Third-Party Integrations](#9-third-party-integrations)
10. [SEO & Meta Configuration](#10-seo--meta-configuration)
11. [Static Assets & File Organization](#11-static-assets--file-organization)
12. [Deployment](#12-deployment)
13. [Data Schemas (All Content)](#13-data-schemas-all-content)
14. [Step-by-Step Recreation Checklist](#14-step-by-step-recreation-checklist)

---

## 1. Tech Stack & Tooling

| Layer               | Technology                                   | Version (approx) |
| ------------------- | -------------------------------------------- | ---------------- |
| **Framework**       | React                                        | 19.x             |
| **Build Tool**      | Vite (via rolldown-vite)                     | 7.x              |
| **Styling**         | Tailwind CSS (v4, Vite plugin)               | 4.x              |
| **Icons**           | lucide-react                                 | latest           |
| **Email Service**   | @emailjs/browser                             | 4.x              |
| **Package Manager** | pnpm                                         | any              |
| **Linting**         | ESLint + react-hooks + react-refresh plugins | 9.x              |
| **Font**            | Google Sans Flex (Google Fonts)              | —                |

### Key `package.json` Scripts

```
dev     → vite           (local dev server)
build   → vite build     (production build)
lint    → eslint .        (code linting)
preview → vite preview   (preview production build)
```

---

## 2. Project Scaffolding & Configuration

### Vite Config (`vite.config.js`)

- **Base path**: `./` (relative — good for static hosting)
- **Plugins**: `@vitejs/plugin-react`, `@tailwindcss/vite`
- **Path alias**: `@` → `./src` (allows `@/components/...` imports)

### ESLint Config (`eslint.config.js`)

- Ignores `dist/`
- Uses `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`
- Allows unused vars starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`)

### Entry Point (`index.html`)

- Single `<div id="root">` mount point
- Entry module: `/src/main.jsx`
- Google Fonts preconnect + stylesheet link
- Comprehensive SEO meta tags (see Section 10)
- JSON-LD structured data (Person + WebSite schema)
- Google Site Verification tag

---

## 3. Architecture Overview

```
src/
├── main.jsx              # ReactDOM.createRoot, StrictMode, CSS import
├── App.jsx               # Root component — assembles all sections
├── index.css             # Global styles, Tailwind config, theme tokens, animations
├── context/
│   └── ThemeContext.jsx   # Dark/Light mode provider (React Context + localStorage)
├── layout/
│   ├── Navbar.jsx         # Fixed top navigation with scroll detection
│   └── Footer.jsx         # Site footer with links & socials
├── sections/
│   ├── Hero.jsx           # Landing hero with profile image, CTA, skill marquees
│   ├── About.jsx          # Bio text + highlight cards grid
│   ├── Projects.jsx       # Project cards grid + modal viewer
│   ├── Experience.jsx     # Timeline of work history
│   ├── Testimonials.jsx   # Carousel of client quotes
│   └── Contact.jsx        # Contact form (EmailJS) + contact info cards
└── components/
    ├── Button.jsx             # Primary CTA button (rounded, glowing)
    ├── AnimatedBorderButton.jsx # SVG-animated border secondary button
    └── ProjectModal.jsx       # Full project detail modal with carousel + fullscreen
```

### Component Rendering Order in `App.jsx`

```jsx
<ThemeProvider>
  <div className="min-h-screen overflow-x-hidden">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
    </main>
    <Footer />
  </div>
</ThemeProvider>
```

---

## 4. Design System & Theming

### Color Palette

```
--bg:           #1c1b17   (warm off-black, main background)
--bg-darker:    #131210   (darker background)
--bg-surface:   #232218   (hover/surface color)
--cream:        #fdfff0   (primary text, buttons)
--cream-dim:    #e2e4d8   (secondary text)
--muted:        #b8baae   (body text)
--muted-dark:   #6a6860   (labels, metadata)
--violet:       #7c5cfc   (accent, used sparingly)
--border:       #2e2c26   (all borders)
```

### Aesthetic

- **Style**: Brutalist warm dark
- **Typography**: Onest 900 for headlines (uppercase, tight tracking), Manrope for body, monospace for labels
- **Grain texture**: Animated SVG noise on `body::before`
- **Layout rule**: Borders always on outer wrapper div, `.container` only handles content width/padding

```
Features:
- React Context wrapping the entire app
- Exposes: { isDarkMode: boolean, toggleTheme: () => void }
- Custom hook: useTheme()
- Toggles 'light' class on document.documentElement
- Persists choice to localStorage
- Reads system preference via matchMedia on first load
```

---

## 5. Layout Components

### 5.1 Navbar (`layout/Navbar.jsx`)

**Behavior:**

- Fixed position (`fixed top-0 left-0 right-0 z-50`)
- Scroll detection: on scroll > 50px, switches from transparent to `glass-strong` background with reduced padding
- Mobile responsive: hamburger menu on `md:` breakpoint

**Structure:**

- **Logo**: Text-based logo — "RG" with a colored dot (`.`) in primary color. Links to `#hero`
- **Desktop nav**: Pill-shaped glass container with smooth-scrolling anchor links
- **Theme toggle**: Sun/Moon icon button (desktop only)
- **Mobile menu**: Slide-down overlay with nav links + theme toggle text button

**Navigation Links:**

```
About (#about), Experience (#experience), Projects (#projects),
Testimonials (#testimonials), Contact (#contact)
```

### 5.2 Footer (`layout/Footer.jsx`)

**Structure (3-column on desktop, stacked on mobile):**

1. Logo + copyright with dynamic year
2. Quick links (About, Projects, Experience, Testimonials)
3. Social icons (GitHub, LinkedIn, Facebook) — glass-styled rounded buttons

---

## 6. Sections (Page Blocks)

Every section shares these common patterns:

- **Floating dots**: 30-50 randomly positioned, animated tiny circles (`slow-drift` keyframe) using the primary color
- **Background glows**: Blurred gradient circles (`bg-primary/5`, `bg-highlight/5`) positioned absolutely
- **Section headers**: Uppercase tracking-wider label + large bold heading with serif italic span + subtitle paragraph
- **Container**: `container mx-auto px-6` with `relative z-10` to layer above background effects
- **Staggered animations**: Elements use `animate-fade-in` with incremental `animation-delay-*` classes

---

### 6.1 Hero Section

**Layout**: Full viewport height (`min-h-screen`), 2-column grid on `lg:` screens

**Left Column:**

- Status badge: Glass pill showing name + role with pulsing dot
- Headline: Multi-line `h1` (4xl → 6xl responsive) with primary-colored accent word and serif italic phrase
- Description paragraph
- Two CTA buttons:
  - Primary "Contact Me" button (links to `#contact`)
  - "Download CV" animated border button (links to downloadable PDF)
- Social links row (GitHub, LinkedIn) with glass icon buttons

**Right Column:**

- Profile image in glass-bordered container with glow border
- Image switches between dark/light variants based on theme
- Floating "Available for work" badge (bottom-right, animated float)
- Stats badge showing years of experience (top-left, animated float)

**Bottom: Skill Marquees**

- Row 1: Text-based skill names scrolling left (`animate-marquee`, 30s linear infinite)
- Row 2: Skill icons from devicons CDN scrolling right (`animate-marquee-reverse`, 25s)
- Both rows use duplicated arrays for seamless infinite scrolling

**Scroll indicator**: Centered at bottom with "Scroll" text + bouncing chevron, linking to `#about`

**Skills List:**

```
JavaScript, TypeScript, React.js, Next.js, Node.js, CSS, HTML,
Tailwind CSS, Github, Figma, WordPress, PHP, MySQL, Laravel, Vite
```

**Skill Icons (from devicons CDN):**
Same skills as above, each with a corresponding SVG icon URL from `cdn.jsdelivr.net/gh/devicons/devicon`

---

### 6.2 About Section

**Layout**: 2-column grid on `lg:` screens

**Left Column:**

- Section label ("About Me")
- Heading with serif italic accent
- 3 paragraphs of bio text (background, specialization, hobbies)
- Inspirational quote in a glass card with glow border

**Right Column: Highlight Cards (2×2 grid on `sm:`)**

Each card has:

- Lucide icon in a colored container
- Title
- Description

**Highlight Data:**

| Icon                | Title                                      | Description                                                           |
| ------------------- | ------------------------------------------ | --------------------------------------------------------------------- |
| `Layout`            | Front-End Development                      | Designing and building intuitive, high-performance user interfaces... |
| `MonitorSmartphone` | Responsive & Mobile-First Design           | Creating mobile-first, responsive layouts...                          |
| `Server`            | API & Backend Integration                  | Integrating front-end applications with RESTful APIs...               |
| `ShieldCheck`       | Front-End Performance & Security Awareness | Applying best practices for performance optimization...               |

---

### 6.3 Projects Section

**Layout**: 3-column grid on `lg:`, 2-column on `md:`, single column on mobile

**Each Project Card:**

- Image with aspect-video ratio
- Hover overlay with live link + GitHub icon buttons
- Title + description + tech tag pills
- Entire card is clickable — opens `ProjectModal`

**Project Modal (on click):**

- Full-screen overlay portal (rendered via `createPortal` to `document.body`)
- Header bar with project title + close button
- Media carousel (images + optional video) with:
  - Thumbnail strip navigation
  - Prev/Next arrow controls
  - Keyboard arrow key support
  - Fullscreen mode (separate overlay, Escape to close)
- Description text
- Tech tags
- Live + Code link buttons

**Modal Features:**

- Locks body scroll when open (with scrollbar width compensation)
- Hides scrollbars via CSS class `.modal-hide-scrollbar`
- Escape key closes modal
- Click outside closes modal
- Theme-aware background (dark: `bg-black/50`, light: `bg-white/40`)

**Projects Data Structure:**

```js
{
  title: string,
  description: string,
  image: string,           // main thumbnail path
  video?: string,          // optional demo video path
  tags: string[],          // technology labels
  link: string,            // live URL (or "#" if none)
  github: string,          // GitHub URL (or "#" if none)
  moreImages: string[],    // additional screenshot paths for carousel
}
```

**Current Projects (8 total):**

1. **FLIQUEY Social** — Social networking platform (PHP, MySQL, Docker, Smarty)
2. **Applemax Stream** — Media streaming app (Laravel, MySQL, Bootstrap, Docker)
3. **FLIQUEY Landing Page** — Conversion-focused landing page (Bootstrap, PHP, JS)
4. **Professional Portfolio** — This portfolio site (React, Tailwind, EmailJS, Vite)
5. **Consbeez Call Center Services Website** — Company website (PHP, Bootstrap, PHPMailer, SEO)
6. **Image Converter** — Image format converter (React, Node.js, Express, Sharp)
7. **Follo - Job Application Tracker** — Job tracking app (Next.js 15, TypeScript, Supabase, Vercel)
8. **Grave Locator** — Geospatial graveyard app (React, Mapbox, Supabase, Google Gemini)

---

### 6.4 Experience Section

**Layout**: Vertical timeline with alternating left/right cards on `md:+` screens

**Timeline Visual:**

- Centered vertical line with gradient (`from-primary/70 via-primary/30 to-transparent`) and `timeline-glow`
- Dot on timeline for each item (3×3px primary circle with `ring-4 ring-background`)
- Current position dot has a `ping` animation

**Each Entry Card (glass container):**

- Period (date range)
- Role title
- Company name
- Description paragraph
- Tech tag pills (aligned to match card side)

**Alternation logic**: Even indices → right-aligned text with `pr-16`; odd indices → left column start-2 with `pl-16`

**Experience Data Structure:**

```js
{
  period: string,            // e.g. "2025 — Present"
  role: string,
  company: string,
  description: string,
  technologies: string[],
  current: boolean,          // triggers ping animation on timeline dot
}
```

**Current Entries (4):**

1. **2025 — Present**: Full-Stack Developer @ Fliquey Entertainment
2. **2024 — 2025**: Full-Stack Developer, Web Administrator @ Blaseek
3. **2023 — 2024**: Front-End and Database Designer/Developer @ Internship
4. **2022 — 2024**: Full-Stack Developer/Freelance @ Various Clients

---

### 6.5 Testimonials Section

**Layout**: Single centered carousel with navigation

**Carousel Container:**

- Large glass card with glow border
- Quote icon (primary-colored circle, positioned at `-top-4 left-8`)
- Quote text (xl → 2xl size)
- Author avatar (Unsplash placeholder images), name, and role
- Navigation: Prev/Next buttons + dot indicators
- Active dot extends width to `w-8` with primary background

**Testimonial Data Structure:**

```js
{
  quote: string,
  author: string,
  role: string,
  avatar: string,      // URL to avatar image
}
```

**Current Testimonials (4):**

1. April L. — Start-up Founder
2. Anonymous — Small Business Owner
3. Emily W. — Project Coordinator
4. Anonymous — HR Personnel

---

### 6.6 Contact Section

**Layout**: 2-column grid on `lg:` screens

**Left Column: Contact Form**

- Glass container with primary border
- Fields: Name (text), Email (email), Message (textarea) — all required
- Submit button (full-width primary button with Send icon)
- Loading state: "Sending..." text, button disabled
- Success/Error feedback banner with CheckCircle/AlertCircle icons

**Form submission flow:**

1. Prevent default
2. Set loading state
3. Read EmailJS credentials from environment variables:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
4. Send via `emailjs.send()` with `{ name, email, message }` template params
5. Show success/error, reset form on success

**Right Column: Contact Info + Availability**

**Contact Info Card:**

- Email: `rgmazon@gmail.com` (mailto link)
- Phone: `+639 3913 91685`
- Location: Calapan City, PH

Each item: icon container + label + value, wrapped in an anchor tag with hover effect

**Availability Card:**

- Green pulsing dot + "Currently Available" text
- Description about openness to opportunities

---

## 7. Reusable UI Components

### 7.1 Button (`components/Button.jsx`)

**Props:** `className`, `size` (`sm` | `default` | `lg`), `children`, ...rest

**Styling:**

- Rounded full (pill shape)
- Primary background with shadow (`shadow-lg shadow-primary/25`)
- Three size variants with different padding
- Focus ring for accessibility
- Content wrapped in flex span with gap

### 7.2 AnimatedBorderButton (`components/AnimatedBorderButton.jsx`)

**Props:** `children`

A secondary/outline button with an SVG-animated border:

- Transparent background with border
- On hover: border glows, background tints with primary
- Contains an SVG overlay that draws a rounded rect path
- The SVG path uses `stroke-dasharray` + `stroke-dashoffset` animation
- Animation only triggers on parent group hover (`group:hover .animated-border-path`)
- Uses `animated-border` CSS class for hover glow effect

### 7.3 ProjectModal (`components/ProjectModal.jsx`)

**Sub-component: Carousel**

- Combines `project.image` (main), `project.video` (optional), and `project.moreImages` into a single media array
- Crossfade between items via opacity transition
- Thumbnail strip below
- Fullscreen mode: separate portal overlay with black background
- Keyboard navigation (ArrowLeft/ArrowRight/Escape)

**Modal itself:**

- Portal-rendered to `document.body`
- Backdrop click to close
- Body scroll lock with scrollbar compensation
- Theme-aware styling
- Scrollable body with fixed header

---

## 8. Third-Party Integrations

### EmailJS

- **Purpose**: Send contact form submissions as emails without a backend
- **Setup**: Create account at emailjs.com, configure service + template
- **Environment Variables** (in `.env`):
  ```
  VITE_EMAILJS_SERVICE_ID=your_service_id
  VITE_EMAILJS_TEMPLATE_ID=your_template_id
  VITE_EMAILJS_PUBLIC_KEY=your_public_key
  ```
- **Template variables sent**: `name`, `email`, `message`

### Devicons CDN

- **Purpose**: Technology skill icons in the hero marquee
- **Base URL**: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/`
- All icons fetched at runtime (no local copies)

### Unsplash (Testimonial Avatars)

- Placeholder avatar images for testimonials
- Can be replaced with real client photos

### Google Fonts

- `Google Sans Flex` loaded via `<link>` in `index.html`
- Variable font with weight range 100-1000, optical size 8-144

---

## 9. SEO & Meta Configuration

### HTML Head Tags

```html
<title>RG Mazon Portfolio | Front-end Developer</title>
<meta name="description" content="Professional portfolio of RG Mazon..." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://rgmazon.pages.dev/" />
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
```

### Open Graph Tags

```
og:type        → website
og:url         → https://rgmazon.pages.dev/
og:title       → RG Mazon Portfolio | Front-end Developer
og:description → Dedicated Front-end Developer specializing in React...
og:image       → https://rgmazon.pages.dev/og-image.png
```

### Twitter Card Tags

```
twitter:card        → summary_large_image
twitter:url         → https://rgmazon.pages.dev/
twitter:title       → RG Mazon Portfolio | Front-end Developer
twitter:description → (same as og)
twitter:image       → https://rgmazon.pages.dev/og-image.png
```

### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "name": "RG Mazon",
      "url": "...",
      "jobTitle": "Front-end Developer",
      "description": "...",
      "knowsAbout": ["React.js", "JavaScript", "Tailwind CSS", ...],
      "sameAs": ["github.com/rgmazon", "linkedin.com/in/rgmazon"]
    },
    {
      "@type": "WebSite",
      "url": "...",
      "name": "RG Mazon Portfolio",
      "publisher": { "@type": "Person", "@id": "...#person" }
    }
  ]
}
```

### robots.txt

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://rgmazon.pages.dev/sitemap.xml
```

### sitemap.xml

Single URL entry pointing to the homepage with monthly change frequency and priority 1.0.

---

## 11. Static Assets & File Organization

```
public/
├── robots.txt
├── sitemap.xml
├── favicon.ico               (referenced)
├── og-image.png              (referenced)
├── assets/
│   ├── hero-image.jpg        (hero background)
│   ├── MazonRudolfh.pdf      (downloadable CV)
│   ├── profile-image-dark.avif
│   ├── profile-image-light.avif
│   └── projects/
│       ├── projectName/
│       │   ├── projectName.avif         (main thumbnail)
│       │   ├── projectName-1.avif       (carousel image 1)
│       │   ├── projectName-2.avif       (carousel image 2)
│       │   ├── projectName-3.avif       (carousel image 3)
│       │   └── projectName-video.webm   (optional demo video)
│       └── ...
```

**Image format**: AVIF for optimized compression (some newer projects use WebP)
**Video format**: WebM

---

## 12. Deployment

- **Platform**: Cloudflare Pages (`rgmazon.pages.dev`)
- **Build command**: `vite build` (outputs to `dist/`)
- **Google site verification**: HTML meta tag method
- **Environment variables**: Set in the hosting platform dashboard for EmailJS credentials

---

## 13. Data Schemas (All Content)

### Skills (Hero Marquee)

```js
const skills = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Node.js",
  "CSS",
  "HTML",
  "Tailwind CSS",
  "Github",
  "Figma",
  "WordPress",
  "PHP",
  "MySQL",
  "Laravel",
  "Vite",
];

const skillIcons = [
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  // ... one per skill
];
```

### About Highlights

```js
const highlights = [
  { icon: LucideComponent, title: string, description: string },
  // 4 items
];
```

### Projects

```js
const projects = [
  {
    title: string,
    description: string,
    image: string,
    video?: string,
    tags: string[],
    link: string,
    github: string,
    moreImages: string[],
  },
  // 8 items
];
```

### Experiences

```js
const experiences = [
  {
    period: string,
    role: string,
    company: string,
    description: string,
    technologies: string[],
    current: boolean,
  },
  // 4 items
];
```

### Testimonials

```js
const testimonials = [
  {
    quote: string,
    author: string,
    role: string,
    avatar: string,
  },
  // 4 items
];
```

### Contact Info

```js
const contactInfo = [
  { icon: LucideComponent, label: string, value: string, href: string },
  // 3 items: Email, Phone, Location
];
```

### Nav Links

```js
const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];
```

### Footer Social Links

```js
const socialLinks = [
  { icon: LucideComponent, href: string, label: string },
  // GitHub, LinkedIn, Facebook
];
```

---

## 14. Step-by-Step Recreation Checklist

### Phase 1: Scaffolding

- [ ] `pnpm create vite@latest my-portfolio -- --template react`
- [ ] Install dependencies: `pnpm add react react-dom tailwindcss @tailwindcss/vite lucide-react @emailjs/browser`
- [ ] Install dev dependencies: `pnpm add -D @vitejs/plugin-react eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals`
- [ ] Configure `vite.config.js` (base path, plugins, `@` alias)
- [ ] Configure `eslint.config.js`
- [ ] Set up folder structure: `src/{components,context,layout,sections,assets}`

### Phase 2: Design System

### Phase 3: Layout

- [ ] Build `Navbar.jsx` — fixed header, scroll detection, mobile menu, theme toggle
- [ ] Build `Footer.jsx` — logo, quick links, social icons

### Phase 4: Sections (build in order)

- [ ] **Hero**: Profile image, headline, CTAs, social links, skill marquees, scroll indicator
- [ ] **About**: Bio text, quote card, highlight cards grid
- [ ] **Projects**: Data array, card grid, hover overlays, `ProjectModal` with carousel
- [ ] **Experience**: Data array, alternating timeline layout
- [ ] **Testimonials**: Data array, carousel with navigation
- [ ] **Contact**: Form with EmailJS integration, contact info cards, availability badge

### Phase 5: Components

- [ ] `Button.jsx` — primary CTA with size variants
- [ ] `AnimatedBorderButton.jsx` — SVG border animation
- [ ] `ProjectModal.jsx` — carousel, fullscreen, portal, scroll lock

### Phase 6: Content & Assets

- [ ] Replace all personal data (name, bio, projects, experiences, testimonials, contact info)
- [ ] Add profile images (dark/light variants)
- [ ] Add project screenshots and demo videos
- [ ] Add CV/resume PDF
- [ ] Add hero background image
- [ ] Create OG image and favicon

### Phase 7: SEO & Meta

- [ ] Update `index.html` with your meta tags, canonical URL, OG/Twitter tags
- [ ] Create JSON-LD structured data with your info
- [ ] Create `robots.txt` and `sitemap.xml`
- [ ] Add Google Site Verification (if needed)

### Phase 8: Deployment

- [ ] Set up Cloudflare Pages (or preferred host)
- [ ] Configure environment variables for EmailJS
- [ ] Deploy and verify
- [ ] Submit sitemap to Google Search Console

---

_Generated from the rgmazon portfolio project structure. Replace all personal content, colors, fonts, and design decisions to create your own unique version._
