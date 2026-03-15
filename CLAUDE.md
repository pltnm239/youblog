# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Hard Requirements

- TypeScript only.
- Ring UI only for UI components.
- Clean, modular, feature-first architecture.
- NO COMMENTS IN CODE: do not add // or /* */ comments anywhere.
- No placeholders for core logic. End-to-end runnable.
- No `any`, no unsafe casts. Keep types explicit and tight.
- Do not break existing pages. Build must succeed.
- **File naming: kebab-case only** (e.g., `post-card.tsx`, `use-feed.ts`, `editor-page.tsx`).

## Build and Deploy

After completing a block of changes, always run the build and upload commands:

```bash
npm run build
npm run upload -- --host http://localhost:9099 --token perm-YWRtaW4=.NDYtMzI=.u5uEQc7rI0UEcNH8AJvfBmaFKlabdh
```

**Important:** Execute these commands after finishing each set of related changes to deploy the app to YouTrack.

## Testing

Test the app here: http://localhost:9099/app/blog/blog

## Documentation

Use the official YouTrack Apps documentation: https://www.jetbrains.com/help/youtrack/devportal/apps-documentation.html
