# Instagram Reel Insights & Post UI Clone

A pixel-perfect clone of Instagram's Reel Post, Reel Insights (Overview, Audience Country, Audience Age), and Action Sheet screens built with **Angular 21** and **Tailwind CSS**.

---

## 📁 Standard Angular Component Architecture

Every component and page is split into its proper **HTML Template (`.html`)**, **CSS Stylesheet (`.css`)**, and **TypeScript Component (`.ts`)**:

```
frontend/src/app/
├── components/
│   ├── device-frame/
│   │   ├── device-frame.component.html
│   │   ├── device-frame.component.css
│   │   └── device-frame.component.ts
│   ├── ig-action-sheet/
│   │   ├── ig-action-sheet.component.html
│   │   ├── ig-action-sheet.component.css
│   │   └── ig-action-sheet.component.ts
│   ├── ig-android-nav/
│   │   ├── ig-android-nav.component.html
│   │   ├── ig-android-nav.component.css
│   │   └── ig-android-nav.component.ts
│   ├── ig-header/
│   │   ├── ig-header.component.html
│   │   ├── ig-header.component.css
│   │   └── ig-header.component.ts
│   ├── ig-icon/
│   │   ├── ig-icon.component.html
│   │   ├── ig-icon.component.css
│   │   └── ig-icon.component.ts
│   ├── ig-metric-card/
│   │   ├── ig-metric-card.component.html
│   │   ├── ig-metric-card.component.css
│   │   └── ig-metric-card.component.ts
│   ├── ig-pill-selector/
│   │   ├── ig-pill-selector.component.html
│   │   ├── ig-pill-selector.component.css
│   │   └── ig-pill-selector.component.ts
│   ├── ig-progress-bar/
│   │   ├── ig-progress-bar.component.html
│   │   ├── ig-progress-bar.component.css
│   │   └── ig-progress-bar.component.ts
│   ├── ig-status-bar/
│   │   ├── ig-status-bar.component.html
│   │   ├── ig-status-bar.component.css
│   │   └── ig-status-bar.component.ts
│   ├── ig-tabs/
│   │   ├── ig-tabs.component.html
│   │   ├── ig-tabs.component.css
│   │   └── ig-tabs.component.ts
│   └── reel-player/
│       ├── reel-player.component.html
│       ├── reel-player.component.css
│       └── reel-player.component.ts
├── pages/
│   ├── insights-page/
│   │   ├── insights-page.component.html
│   │   ├── insights-page.component.css
│   │   └── insights-page.component.ts
│   ├── post-page/
│   │   ├── post-page.component.html
│   │   ├── post-page.component.css
│   │   └── post-page.component.ts
│   └── showcase-page/
│       ├── showcase-page.component.html
│       ├── showcase-page.component.css
│       └── showcase-page.component.ts
├── models/
│   └── insights.model.ts
└── services/
    └── insights.service.ts
```

---

## 📱 Recreated Screens

1. **Reel Post View (`/post`)** *(Image 5)*
2. **Reel Action Sheet / Options Menu** *(Image 4)*
3. **Reel Insights - Overview Tab (`/insights`)** *(Image 3)*
4. **Reel Insights - Audience Tab: Country** *(Image 1)*
5. **Reel Insights - Audience Tab: Age Breakdown** *(Image 2)*
6. **Interactive Showcase & Gallery (`/`)**

---

## 🚀 Getting Started

```bash
cd frontend
npm start
```
Navigate to `http://localhost:4200/` to test and view the complete app.
