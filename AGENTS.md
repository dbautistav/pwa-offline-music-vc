# Agent Development Guide

## Build Commands

```bash
npm run dev          # Start development server
npm run build        # Build production static export
npm run start        # Start production server
```

**Note:** This project does not have test or lint commands configured. When adding tests, check package.json for the testing framework being used.

## Project Overview

Next.js 14 PWA for offline MP3 playback with service worker caching. Uses Pages router with static export configuration (`output: "export"`). TypeScript strict mode is disabled.

## Code Style Guidelines

### Imports
- React hooks first: `import { useState, useEffect } from 'react';`
- External libraries second: `import Head from 'next/head';`
- Relative imports third: `import AudioPlayer from '../components/AudioPlayer';`
- Type imports separate: `import type { AppProps } from 'next/app';`

### Component Structure
- Define interfaces above component: `interface Track { id: string; name: string; ... }`
- Props interface: `interface AudioPlayerProps { tracks: Track[]; onCacheTrack: (track: Track) => void; }`
- Destructure props: `export default function AudioPlayer({ tracks, onCacheTrack }: AudioPlayerProps)`
- State hooks initialized: `const [currentTrack, setCurrentTrack] = useState<Track | null>(tracks[4]);`
- Refs typed: `const audioRef = useRef<HTMLAudioElement>(null);`

### TypeScript
- Use interfaces for object shapes, not type aliases (follow existing pattern)
- Type imports with `type` keyword for cleaner tree-shaking
- Avoid `any` - use proper types or `unknown` when necessary
- Optional props: `onCacheTrack?: (track: Track) => void;`
- Union types for state: `Track | null` not `Track | undefined`

### Naming Conventions
- Components: PascalCase: `AudioPlayer`, `Home`
- Functions: camelCase: `handleCacheTrack`, `playTrack`, `formatTime`
- Constants: UPPER_SNAKE_CASE: `CACHE_NAME`, `TRACKS`
- Private helpers: `_getTrackInfo` (underscore prefix)
- Props: camelCase matching component usage
- Event handlers: `handle` + action: `handleOnline`, `handleOffline`

### Formatting
- 2 space indentation (no tabs)
- Trailing commas in multi-line arrays/objects
- Arrow functions for inline handlers: `onClick={() => playTrack(track)}`
- Template literals for strings with variables: `` `Track ${id}` ``
- JSX inline for short props, multiline for complex ones

### Error Handling
- Service worker: `.catch()` with console.error logging
- Conditional rendering: `{isLoading && <p>Loading...</p>}`
- Safe navigation: `audioRef.current?.play()` (optional chaining)
- Early returns in hooks: `if (!audio) return;`
- Try-catch only when necessary (current codebase minimal)

### React Patterns
- Use `useEffect` for side effects (event listeners, service workers)
- Always return cleanup function: `return () => { window.removeEventListener(...) }`
- State updates use functional form: `setTracks(prev => prev.map(...))`
- Single responsibility components (AudioPlayer handles playback only)
- Props up, events down pattern

### Service Worker
- Located in `public/sw.js`
- Use `caches.open(CACHE_NAME)` for cache management
- Message events use `self.clients.matchAll()` for client communication
- Event-driven architecture: install, activate, fetch, message

### CSS/Tailwind
- Tailwind v4 with `@import "tailwindcss"` (not @tailwind directives)
- Utility classes for layout: `flex`, `grid`, `space-x-4`
- Colors from Tailwind palette: `bg-gray-900`, `text-white`, `bg-blue-600`
- Hover states: `hover:bg-blue-500`
- Responsive: use standard Tailwind responsive prefixes

### File Structure
```
pages/           # Next.js pages
  _app.tsx       # App wrapper (service worker registration)
  _document.tsx  # HTML structure
  index.tsx      # Main page
components/      # Reusable components
styles/          # Global styles
public/          # Static assets, service worker, manifest
```

### Key Configurations
- `next.config.js`: `basePath: "/pwa-offline-music-vc"`, `output: "export"`
- `tsconfig.json`: `strict: false` (enable strict mode in future)
- SWC minification enabled: `swcMinify: true`
