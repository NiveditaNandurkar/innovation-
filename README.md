# 🕷️ INNOVENTA — Event & Certificate Management Prototype

A polished, Spider-Man-inspired **Event & Certificate Management** web prototype built for the
**INNOVENTA Technical Recruitment — Round 1**. CSS painted with a midnight-navy glassmorphism
identity, bold red accents, electric blue highlights, subtle web-line details, and spring-based
Framer Motion transitions.

> The app focuses **only** on the challenge scope: event discovery, registration, certificate
> verification, saved certificates, and a small local assistant. It is **not** a full organization
> website. All data is dummy; everything is stored on-device (React state + `localStorage`). No
> backend, no database, no authentication.

---

## ✨ Features Implemented

- **Event Listing** — Dummy INNOVENTA events with name, date, type, description, status, and a
  *View Details* button. Live search by name/description/organizer plus category filters
  (*All / Hackathon / Workshop / Competition / Seminar*) with a **"No events found"** empty state.
- **Premium Glass Event Carousel** — Framer Motion horizontal sliding showcase of featured events
  with previous/next controls, pagination dots, touch/swipe drag, arrow-key support, auto-advance
  (paused on hover, focus, or drag), a clearly emphasized active card, and subtle animated
  spider-sense background lines. Disabled under `prefers-reduced-motion`.
- **Event Details** — Animated glass panel (centered modal on desktop, slide-in drawer on mobile)
  with name, date, time, venue, type, full description, organizer, status, tags, and a
  **Register** button. Closable via close button, `Escape`, or backdrop click; body scroll is
  locked and the user's scroll position is preserved.
- **Event Registration** — Validated form (Full Name, Email, College, Phone Number, Event) with
  clear inline error messages, no browser alerts. On success: prominent confirmation screen
  showing the selected event, a toast notification, and the registration persisted to
  `localStorage`.
- **Certificate Portal** — Enter Certificate ID → **Search** (loading state *"Searching
  certificate…"*) → validate → display. Handles **valid** (name, event, date, ID, *Certificate
  Verified ✓*), **invalid** (*Certificate Not Found*), and **empty input** (*Please enter a
  Certificate ID.*) states.
- **Certificate Download** — Working **Download Certificate** button that saves a generated
  certificate **SVG image** (no dynamic PDF generation) with toast feedback.
- **Verify Another Certificate** — Resets the search flow cleanly and reuses the same validation
  states.
- **My Certificates** — Persisted in `localStorage`; lists participant, event, date, and ID with
  **View / Download / Remove** actions, duplicate prevention on add, removal feedback toasts, and a
  friendly empty state.
- **Miles · INNOVENTA Assistant** — A compact floating Spider-Man-inspired chatbot (fixed gold
  spider emblem button) with a glass panel, suggested-question chips, typing indicator, local
  intent-based answers, accessible labels, keyboard support, and close/minimize control. No
  external API.
- **Dark / Light Mode** — Dark is the default signature experience; a polished light mode is
  available. The choice is saved in `localStorage` and applied to pages, modals, forms, carousel,
  chatbot, toasts, and certificate views.
- **Navigation & Responsive** — Fixed glass navbar for *Events*, *Certificate Portal*, and *My
  Certificates*; hamburger menu on mobile. Layouts adapt across desktop, tablet, and mobile with no
  horizontal overflow and touch-friendly controls.
- **States & Accessibility** — In-app loading/empty/error/404 states (no browser alerts), custom
  404 route with a *Back to Events* button, focus traps and `Escape` handling in modals, `aria`
  labels throughout, visible focus rings, and `prefers-reduced-motion` support.

---

## 🛠️ Technology Stack

