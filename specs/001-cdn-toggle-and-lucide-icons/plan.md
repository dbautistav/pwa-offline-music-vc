# Implementation Plan: CDN Toggle and Lucide Icons

**Branch**: `001-cdn-toggle-and-lucide-icons` | **Date**: 2026-01-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-cdn-toggle-and-lucide-icons/spec.md`

## Summary

Add a toggle switch in the Header section to allow users to select between local media folder and CDN audio sources. The CDN URL format is: `https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media/{fileName}.mp3`. Toggle state persists across sessions using localStorage. When offline, CDN option is disabled and mode automatically switches to local. Also replace all emoji-based audio icons (▶️, ⏸️, ⏪, ⏩, 📱) with Lucide React icons for improved visual consistency.

## Technical Context

**Language/Version**: TypeScript 5+, React 18.2+, Next.js 14
**Primary Dependencies**: React, Next.js, Lucide React (install via `npm install lucide-react`)
**Storage**: localStorage for toggle state persistence
**Testing**: Manual testing required (no test framework configured)
**Target Platform**: Web PWA (Chrome/Edge 90+, Safari 14+, Firefox 88+)
**Project Type**: web (Next.js with Pages router)
**Performance Goals**: First Contentful Paint < 1.5s, Time to Interactive < 3s, Audio playback starts within 500ms
**Constraints**: < 200KB bundle size (gzipped), offline-capable, service worker compatibility
**Scale/Scope**: Single-page PWA with 13 audio tracks, state management limited to React hooks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Functionality First
- ✅ CDN toggle delivers tangible user value (flexibility in audio source selection)
- ✅ Lucide icons improve visual consistency and user experience
- ✅ Feature is independently testable and verifiable
- ✅ RESOLVED: CDN failure handling - Disable CDN option when offline, auto-switch to local mode (see research.md section 1)

### II. Modern PWA Best Practices
- ✅ Service worker cache strategy remains unchanged (Cache-First for assets)
- ✅ RESOLVED: CDN tracks cached identically to local tracks via existing service worker mechanism (see research.md section 2)
- ✅ Progressive enhancement: core audio playback works without toggle
- ✅ Performance impact minimal (state management via React hooks)
- ✅ RESOLVED: Toggle disabled when offline, CDN mode auto-switches to local (see research.md section 3)

### III. Pragmatic Type Safety
- ✅ TypeScript interfaces for AudioSourceMode enum and Track object
- ✅ Proper type imports with `type` keyword
- ✅ Avoid `any` - use proper types (already followed in codebase)
- ✅ Union type for state: `AudioSourceMode` (not optional)

### IV. Component Architecture
- ✅ Single responsibility: Toggle in Header, icons in AudioPlayer
- ✅ State local by default (toggle state in parent, passed down)
- ✅ Props flow down, events flow up (onToggleChange callback)
- ✅ Side effects in useEffect with cleanup
- ✅ Functional state updates
- ✅ Refs typed explicitly

### V. Offline-First Design
- ✅ RESOLVED: Toggle disabled when offline, CDN mode auto-switches to local (see research.md section 3)
- ✅ RESOLVED: No source indicator needed for cached tracks - toggle shows preference (see research.md section 4)
- ✅ Service worker cache versioning unchanged
- ✅ Cache invalidation explicit and predictable
- ✅ Online/offline state reflected in UI
- ✅ Network requests have timeouts and fallbacks

### VI. Code Quality & Maintainability
- ✅ Follow AGENTS.md style guidelines (imports, naming, formatting)
- ✅ Small, focused functions
- ✅ No comments (code self-documenting)
- ✅ Magic strings extracted as named constants
- ✅ Specific error handling

**GATE STATUS**: ✅ PASSED - All clarifications resolved in research.md

## Project Structure

### Documentation (this feature)

```text
specs/001-cdn-toggle-and-lucide-icons/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output (to be generated)
├── data-model.md        # Phase 1 output (to be generated)
├── quickstart.md        # Phase 1 output (to be generated)
└── contracts/           # Phase 1 output (not applicable for this feature)
```

### Source Code (repository root)

```text
pages/
├── index.tsx            # Add toggle state and UI in Header
└── _app.tsx             # No changes needed

components/
└── AudioPlayer.tsx      # Replace emoji icons with Lucide React icons

styles/
└── globals.css          # No changes needed

package.json             # Add lucide-react dependency
```

**Structure Decision**: Web application with single project structure. Toggle state managed in `pages/index.tsx` (parent component), passed to `AudioPlayer` component via props. Icons replaced directly in `AudioPlayer.tsx`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
