<!--
SYNC IMPACT REPORT
==================
Version Change: 0.0.0 → 1.0.0
Modified Principles: N/A (initial version)
Added Sections:
  - Core Principles (6 principles)
  - Technical Standards
  - Development Workflow
Removed Sections: N/A
Templates Updated:
  - ✅ .specify/templates/plan-template.md (Constitution Check section reviewed - aligns with new principles)
  - ✅ .specify/templates/spec-template.md (Requirements structure reviewed - compatible)
  - ✅ .specify/templates/tasks-template.md (Task organization reviewed - compatible)
  - ✅ AGENTS.md (Code style guidelines reviewed - aligned with constitution)
Follow-up TODOs: None
-->

# PWA Offline Music VC Constitution

## Core Principles

### I. Functionality First

Every feature MUST deliver tangible user value before optimization. Features are implemented to solve real user problems, not for technical elegance alone. All functionality MUST be independently testable and verifiable before being marked complete. User stories are prioritized by value delivery, not technical complexity. Technical debt is acceptable when it enables faster time-to-market, but MUST be documented and tracked for resolution.

Rationale: The primary purpose of this project is to provide offline MP3 playback functionality. Technical elegance without working features delivers no value to users.

### II. Modern PWA Best Practices

All offline functionality MUST rely on service workers with Cache-First strategy for assets and Network-First for dynamic content. Progressive enhancement is mandatory: core features MUST work without JavaScript, enhanced features load progressively. The app MUST pass all PWA installation criteria (manifest, service worker, HTTPS, responsive design). Performance MUST be optimized for mobile devices (target: First Contentful Paint < 1.5s, Time to Interactive < 3s). Battery impact MUST be minimized through efficient background sync and event handling.

Rationale: A PWA that doesn't install or perform well on mobile devices fails its primary purpose. Modern web standards ensure reliability across platforms.

### III. Pragmatic Type Safety

TypeScript interfaces MUST be used for object shapes; type aliases are reserved for unions and primitives. `any` is prohibited; use `unknown` when type cannot be determined. Optional properties MUST be explicitly marked with `?`. Union types MUST use `| null` over `| undefined` for optional state. Type imports MUST use the `type` keyword for optimal tree-shaking. Strict mode is currently disabled but SHOULD be enabled incrementally as code stabilizes.

Rationale: Type safety catches bugs early and improves maintainability, but overly strict typing can slow development. Pragmatic balance enables fast iteration with safety nets.

### IV. Component Architecture

Components MUST have single responsibility and clear props interfaces. State is local by default; lift to parent only when shared. Props flow down, events flow up. Side effects (service workers, event listeners) MUST use `useEffect` with cleanup functions. State updates MUST use functional form (`setTracks(prev => prev.map(...))`) to avoid stale closures. Refs MUST be typed explicitly. Each component MUST be independently testable and composable.

Rationale: Clear component architecture prevents spaghetti code, makes testing easier, and enables future feature addition without refactoring the entire codebase.

### V. Offline-First Design

All critical paths (audio playback, track listing, UI state) MUST work offline. Service worker cache MUST be versioned (`CACHE_NAME` includes version). Cache invalidation MUST be explicit and predictable. Online/offline state MUST be reflected in UI with clear user feedback. Network requests MUST have timeouts and fallback mechanisms. Background sync SHOULD be used for updates when available.

Rationale: The project's core value proposition is offline playback. If it doesn't work offline, it fails its primary purpose.

### VI. Code Quality & Maintainability

Code MUST follow the style guidelines in AGENTS.md (imports order, naming conventions, formatting). Functions MUST be small and focused (< 50 lines preferred). Comments are discouraged; code should be self-documenting through clear naming. DRY is important but readability takes precedence. Magic numbers and strings MUST be extracted as named constants. Error handling MUST be specific (avoid generic `try-catch` without action).

Rationale: Maintainable code reduces future bugs, enables faster onboarding of new contributors, and allows confident refactoring when requirements change.

## Technical Standards

### Technology Stack

- **Framework**: Next.js 14 with Pages router
- **Language**: TypeScript 5+ (strict mode to be enabled)
- **UI Library**: React 18 with hooks-based architecture
- **Styling**: Tailwind CSS v4 with `@import "tailwindcss"` syntax
- **Build**: Static export (`output: "export"`)
- **Runtime**: Service worker (public/sw.js) for offline capability

### Performance Requirements

- First Contentful Paint: < 1.5s on 3G
- Time to Interactive: < 3s on 3G
- Audio playback: MUST start within 500ms of user interaction
- Bundle size: < 200KB (gzipped) for initial load
- Memory usage: < 100MB during playback

### Browser Support

- Chrome/Edge 90+ (primary)
- Safari 14+
- Firefox 88+
- Progressive degradation for older browsers

### Code Organization

```
pages/           # Next.js pages (routing)
  _app.tsx       # App wrapper, service worker registration
  _document.tsx  # HTML structure
  index.tsx      # Main application page
components/      # Reusable UI components
styles/          # Global styles and Tailwind imports
public/          # Static assets, service worker, manifest
```

## Development Workflow

### Build Commands

```bash
npm run dev          # Start development server
npm run build        # Build production static export
npm run start        # Start production server
```

### Code Review Process

All code changes MUST:
1. Follow AGENTS.md style guidelines
2. Adhere to all six Core Principles
3. Include type definitions for all new interfaces
4. Maintain offline functionality (no regressions)
5. Pass manual testing of affected features

### Feature Implementation

1. Define user story with acceptance criteria
2. Write minimal viable implementation
3. Test offline functionality manually
4. Verify type safety (no TypeScript errors)
5. Check performance impact (bundle size, runtime)
6. Update AGENTS.md if new patterns introduced

### Testing Philosophy

Manual testing is currently required due to lack of test framework. When adding automated tests:
1. Test framework MUST be added to package.json
2. Tests MUST cover critical paths (audio playback, offline mode)
3. Integration tests preferred over unit tests for this project
4. Tests MUST run in CI before merge

## Governance

This Constitution is the authoritative source for development decisions. It supersedes all other guidelines in case of conflict.

### Amendment Process

1. Proposed amendments MUST be documented with rationale
2. Impact on existing code MUST be assessed
3. Version MUST increment per semantic versioning:
   - MAJOR: Backward-incompatible principle removal or redefinition
   - MINOR: New principle or section added
   - PATCH: Clarifications, wording fixes, non-semantic refinements
4. Template sync MUST be performed after amendments
5. AGENTS.md MUST be updated if style guidelines change

### Compliance Review

All pull requests MUST verify compliance with:
- Functionality First (feature delivers value)
- Modern PWA Best Practices (offline-capable, performant)
- Pragmatic Type Safety (TypeScript errors, any usage)
- Component Architecture (single responsibility, testable)
- Offline-First Design (works without network)
- Code Quality & Maintainability (style guidelines)

Complexity MUST be justified in pull request description when principles are violated. Use AGENTS.md for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-01-29 | **Last Amended**: 2026-01-29
