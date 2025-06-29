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
- [x] Define initial store structure (e.g. UI state, user, data cache)

## 5. Routing

- [x] Install and configure **TanStack Router**
- [x] Define routes based on original HTML pages
- [x] Migrate legacy navigation to `<Link>` components

## 6. Forms & Validation

- [x] Install and configure **React Hook Form**
- [x] Integrate **Zod** for schema-based validation
- [x] Refactor legacy forms to RHF components with validation

## 7. Data Fetching

- [x] Install and configure **TanStack Query**
- [x] Replace any fetch/axios code with TanStack Query hooks
- [x] Create API layer in `src/lib/api.ts` with query functions

## 8. UI Component Migration

- [x] Install **shadcn/ui** (based on Radix + Tailwind)
- [x] Use shadcn components for buttons, dialogs, inputs, etc.
- [x] Decompose existing HTML UI into composable React components
- [x] Ensure accessibility (labels, ARIA, keyboard support)

## 9. Animations

- [x] Install **motion.dev** (successor to Framer Motion)
- [x] Migrate any legacy animations (fade, slide, hover) to motion.dev
- [x] Create reusable animation presets if applicable

## 10. Icons

- [x] Install **Lucide Icons**
- [x] Replace legacy icons with `<Icon />` components from Lucide

## 11. Internationalization (i18n)

- [x] Install and configure **i18next** with `react-i18next`
- [x] Setup English and Italian locales
- [x] Extract all hardcoded text into translation files
- [x] Implement language switcher (e.g., flag or dropdown)

## 11.1. Add a .env file

- [x] Add a .env file to the project
- [x] Add all the env variables to the .env file
- [x] Configure the project to use the .env file

## 12. Maps

- [x] Install **Mapbox GL JS** and set up map component
- [x] Configure **Mapbox Access Token** via environment variable (`.env`)
- [x] Use **Mapbox tiles** with custom styling
- [x] Integrate **Mapbox Geocoding API** for address search/autocomplete
- [x] Add support for:

  - [x] Rendering **GeoJSON Polygons**
  - [x] User geolocation to show nearby foraging spots
  - [x] Address **autocomplete/search** with Mapbox geocoder

- [x] Style map and polygons according to project SCSS/Tailwind theme
- [x] Add map fallback or graceful error UI if API fails
- [x] Exctract the map functionality of the old project to the new one

## 13. Storybook

- [x] Create stories for each UI component (Buttons, Inputs, Forms, Cards, etc.)
- [x] Include variant examples (e.g., disabled, loading, with icon)
- [x] Include documentation with controls and props

## 14. Makefile Setup

- [x] Create a `Makefile` in the project root
- [x] Define common commands:

  - [x] `make dev` – start dev server
  - [x] `make build` – build app for production
  - [x] `make lint` – run ESLint
  - [x] `make format` – run Prettier format
  - [x] `make test` – run Vitest
  - [x] `make storybook` – start Storybook
  - [x] `make i18n-check` – validate translation files
  - [x] `make analyze` – run bundle analyzer if needed
  - [x] `make deploy` – build and push to GitHub Pages
  - [x] `make docker-build` – build Docker image of the frontend
  - [x] Add other commands to the Makefile

## 14.1. Export the old project into the new one

- [x] Export the old project into the new one

## 15. GitHub Pages Deployment

- [x] Set up project for **static site deployment** via GitHub Pages
- [x] Configure Vite `base` path to match the GitHub Pages repo name
- [x] Add deploy script (e.g. using `gh-pages` or manual push of `dist/`)
- [x] Document local build + deploy process in `README.md`

## 16. Dockerization

- [x] Create a lightweight **Dockerfile** to build and serve the Vite app

  - Multi-stage build: Node → static assets → nginx/alpine

- [x] Add `.dockerignore`
- [x] Add Docker image build command to Makefile: `make docker-build`
- [x] Document how to build and run the Docker container in `README.md`

## 17. Preserve Existing Fung.es Functionalities

### Map Features

- [x] Interactive foraging map with real-time data overlays
- [x] Polygon overlays for high-probability areas (GeoJSON)
- [x] User geolocation to show nearby foraging spots

### AI Identification

- [x] Drag & drop image upload
- [x] Real-time AI-based classification using 4 TensorFlow Lite models (check the old project for the models)
- [x] Display confidence scores + visual feedback

### Fix routes
- [ ] Take all the components defined in routes folder and extract them into a pages folder

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

## 19. Add pre-commit hooks and pre-push hooks

- [ ] Add pre-commit hooks and pre-push hooks to run linting, formatting, testing and there ar enot unused import or unused variables. Check also for absolute imports instead of relative imports.

## 21. Styling and standardization

- [ ] Add more than one standard scss to define all the colors, spacing, typography, etc.
- [ ] Exctract all the colors in hex to the standars scss file and use them in the project
