# Fung.es - Modern React Refactor

A modern React 19 + TypeScript + Vite refactor of the legacy Fung.es HTML/CSS/JS project, preserving all key functionalities for foraging enthusiasts.

## 🍄 Features

- **Interactive Foraging Map** - Real-time data overlays with GeoJSON polygons
- **AI Identification** - Drag & drop image upload with TensorFlow Lite models
- **Species Database** - 20+ species profiles with scientific names and safety notes
- **Recipe Collection** - Filterable recipes with step-by-step instructions
- **PWA Support** - Offline functionality with service worker
- **Internationalization** - English and Italian language support
- **Dark Mode** - Theme switching with system preference detection
- **Mobile Responsive** - Touch-friendly interface with gestures

## 🚀 Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Fast build tool and dev server
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **Lucide React** - Modern icon library
- **i18next** - Internationalization
- **Mapbox GL JS** - Interactive maps
- **Motion** - Smooth animations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/funges-fork.git
   cd funges-fork
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier
- `npm run test` - Run Vitest tests
- `npm run storybook` - Start Storybook
- `npm run deploy` - Deploy to GitHub Pages

### Using Makefile

The project includes a comprehensive Makefile for common tasks:

```bash
make dev          # Start development server
make build        # Build for production
make lint         # Run linting
make format       # Format code
make test         # Run tests
make storybook    # Start Storybook
make deploy       # Deploy to GitHub Pages
make docker-build # Build Docker image
```

## 🌐 Deployment

### GitHub Pages

The project is configured for GitHub Pages deployment:

1. **Build and deploy**
   ```bash
   make deploy
   ```
   
   Or manually:
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

2. **Configure GitHub Pages**
   - Go to your repository Settings
   - Navigate to Pages section
   - Set source to "Deploy from a branch"
   - Select `gh-pages` branch
   - Set folder to `/ (root)`

The app will be available at: `https://your-username.github.io/funges-fork/`

### Docker Deployment

1. **Build Docker image**
   ```bash
   make docker-build
   ```

2. **Run container**
   ```bash
   make docker-run
   ```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── routes/             # TanStack Router routes
├── store/              # Zustand stores
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization
│   └── locales/        # Translation files
├── data/               # Static data (species, recipes)
├── styles/             # Global styles and design tokens
└── types/              # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables

- `VITE_MAPBOX_ACCESS_TOKEN` - Mapbox API token for maps
- `VITE_API_BASE_URL` - API base URL (optional)

### Build Configuration

The project uses Vite with the following key configurations:

- **Base path**: `/funges-fork/` (for GitHub Pages)
- **TypeScript**: Strict mode enabled
- **TailwindCSS**: Custom theme with design tokens
- **SCSS**: Support for component-specific styles

## 🧪 Testing

The project uses Vitest for testing:

```bash
npm run test          # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## 📚 Storybook

View and develop components in isolation:

```bash
npm run storybook
```

## 🌍 Internationalization

The app supports English and Italian languages:

- Translation files: `src/i18n/locales/`
- Language switching via UI
- Automatic language detection

## 🎨 Theming

- **Light/Dark mode** with system preference detection
- **Custom design tokens** in `src/styles/design-tokens.ts`
- **TailwindCSS** with custom theme configuration

## 📱 PWA Features

- **Service worker** for offline functionality
- **App manifest** for mobile home screen installation
- **Caching strategies** for optimal performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original Fung.es project for the concept and data
- TanStack for excellent React tools
- shadcn/ui for beautiful components
- Mapbox for mapping services

---

**⚠️ Safety Notice**: This app is for educational purposes. Always consult with experts before consuming any wild edibles. The authors are not responsible for any adverse effects from foraging activities.
