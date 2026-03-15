# Architecture

## Overview

Blog YouTrack App is a JetBrains YouTrack application that turns YouTrack Articles into a corporate blog platform. It runs as a `MAIN_MENU_ITEM` widget inside YouTrack, providing a blog-like reading experience on top of the native Knowledge Base.

## Data Model

The app uses YouTrack Articles as the sole data layer — no external database.

```
[Project: Demo project]
  ├── [Root Article: "Engineering Blog"]     ← blog (umbrella article)
  │     ├── [Article: "How we migrated..."]  ← blog post
  │     ├── [Article: "Design System..."]    ← blog post
  │     └── ...
  ├── [Root Article: "Product Blog"]         ← another blog
  │     └── [Article: "Q1 Roadmap..."]       ← blog post
  └── ...
```

- **Admin configures a project** in app settings (x-entity: Project)
- **Root-level articles** in that project = blogs
- **Child articles** under each root = blog posts
- **Tags, comments, attachments, hasStar** = native YouTrack article features

## Tech Stack

- **TypeScript** (strict, no `any`)
- **React 18** with functional components and hooks
- **Ring UI** (JetBrains component library) for all UI controls
- **Vite 6** for build
- **CSS Modules** for styling
- **YouTrack Articles REST API** for data

## Directory Structure

```
blog-youtrack-app/
  @types/
    globals.d.ts              # YTApp global, HostAPI types
    css-modules.d.ts          # CSS modules declaration
  src/
    app.tsx                   # Root component with state-based routing
    navigation.tsx            # React context for page navigation
    utils.ts                  # stripMarkdown, formatDate, getReadingTime, etc.
    settings.json             # App settings schema (project picker)
    backend.js                # Server-side: settings endpoint
    icon.svg                  # App icon
    api/
      types.ts                # Domain types: BlogPost, Blog, Author, etc.
      host.ts                 # HostAPI interface
      host-context.tsx        # React context for YouTrack host
      config/
        config-repository.ts        # Interface
        app-config-repository.ts    # Fetches project setting from backend
      articles/
        articles-repository.ts      # Interface
        yt-articles-repository.ts   # YouTrack REST API implementation
    pages/
      blog-list/              # Blog selector (multi-blog)
      feed/                   # Post list with search, pagination
      post/                   # Single post view with comments, star
      editor/                 # Post editor (retained but unused — New Post links to YT)
    components/
      breadcrumbs/            # Navigation breadcrumbs
      comment-section/        # Comments list + add form
      markdown-editor/        # Textarea + preview (retained)
      page/                   # Layout wrapper (max-width container)
      post-card/              # Card in feed list
      post-content/           # Markdown → HTML renderer
      search-input/           # Debounced search field
      setup-required/         # First-run setup screen
      tag-list/               # Tag pills display
    widgets/
      blog/
        index.html            # Widget entry HTML
        index.tsx             # React root mount
        app.tsx               # YTApp.register() + HostProvider
        widget-icon.svg       # Menu icon
  manifest.json               # YouTrack app manifest
  package.json
  vite.config.ts
  tsconfig.json / tsconfig.app.json / tsconfig.node.json
  eslint.config.mjs
```

## Routing

State-based routing without react-router. `app.tsx` holds a `Route` union type:

- `blog-list` — list of blogs (auto-redirects to feed if only one blog)
- `feed` — post list for a specific blog, with optional author filter
- `post` — single post view
- `editor` — retained for potential future use

Navigation is provided via React context (`NavigationProvider`).

## Data Flow

```
Widget (app.tsx)
  → HostProvider (host-context.tsx)
    → AppConfigRepository.getConfig()  →  backend.js  →  settings.json
    → YtArticlesRepository.*()         →  YouTrack REST API (/api/articles/*)
```

### Repository Pattern

- `ConfigRepository` interface → `AppConfigRepository` (fetches via `host.fetchApp`)
- `ArticlesRepository` interface → `YtArticlesRepository` (fetches via `host.fetchYouTrack`)
- Domain types are mapped at the boundary (YTArticle → BlogPost)

## YouTrack API Endpoints Used

| Operation | Endpoint |
|-----------|----------|
| List articles by project | `GET /api/articles?query=project:{key}` |
| Get article + children | `GET /api/articles/{id}?fields=childArticles(...)` |
| Get single article | `GET /api/articles/{id}?fields=...` |
| Update article (star) | `POST /api/articles/{id}` with `{hasStar}` |
| List comments | `GET /api/articles/{id}/comments` |
| Add comment | `POST /api/articles/{id}/comments` |
| Create new article | Native YT UI via `/articles/n?parentArticleId={id}` |

## Features

- **Multi-blog support**: multiple root articles = multiple blogs
- **Feed**: post cards with author avatar, relative date, reading time, tags, comment count, star indicator
- **Post view**: full Markdown rendering, star toggle, inline tags, comments
- **Search**: debounced client-side filtering by title, content, author, tags
- **Pagination**: Ring UI Pager, 10 posts per page
- **Comments**: read + add (Ctrl+Enter to submit)
- **Star/Favorite**: personal bookmark via `hasStar` API
- **Reading time**: calculated client-side (~200 wpm)
- **New Post**: links to native YouTrack article editor (`/articles/n?parentArticleId=...`)
- **Author filter**: click author name to filter feed by that author

## Markdown Rendering

Custom lightweight renderer in `post-content.tsx`:
- Headings (h1-h3), bold, italic, strikethrough
- Code blocks and inline code
- Lists (ordered/unordered)
- Blockquotes
- Images (full-width, rounded)
- Links (open in new tab)
- Horizontal rules
- Leading `# Title` is auto-stripped (title comes from `post.summary`)

## Settings

Single setting via `settings.json`:
- **Blog Project** (`x-entity: Project`) — determines which project's articles power the blog

Backend endpoint (`backend.js`) reads this setting and returns `{project: {id, name, shortName}}`.
