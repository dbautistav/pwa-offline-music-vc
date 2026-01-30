# Quickstart Guide: CDN Toggle and Lucide Icons

**Feature**: CDN Toggle and Lucide Icons
**Date**: 2026-01-30

## Overview

This feature adds a toggle switch in the Header to allow users to select between local and CDN audio sources, and replaces all emoji-based audio icons with Lucide React icons for improved visual consistency.

## Prerequisites

- Node.js and npm installed
- Existing Next.js PWA project structure
- Access to local media files and CDN repository

## Installation

1. **Install Lucide React**:

```bash
npm install lucide-react
```

2. **Verify installation**:

```bash
npm run dev
```

The development server should start without errors.

## Implementation Steps

### Step 1: Update `pages/index.tsx`

Add the toggle state and UI in the Header section:

```typescript
import { useState, useEffect } from 'react';

type AudioSourceMode = 'local' | 'cdn';

const STORAGE_KEY_AUDIO_SOURCE_MODE = 'audioSourceMode';

const getTrackUrl = (filename: string, mode: AudioSourceMode): string => {
  if (mode === 'cdn') {
    return `https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media/${filename}.mp3`;
  }
  return `./media/${filename}`;
};

export default function Home() {
  const [audioSourceMode, setAudioSourceMode] = useState<AudioSourceMode>('local');
  const [isOnline, setIsOnline] = useState(true);
  const [tracks, setTracks] = useState<Track[]>(TRACKS);

  // Load saved mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY_AUDIO_SOURCE_MODE) as AudioSourceMode;
    if (savedMode) {
      setAudioSourceMode(savedMode);
    }
  }, []);

  // Handle mode toggle
  const handleToggleMode = (mode: AudioSourceMode) => {
    setAudioSourceMode(mode);
    localStorage.setItem(STORAGE_KEY_AUDIO_SOURCE_MODE, mode);
    
    // Reconstruct track URLs based on new mode
    const updatedTracks = TRACKS.map(track => ({
      ...track,
      url: getTrackUrl(track.url.split('/').pop() || '', mode)
    }));
    setTracks(updatedTracks);
  };

  // Handle offline mode
  useEffect(() => {
    if (!isOnline && audioSourceMode === 'cdn') {
      handleToggleMode('local');
    }
  }, [isOnline, audioSourceMode]);

  // ... rest of the component
}
```

Add the toggle UI in the Header section:

```jsx
{/* Header */}
<div className="mb-8">
  <h1 className="text-3xl font-bold mb-4">Focus music</h1>
  
  {/* Audio Source Toggle */}
  <div className="flex items-center space-x-4 mb-4">
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="audioSource"
        value="local"
        checked={audioSourceMode === 'local'}
        onChange={() => handleToggleMode('local')}
        disabled={!isOnline}
        className="w-4 h-4"
      />
      <span className={!isOnline && audioSourceMode !== 'local' ? 'text-gray-500' : ''}>
        Local
      </span>
    </label>
    
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="audioSource"
        value="cdn"
        checked={audioSourceMode === 'cdn'}
        onChange={() => handleToggleMode('cdn')}
        disabled={!isOnline}
        className="w-4 h-4"
      />
      <span className={!isOnline ? 'text-gray-500' : ''}>
        CDN
      </span>
    </label>
  </div>
  
  {/* ... rest of the Header */}
</div>
```

### Step 2: Update `components/AudioPlayer.tsx`

Replace all emoji icons with Lucide React icons:

```typescript
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Download } from 'lucide-react';

export default function AudioPlayer({ tracks, onCacheTrack }: AudioPlayerProps) {
  // ... existing code

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      {/* ... existing code */}

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => seek(Math.max(0, currentTime - 10))}
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
        >
          <SkipBack className="w-5 h-5 inline" /> 10s
        </button>
        <button
          onClick={() => isPlaying ? pauseTrack() : audioRef.current?.play()}
          className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          {isPlaying ? (
            <><Pause className="w-5 h-5 inline" /> Pause</>
          ) : (
            <><Play className="w-5 h-5 inline" /> Play</>
          )}
        </button>
        <button
          onClick={() => seek(Math.min(duration, currentTime + 10))}
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
        >
          10s <SkipForward className="w-5 h-5 inline" />
        </button>
      </div>

      {/* Track List */}
      <div className="border-t border-gray-600 pt-4">
        <h2 className="text-xl font-bold mb-4">Tracks</h2>
        <div className="space-y-2">
          {tracks.map((track) => (
            <div key={track.id}>
              <div className="flex items-center space-x-3">
                <button onClick={() => playTrack(track)}>
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <span>{track.name}</span>
                {track.cached && (
                  <Download className="w-4 h-4 text-green-400" />
                )}
              </div>
              {!track.cached && (
                <button onClick={() => onCacheTrack(track)}>
                  Cache Offline
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Testing

### Manual Testing Checklist

1. **Toggle Functionality**:
   - [ ] Toggle between Local and CDN modes
   - [ ] Verify audio plays from correct source
   - [ ] Verify toggle state persists after page refresh
   - [ ] Verify toggle state persists after browser restart

2. **Offline Mode**:
   - [ ] Go offline (disconnect network or use DevTools)
   - [ ] Verify CDN option is disabled
   - [ ] Verify mode auto-switches to Local if CDN was active
   - [ ] Verify audio plays from local source while offline
   - [ ] Go back online
   - [ ] Verify CDN option is re-enabled
   - [ ] Verify previous mode is restored

3. **Lucide Icons**:
   - [ ] Verify Play icon appears correctly
   - [ ] Verify Pause icon appears correctly
   - [ ] Verify Skip Back (10s) icon appears correctly
   - [ ] Verify Skip Forward (10s) icon appears correctly
   - [ ] Verify Cached indicator icon appears correctly

4. **Seamless Switching**:
   - [ ] Start playing a track in Local mode
   - [ ] Switch to CDN mode while track is playing
   - [ ] Verify track continues playing from new source

## Troubleshooting

### Toggle state not persisting

- Verify localStorage is not blocked by browser settings
- Check browser console for errors

### CDN URLs not working

- Verify CDN URL format matches the pattern
- Check network tab for HTTP errors
- Verify internet connectivity

### Icons not displaying

- Verify lucide-react is installed: `npm ls lucide-react`
- Check import paths are correct
- Verify Tailwind classes for icon sizing

### Toggle not disabled when offline

- Verify `isOnline` state is updating correctly
- Check event listeners for 'online' and 'offline' events

## Additional Notes

- CDN URLs follow the pattern: `https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@main/public/media/{filename}.mp3`
- Local URLs use relative paths: `./media/{filename}.mp3`
- Toggle state is stored in localStorage with key `'audioSourceMode'`
- Service worker caching works the same for both local and CDN sources

## Related Files

- `pages/index.tsx`: Main page with toggle state management
- `components/AudioPlayer.tsx`: Audio player component with Lucide icons
- `public/sw.js`: Service worker for caching MP3s
- `package.json`: Add lucide-react to dependencies
