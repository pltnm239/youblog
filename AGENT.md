# AGENT.md

This document defines how an AI agent (and contributors) should work in this repository.

## Project overview

JetBrains YouTrack App that provides a corporate blog platform built on YouTrack Articles.

## Technical stack

- TypeScript (strict, no `any`)
- React 18
- Ring UI for UI components
- Vite 6 for build
- CSS Modules for styling
- YouTrack Articles REST API as data layer

## Working rules

- No comments in code.
- No `any`, no unsafe casts.
- kebab-case file naming.
- Ring UI components for all UI.
- Repository pattern for data access.
- Feature-first directory structure.