| Layer     | Choice                                             |
| --------- | -------------------------------------------------- |
| Framework | [React 19](https://react.dev) (Vite 8 + TypeScript) |
| Language  | TypeScript                                          |
| Styling   | Hand-written CSS (CSS variables + glassmorphism design tokens) |
| Motion    | [Framer Motion](https://www.framer.com/motion/)     |
| Routing   | React Router (HashRouter)                            |
| Persistence | `localStorage` (theme, registrations, saved certificates) |
| Linting   | Oxlint                                              |

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18+** (developed on Node 22)
- npm **9+**

### Local setup

```bash
# 1. Clone or unzip the project, then install dependencies
npm install

# 2. Start the development server (http://localhost:5173)
npm run dev
```

### Build & preview

```bash
npm run build       # type-check + production build into /dist
npm run preview     # serve the production build locally
npm run lint        # run Oxlint
```

---

## ☁️ Deployment

The app is a fully static frontend — deploy the `dist/` folder to any static host.

<details>
<summary><b>Netlify (quickest)</b></summary>

```bash
npm run build
# Drag-and-drop the dist/ folder at https://app.netlify.com/drop
# or use the CLI:
npm i -g netlify-cli
netlify deploy --dir=dist --prod
```

</details>

<details>
<summary><b>Vercel</b></summary>

```bash
npm i -g vercel
npm run build
vercel --prod
```

</details>

<details>
<summary><b>GitHub Pages</b></summary>

Hash-based routing is used, so no server rewrite rules are needed.

```bash
npm run build
npm i -g gh-pages
npx gh-pages -d dist
```

</details>

### 🔗 Live deployment link

```
< Y O U R - L I V E - U R L - H E R E >
```

---

## 📸 Screenshots

_Add screenshots of the Events page, carousel, certificate result, My Certificates, and the
chatbot._

```
screenshots/
├── home-events.png
├── carousel.png
├── certificate-verified.png
├── my-certificates.png
└── chatbot.png
```

---

## 🧪 Dummy Certificate IDs for Testing

These certificate IDs validate successfully in the Certificate Portal:

| Certificate ID       | Participant  | Event                             | Event Date |
| -------------------- | ------------ | --------------------------------- | ---------- |
| `INNOVENTA-2026-001` | Aarav Mehta  | Web3 Innovators Hackathon         | 2026-11-28 |
| `INNOVENTA-2026-002` | Priya Sharma | CodeQuest Programming Championship | 2026-12-05 |
| `INNOVENTA-2026-003` | Rahul Verma  | Cyber Shield Security Seminar     | 2026-12-07 |
| `INNOVENTA-2026-004` | Sneha Iyer   | UI/UX Design Sprint Workshop      | 2026-11-30 |
| `INNOVENTA-2026-005` | Kabir Nair   | Future of AI Tech Talk            | 2026-12-02 |

> Anything else — for example `INNOVENTA-2026-999` — will show the **Certificate Not Found** state.

---

## 🤖 AI Tools Used

- **Anthropic Claude / opencode** — project scaffold, architecture, component implementation, and
  design-token/CSS generation.
- Standard tooling (Vite, TypeScript, Oxlint) used for verification.

---

## ⚠️ Assumptions & Limitations

- **Frontend only**: all data is mocked and hardcoded (`src/data/`). No backend, database, auth, or
  API calls.
- **Persistence** is browser-side via `localStorage` (theme, registrations, saved certificates).
  Clearing browser storage resets the app; data won't sync across devices.
- **Certificate download** exports a generated **SVG image** of the certificate. A downloadable PDF
  is intentionally out of scope ("no dynamic PDF generation").
- **Chatbot** uses local keyword matching over predefined intents. It is not an LLM and has no
  internet access; unknown questions get a friendly fallback answer.
- **Copyright-safe visuals**: all Spider-Man-inspired artwork (webs, emblem, palette) is original
  vector art — no movie stills or unofficial image assets are used.
- Google Fonts (`Rajdhani`, `Inter`) load from the web with graceful `system-ui` fallback if offline.
- The carousel shows the first **featured** events (`featured: true`); auto-advance respects
  `prefers-reduced-motion` and pauses on hover/focus/drag.

---

## 📁 Project Structure

```
src/
├── components/         # UI primitives, carousel, cards, modals, chatbot, certificate views
├── pages/              # Home, Certificate Portal, My Certificates, 404
├── providers/          # Theme + Toast context providers
├── hooks/              # useLocalStorage, useSavedCertificates
├── data/               # events.ts, certificates.ts, chatbot.ts
├── utils/              # validation.ts, certificate.ts (SVG generation)
├── index.css           # Design tokens, glass system, dark/light themes, responsive rules
└── types.ts
```

Made with 🕸️ devotion for INNOVENTA.