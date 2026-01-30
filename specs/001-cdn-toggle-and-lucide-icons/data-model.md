# Data Model: CDN Toggle and Lucide Icons

**Feature**: CDN Toggle and Lucide Icons
**Date**: 2026-01-30
**Status**: Draft

## Entities

### AudioSourceMode

**Description**: Represents the two available audio source modes for the application

**Type**: Enum
**Values**:
- `local`: Audio files served from local media folder (`./media/{filename}.mp3`)
- `cdn`: Audio files served from CDN (`https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media/{filename}.mp3`)

**Fields**:
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| value | 'local' \| 'cdn' | The selected audio source mode | Must be one of the two enum values |

**State Transitions**:
- User can toggle between `local` and `cdn` modes at any time when online
- When offline, mode automatically switches to `local` if it was `cdn`
- Mode persists across page refreshes and browser sessions

**Relationships**:
- Used by: Track (URL is derived from mode)
- Stored in: localStorage under key `'audioSourceMode'`

**Example**:
```typescript
type AudioSourceMode = 'local' | 'cdn';

const currentMode: AudioSourceMode = 'cdn';
const localMode: AudioSourceMode = 'local';
```

---

### Track (Extended)

**Description**: Represents an audio track in the application. Extended to support dynamic URL construction based on audio source mode.

**Note**: This entity already exists in the codebase (`pages/index.tsx:5-10`) but is documented here for clarity on the changes.

**Fields**:
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| id | string | Unique identifier for the track | Non-empty string |
| name | string | Display name of the track | Non-empty string |
| url | string | The URL used to play the track | Valid URL string, dynamically constructed based on AudioSourceMode |
| cached | boolean | Whether the track has been cached by the service worker | Boolean |

**Relationships**:
- Depends on: AudioSourceMode (url is derived from mode)
- Managed by: pages/index.tsx (parent component)

**URL Construction Logic**:
```typescript
const getTrackUrl = (filename: string, mode: AudioSourceMode): string => {
  if (mode === 'cdn') {
    return `https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media/${filename}.mp3`;
  }
  return `./media/${filename}`;
};
```

**Example**:
```typescript
interface Track {
  id: string;
  name: string;
  url: string;
  cached: boolean;
}

const track: Track = {
  id: '1',
  name: 'Short Track 1',
  url: './media/one-short.mp3',  // or 'https://cdn.jsdelivr.net/...' based on mode
  cached: false
};
```

---

### ApplicationState

**Description**: Represents the global application state managed in the parent component (pages/index.tsx)

**Fields**:
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| tracks | Track[] | Array of all available tracks | Array of valid Track objects |
| isOnline | boolean | Whether the browser is currently online | Boolean |
| audioSourceMode | AudioSourceMode | Selected audio source mode | 'local' or 'cdn' |
| installPrompt | any | PWA install prompt event (if available) | Event object or null |

**Relationships**:
- tracks: Contains Track entities
- audioSourceMode: Controls URL construction for tracks
- isOnline: Controls availability of CDN mode

**State Management**:
- `tracks` - managed by useState, updated when service worker caches a track
- `isOnline` - managed by useState, updated via online/offline event listeners
- `audioSourceMode` - managed by useState, persisted to localStorage
- `installPrompt` - managed by useState, set via beforeinstallprompt event

---

## Data Flow

### Initialization Flow

1. Component mounts in `pages/index.tsx`
2. Load `audioSourceMode` from localStorage (default: 'local')
3. Construct Track URLs based on `audioSourceMode` using `getTrackUrl` utility
4. Initialize `isOnline` from `navigator.onLine`
5. Initialize `tracks` with constructed URLs

### Toggle Mode Flow

1. User clicks toggle switch in Header (when online)
2. Update `audioSourceMode` state
3. Save `audioSourceMode` to localStorage
4. Reconstruct all Track URLs based on new mode
5. If same track is currently playing, audio element naturally switches to new source

### Offline Mode Flow

1. `offline` event fires
2. Update `isOnline` state to false
3. If `audioSourceMode` is 'cdn', switch to 'local'
4. Disable toggle switch in UI
5. Reconstruct Track URLs (now using local paths)

### Online Mode Flow

1. `online` event fires
2. Update `isOnline` state to true
3. Re-enable toggle switch in UI
4. Restore previously saved `audioSourceMode` from localStorage
5. Reconstruct Track URLs based on restored mode

---

## Constants

### CDN_BASE_URL

**Description**: Base URL for CDN audio files

**Value**: `'https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media'`

### LOCAL_BASE_PATH

**Description**: Relative path for local audio files

**Value**: `'./media'`

### STORAGE_KEY_AUDIO_SOURCE_MODE

**Description**: localStorage key for persisting audio source mode

**Value**: `'audioSourceMode'`

---

## Validation Rules

### Track URLs

- Local URLs must start with `'./media/'`
- CDN URLs must match the pattern: `https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media/{filename}.mp3`
- Filename extraction from track data must be consistent (e.g., `'a1.mp3'`, `'one-short.mp3'`)

### Toggle State

- Can only be toggled when `isOnline === true`
- When `isOnline === false`, mode must be 'local'
- Saved value must be one of the enum values: 'local' or 'cdn'

### AudioPlayback

- Current playback time should be preserved when switching modes (if possible)
- If track fails to load from one source, do not automatically fallback to the other (user should be aware of the source)
- Cached status is independent of source mode (both local and CDN tracks can be cached)

---

## Type Definitions

```typescript
// Audio source mode enum
type AudioSourceMode = 'local' | 'cdn';

// Track interface (extends existing)
interface Track {
  id: string;
  name: string;
  url: string;
  cached: boolean;
}

// Application state
interface ApplicationState {
  tracks: Track[];
  isOnline: boolean;
  audioSourceMode: AudioSourceMode;
  installPrompt: Event | null;
}

// URL construction function signature
type GetTrackUrlFunction = (filename: string, mode: AudioSourceMode) => string;

// Toggle change handler signature
type ToggleModeHandler = (mode: AudioSourceMode) => void;
```
