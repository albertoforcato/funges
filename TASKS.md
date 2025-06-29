Massive refactor of the legacy Fung.es HTML/CSS/JS project to a modern React 19 stack, preserving all key functionalities.

The old project is in the `old-project` folder.

PLEASE: Ask for clarification if any functionality or data structure is unclear

---

## 1. Project Setup

- [x] Initialize new project with **Vite**, using **React 19**, **TypeScript**, and **npm**
- [x] Configure `vite.config.ts` with Tailwind, Aliases, JSX transform
- [x] Setup folder structure:

  - `/src`

    - `/components`
    - `/routes`
    - `/store`
    - `/lib`
    - `/styles`
    - `/i18n`
    - `/hooks`
    - `/types`

## 2. Tooling & Dev Environment

- [x] Install and configure **ESLint** with `@typescript-eslint`, React, Tailwind plugins
- [x] Install and configure **Prettier** + integrate with ESLint
- [x] Install and configure **Vitest** for unit testing
- [x] Configure **Storybook 9** with TypeScript and Tailwind support
- [x] Setup **Why Did You Render** for dev performance debugging

## 3. Styling & Theme

- [x] Install and configure **TailwindCSS**
- [x] Extract design tokens (colors, spacing, typography) from legacy CSS
- [x] Create custom Tailwind theme (`tailwind.config.ts`) to match existing project styles
- [x] Migrate global styles (e.g., typography rules) to `src/styles/globals.scss`
- [x] Use **SCSS modules** for component-specific styles (e.g., `ComponentName.module.scss`)
- [x] Ensure SCSS build integration in Vite (add `sass` as a dev dependency)

## 4. State & Logic

- [x] Install and set up **Zustand** for global state management
- [ ] Define initial store structure (e.g. UI state, user, data cache)

## 5. Routing

- [ ] Install and configure **TanStack Router**
- [ ] Define routes based on original HTML pages
- [ ] Migrate legacy navigation to `<Link>` components

## 6. Forms & Validation

- [ ] Install and configure **React Hook Form**
- [ ] Integrate **Zod** for schema-based validation
- [ ] Refactor legacy forms to RHF components with validation

## 7. Data Fetching

- [ ] Install and configure **TanStack Query**
- [ ] Replace any fetch/axios code with TanStack Query hooks
- [ ] Create API layer in `src/lib/api.ts` with query functions

## 8. UI Component Migration

- [ ] Install **shadcn/ui** (based on Radix + Tailwind)
- [ ] Use shadcn components for buttons, dialogs, inputs, etc.
- [ ] Decompose existing HTML UI into composable React components
- [ ] Ensure accessibility (labels, ARIA, keyboard support)

## 9. Animations

- [ ] Install **motion.dev** (successor to Framer Motion)
- [ ] Migrate any legacy animations (fade, slide, hover) to motion.dev
- [ ] Create reusable animation presets if applicable

## 10. Icons

- [ ] Install **Lucide Icons**
- [ ] Replace legacy icons with `<Icon />` components from Lucide

## 11. Internationalization (i18n)

- [ ] Install and configure **i18next** with `react-i18next`
- [ ] Setup English and Italian locales
- [ ] Extract all hardcoded text into translation files
- [ ] Implement language switcher (e.g., flag or dropdown)

## 12. Maps

- [ ] Install **Mapbox GL JS** and set up map component
- [ ] Configure **Mapbox Access Token** via environment variable (`.env`)
- [ ] Use **Mapbox tiles** with custom styling
- [ ] Integrate **Mapbox Geocoding API** for address search/autocomplete
- [ ] Add support for:

  - [ ] Rendering **GeoJSON Polygons**
  - [ ] **Current user location** via Geolocation API
  - [ ] Address **autocomplete/search** with Mapbox geocoder

- [ ] Style map and polygons according to project SCSS/Tailwind theme
- [ ] Add map fallback or graceful error UI if API fails

## 13. Storybook

- [ ] Create stories for each UI component (Buttons, Inputs, Forms, Cards, etc.)
- [ ] Include variant examples (e.g., disabled, loading, with icon)
- [ ] Include documentation with controls and props

## 14. Makefile Setup

- [ ] Create a `Makefile` in the project root
- [ ] Define common commands:

  - [ ] `make dev` – start dev server
  - [ ] `make build` – build app for production
  - [ ] `make lint` – run ESLint
  - [ ] `make format` – run Prettier format
  - [ ] `make test` – run Vitest
  - [ ] `make storybook` – start Storybook
  - [ ] `make i18n-check` – validate translation files
  - [ ] `make analyze` – run bundle analyzer if needed
  - [ ] `make deploy` – build and push to GitHub Pages
  - [ ] `make docker-build` – build Docker image of the frontend

## 15. GitHub Pages Deployment

- [ ] Set up project for **static site deployment** via GitHub Pages
- [ ] Configure Vite `base` path to match the GitHub Pages repo name
- [ ] Add deploy script (e.g. using `gh-pages` or manual push of `dist/`)
- [ ] Document local build + deploy process in `README.md`

## 16. Dockerization

- [ ] Create a lightweight **Dockerfile** to build and serve the Vite app

  - Multi-stage build: Node → static assets → nginx/alpine

- [ ] Add `.dockerignore`
- [ ] Add Docker image build command to Makefile: `make docker-build`
- [ ] Document how to build and run the Docker container in `README.md`

## 17. Preserve Existing Fung.es Functionalities

### Map Features

- [ ] Interactive foraging map with real-time data overlays
- [ ] Polygon overlays for high-probability areas (GeoJSON)
- [ ] User geolocation to show nearby foraging spots
- [ ] Weather + soil data overlays for predictive foraging

### AI Identification

- [ ] Drag & drop image upload
- [ ] Real-time AI-based classification using 4 TensorFlow Lite models
- [ ] Display confidence scores + visual feedback

### Species Database

- [ ] Page with 20+ species profiles (mushrooms, plants, berries, etc.)
- [ ] Scientific names, foraging instructions, safety notes
- [ ] Cooking tips and preparation methods

### Recipe Collection

- [ ] Filterable recipe database by ingredient type
- [ ] Step-by-step instructions + warnings
- [ ] Suggest recipes based on identified ingredient

### PWA Features

- [ ] Setup Vite PWA plugin
- [ ] Add service worker for caching & offline support
- [ ] Add splash screen + mobile home screen support
- [ ] Ensure app functions fully offline

### UX & Accessibility

- [ ] Implement dark mode (based on existing icon state)
- [ ] Add mobile-friendly navigation + gestures
- [ ] Ensure keyboard and screen-reader support
- [ ] Add loading animations / feedback states

### Data-Driven Features

- [ ] Weather/soil APIs integration for real-time predictions
- [ ] Display seasonal forecasts based on region/species
- [ ] Use geospatial data to improve prediction accuracy

### Donation & Support

- [ ] Donation page with BTC, ETH, IOTA, Patreon support
- [ ] QR code integration for each payment option
- [ ] Static thank-you confirmation screen

### Misc Features

- [ ] Add SEO meta tags + structured data
- [ ] Add accessibility disclaimers for foraging risks
- [ ] Add educational articles about wild edibles

## 18. Final Cleanup & Review

- [ ] Remove legacy HTML/CSS/JS files
- [ ] Ensure ESLint + Prettier pass cleanly
- [ ] Check mobile responsiveness
- [ ] Create `README.md` with:

  - Stack overview
  - Project structure
  - Setup & usage instructions
  - Deployment and Docker instructions
