# Research: CDN Toggle and Lucide Icons

**Feature**: CDN Toggle and Lucide Icons
**Date**: 2026-01-30
**Status**: Complete

## 1. CDN Failure Handling and Offline Mode

**Decision**: Disable CDN option when offline, automatically switch to local mode

**Rationale**:
- The app already tracks online/offline status in `pages/index.tsx:65-73`
- CDN requires network connectivity and will fail when offline
- Automatically switching to local mode ensures continuous playback without user intervention
- The service worker already has fallback logic in `public/sw.js:44-49` for offline scenarios

**Implementation Approach**:
- Disable the toggle switch when `isOnline === false`
- Show visual feedback (e.g., disabled state with tooltip) indicating why CDN is unavailable
- When going offline, if CDN mode was active, switch to local mode and persist the change
- When coming back online, preserve the previously selected mode (CDN or local)

**Alternatives Considered**:
- Allow CDN toggle even when offline but show error when playback fails
  - Rejected because this provides poor user experience
- Show CDN option but attempt to fall back to local when CDN fails
  - Rejected because this complicates error handling and may confuse users

---

## 2. CDN vs Local Track Caching

**Decision**: Cache CDN and local tracks identically using the service worker's existing CACHE_MP3 message mechanism

**Rationale**:
- The service worker in `public/sw.js:53-80` caches MP3s based on URL as the cache key
- Both local (`./media/{filename}.mp3`) and CDN (`https://cdn.jsdelivr.net/...`) URLs will be cached separately
- No changes needed to service worker logic - it already handles both scenarios
- This maintains consistency with the existing caching implementation

**Implementation Approach**:
- Continue using `CACHE_MP3` message to cache tracks
- The cache key is the full URL, so local and CDN versions of the same track are cached independently
- No changes needed to service worker code

**Alternatives Considered**:
- Cache both sources under a single identifier
  - Rejected because this adds complexity to service worker logic without clear benefit
- Skip caching for CDN tracks (always stream from CDN)
  - Rejected because this would violate the Offline-First Design principle

---

## 3. Offline Mode Behavior

**Decision**: Disable CDN toggle when offline, auto-switch to local mode

**Rationale**:
- Aligns with Constitution Principle V (Offline-First Design)
- Core features MUST work offline - CDN option is an enhancement, not a core feature
- Prevents user confusion and error scenarios
- Matches the existing pattern in `pages/index.tsx:155-157` where offline status is communicated to users

**Implementation Approach**:
- Wrap toggle component in a conditional check: `isOnline && <Toggle />`
- When going offline while CDN mode is active, switch to local mode and persist the change
- When coming back online, restore the previously selected mode (CDN or local) from localStorage
- Update the UI text to indicate when CDN is unavailable due to offline status

**Alternatives Considered**:
- Keep toggle enabled but show error when trying to play from CDN while offline
  - Rejected because this provides poor user experience and violates Offline-First principle
- Hide the toggle completely when offline
  - Rejected because this removes user agency and may confuse users about where their audio is coming from

---

## 4. Cached Track Source Indication

**Decision**: Do not show source indicator for cached tracks

**Rationale**:
- The current implementation already shows a generic "📱 Cached" indicator in `components/AudioPlayer.tsx:169-170`
- The cache key is the full URL, which includes the source information
- Service worker handles source resolution transparently
- Adding source indication adds UI complexity without clear user value
- The user's current selection (CDN vs Local) is already visible via the toggle state

**Implementation Approach**:
- Keep existing "Cached" indicator (updated to Lucide icon)
- No changes to cached track display logic
- The toggle state in the header already indicates the current source preference

**Alternatives Considered**:
- Show "Cached from CDN" vs "Cached from Local"
  - Rejected because this adds UI complexity without clear user value
- Track caching statistics separately for each source
  - Rejected because this adds state management complexity without functional benefit

---

## 5. Lucide React Installation and Bundle Impact

**Decision**: Install lucide-react and use tree-shaking to minimize bundle impact

**Rationale**:
- Lucide React is a lightweight icon library with excellent tree-shaking support
- Icons are exported individually, allowing bundlers to only include used icons
- Estimated bundle impact: < 5KB gzipped for the icons we need
- Within the < 200KB gzipped bundle size requirement from Technical Standards

