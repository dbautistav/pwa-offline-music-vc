# Contracts: CDN Toggle and Lucide Icons

**Feature**: CDN Toggle and Lucide Icons
**Date**: 2026-01-30

## Overview

This feature is a frontend-only implementation with no external API contracts. All functionality is contained within the client-side React components.

## No API Contracts Required

This feature does not require any API contracts because:

1. **Client-side state management**: Toggle state is managed entirely in React components
2. **LocalStorage persistence**: Toggle preferences are stored in browser's localStorage
3. **No backend communication**: No new API endpoints are created or modified
4. **Static file serving**: Both local and CDN audio files are served as static files
5. **Service worker unchanged**: Existing service worker logic continues to work without modifications

## Implementation Summary

### State Management
- `AudioSourceMode`: 'local' | 'cdn' (stored in localStorage)
- Toggle state managed in `pages/index.tsx`
- No external API calls required

### URL Construction
- Local: `./media/{filename}.mp3`
- CDN: `https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media/{filename}.mp3`
- URLs constructed client-side via `getTrackUrl` utility function

### Icon Updates
- All icons are React components from `lucide-react`
- No API calls required for icon rendering

## Data Flow

```
User Action (Toggle)
    ↓
React State Update
    ↓
localStorage Write
    ↓
URL Reconstruction
    ↓
Audio Element Update
```

## Files Modified

1. `pages/index.tsx` - Toggle state management and UI
2. `components/AudioPlayer.tsx` - Lucide icon integration
3. `package.json` - Add lucide-react dependency

## Files Not Modified

- `public/sw.js` - Service worker remains unchanged
- `pages/_app.tsx` - No changes needed
- `pages/_document.tsx` - No changes needed
- `styles/globals.css` - No changes needed
