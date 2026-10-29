# Arango Website

Official web application for **Arango - Estruturas e Moldagens de Varão, Lda.**, specialized in reinforcing steel processing, cutting, bending, and assembly for civil engineering and public works based in the Madeira Free Trade Zone (Zona Franca Industrial da Madeira, Caniçal).

## Overview

This repository hosts the corporate website codebase, including the preview launch page with interactive bilingual messaging, milestone countdown, responsive photography showcase, and SEO infrastructure.

## Key Features

- **Bilingual Support (PT / EN):** Context-driven language switching (`LanguageContext`) managing dynamic content across Portuguese and English.
- **Milestone Countdown:** Live countdown component computing days, hours, minutes, and seconds until the official launch milestone.
- **Portfolio Showcase:** Automated background slideshow displaying landmark regional engineering projects, with optimized responsive WebP and JPEG imagery.
- **Client-Side Routing & Fault Tolerance:** Configured with React Router and a top-level `RouteErrorBoundary` to provide clean fallback handling.
- **SEO & Search Visibility:** Native metadata configurations, Open Graph tags, `robots.txt`, and XML sitemap (`sitemap.xml`) located in the public assets directory.

## Technology Stack

- **Core:** React 19 (`react`, `react-dom`)
- **Routing:** React Router 7 (`react-router-dom`)
- **Build Tool:** Vite 8 (`@vitejs/plugin-react`)
- **Styling:** Custom CSS with CSS variables and responsive design principles

## Repository Layout

```text
├── docs/                       # Project documentation and reference assets
│   ├── proposta-website-arango.pdf
│   └── referencias/            # Wireframes and reference imagery
├── public/                     # Static web assets served directly
│   ├── favicon.svg             # Brand favicon
│   ├── images/                 # Optimized project photography and branding
│   ├── robots.txt              # Search engine crawler instructions
│   └── sitemap.xml             # Search engine site index
├── src/                        # Application source code
│   ├── components/             # Reusable UI components
│   │   ├── Countdown.jsx       # Countdown clock component
│   │   ├── Footer.jsx          # Corporate footer with contact and legal info
│   │   ├── Header.jsx          # Header with branding and language toggle
│   │   └── Slideshow.jsx       # Background imagery rotator
│   ├── context/                # React context providers
│   │   └── LanguageContext.jsx # Language state and toggle logic
│   ├── data/                   # Static content and data definitions
│   │   ├── content.js          # Bilingual copy dictionary (PT / EN)
│   │   └── slides.js           # Slideshow metadata and image paths
│   ├── pages/                  # Page-level components
│   │   └── ComingSoon.jsx      # Launch page assembly
│   ├── App.css                 # Application-level layout styles
│   ├── App.jsx                 # Application root and route configuration
│   ├── index.css               # Global typography, reset, and design tokens
│   └── main.jsx                # Application DOM entrypoint
├── index.html                  # HTML entry template
├── package.json                # Project dependencies and operational scripts
└── vite.config.js              # Vite bundler configuration
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

Clone the repository and install the dependencies from the root directory:

```bash
git clone https://github.com/arangoadmin/arango.git
cd arango
npm install
```

### Development Server

Run the local Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`. The `--host` flag is enabled by default to allow local network access.

### Production Build

Compile and bundle the production artifacts:

```bash
npm run build
```

Production-ready files will be generated in the `dist/` directory.

### Preview Production Build

Serve the generated `dist/` directory locally to verify build behavior before deployment:

```bash
npm run preview
```

## Content Management

### Texts and Translations

All UI text strings are centralized in `src/data/content.js`. To update contact information, announcements, or translations, edit the corresponding keys under the `pt` and `en` objects.

### Photography and Portfolio

Slideshow images are stored in `public/images/` and referenced in `src/data/slides.js`. When adding new imagery, provide both WebP and fallback JPEG formats for maximum browser compatibility.

## Deployment

The output of `npm run build` is a standard static client-side bundle located in `dist/`. It can be deployed directly to any static web host, CDN, or server environment (e.g., Cloudflare Pages, Vercel, Netlify, AWS S3, or Apache/Nginx).