**Implementation Approach**:
- Install: `npm install lucide-react`
- Import specific icons: `import { Play, Pause, SkipBack, SkipForward, Download, Smartphone } from 'lucide-react'`
- Use icons as React components: `<Play className="w-4 h-4" />`
- Replace all emoji icons in `components/AudioPlayer.tsx`:
  - ▶️ → `<Play />`
  - ⏸️ → `<Pause />`
  - ⏪ → `<SkipBack />`
  - ⏩ → `<SkipForward />`
  - 📱 (Cached indicator) → `<Smartphone />` or `<Download />`

**Alternatives Considered**:
- Use other icon libraries (Material Icons, Heroicons)
  - Rejected because Lucide React was specifically requested and is well-maintained
- Keep emoji icons
  - Rejected because user explicitly requested Lucide React for better visual appeal

**Icons to Replace**:
- Play button: `Play` icon
- Pause button: `Pause` icon
- Skip back 10s: `Rewind` icon (closest match) or custom arrow
- Skip forward 10s: `FastForward` icon (closest match) or custom arrow
- Cached indicator: `CheckCircle` or `CloudDownload` icon
- Install app button: `Download` or `Smartphone` icon

---

## 6. Toggle State Persistence

**Decision**: Use localStorage to persist toggle state across browser sessions

**Rationale**:
- Simple, no additional dependencies needed
- Persists across page refreshes and browser restarts
- Web Storage API is available in all modern browsers (matches target platform requirements)
- Aligns with existing pattern in codebase for client-side state

**Implementation Approach**:
- On component mount, read from localStorage: `const savedMode = localStorage.getItem('audioSourceMode')`
- Default to 'local' if no saved value exists
- On toggle change, save to localStorage: `localStorage.setItem('audioSourceMode', mode)`
- Type definition: `type AudioSourceMode = 'local' | 'cdn'`

**Alternatives Considered**:
- Use cookies
  - Rejected because localStorage is simpler and has more storage space
- Use URL query parameters
  - Rejected because this doesn't persist across browser restarts and clutters URLs
- Don't persist state at all
  - Rejected because this degrades user experience (preference lost on refresh)

---

## 7. Track URL Construction

**Decision**: Create a utility function to dynamically construct URLs based on source mode

**Rationale**:
- Centralizes URL construction logic
- Makes it easy to add new sources in the future
- Clear separation of concerns
- Easy to test and maintain

**Implementation Approach**:
```typescript
const getTrackUrl = (filename: string, mode: 'local' | 'cdn'): string => {
  if (mode === 'cdn') {
    return `https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media/${filename}.mp3`;
  }
  return `./media/${filename}`;
};
```

**Usage**:
- In `pages/index.tsx`, reconstruct track URLs when mode changes
- In `AudioPlayer`, use the URL passed via props (constructed by parent)

**Alternatives Considered**:
- Store both URLs in Track object
  - Rejected because this duplicates data and makes the Track object larger
- Compute URLs inline wherever needed
  - Rejected because this leads to code duplication

---

## 8. Seamless Mode Switching

**Decision**: When toggling modes, if the same track is playing, reload from the new source without interruption

**Rationale**:
- Provides the smoothest user experience
- User doesn't lose their place in the current track
- Aligns with Functionality First principle (value delivery)

**Implementation Approach**:
- When toggle changes, update the currentTrack's URL in the parent component
- Audio element will naturally switch to the new source
- Handle any loading state that occurs during the switch
- Preserve current playback time if possible (may require additional logic)

**Alternatives Considered**:
- Stop playback when switching modes
  - Rejected because this provides poor user experience
- Keep playing from old source until next track
  - Rejected because this may confuse users about which source is being used

---

## Summary

All clarifications from the Technical Context and Constitution Check have been resolved:

1. ✅ CDN failure handling: Disable CDN option when offline, auto-switch to local
2. ✅ CDN vs local caching: Cache identically using existing service worker mechanism
3. ✅ Offline mode behavior: Disable CDN toggle, auto-switch to local mode
4. ✅ Cached track source indication: No source indicator needed (toggle shows preference)
5. ✅ Lucide React installation: Install and use tree-shaking for minimal bundle impact
6. ✅ Toggle state persistence: Use localStorage
7. ✅ Track URL construction: Centralized utility function
8. ✅ Seamless mode switching: Reload current track from new source

**All NEEDS CLARIFICATION items resolved. Ready to proceed to Phase 1: Design & Contracts.**
