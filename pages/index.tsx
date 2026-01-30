import { useState, useEffect } from 'react';
import Head from 'next/head';
import AudioPlayer from '../components/AudioPlayer';

type AudioSourceMode = 'local' | 'cdn';

interface Track {
  id: string;
  name: string;
  url: string;
  cached: boolean;
}

const STORAGE_KEY_AUDIO_SOURCE_MODE = 'audioSourceMode';

const getTrackUrl = (filename: string, mode: AudioSourceMode): string => {
  if (mode === 'cdn') {
    return `https://cdn.jsdelivr.net/gh/dbautistav/pwa-offline-music-vc@05364cc7c11d7d9cfcc3ea6712f76e083fc5e25c/public/media/${filename}`;
  }
  return `./media/${filename}`;
};

const _getTrackInfo = (mode: AudioSourceMode): Track[] => {
  const trackInfo = []

  const getTrackSoftId = (index: number): string => (trackInfo.length + index).toString()

  // Add the tracks from the noize archive - https://web.archive.org/web/20200830023255/https://noize.ml/
  const noizeTitles = [
    "Waterfall in a forest",
    "Thunderstorm & Rain",
    "Cafe Music",
    "Brown Noise",
    "Rainy Day",
    "Medieval Town",
    "Celestial Noise",
    "Metropolis Soundscape",
    "Snowy Blizzard",
    "Forest Ambience"
  ]
  for (let i = 1; i <= 10; i++) {
    trackInfo.push({
      id: getTrackSoftId(i),
      name: noizeTitles[i - 1],
      url: getTrackUrl(`a${i}.mp3`, mode),
      cached: false
    });
  }

  trackInfo.push(
    {
      id: getTrackSoftId(1),
      name: 'Short Track 1',
      url: getTrackUrl('one-short.mp3', mode),
      cached: false
    },
    {
      id: getTrackSoftId(2),
      name: 'Long Track 2',
      url: getTrackUrl('two-long.mp3', mode),
      cached: false
    },
    {
      id: getTrackSoftId(3),
      name: 'Long Track 3',
      url: getTrackUrl('three-long.wav', mode),
      cached: false
    }
  )

  return trackInfo
};

export default function Home() {
  const [audioSourceMode, setAudioSourceMode] = useState<AudioSourceMode>('local');
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>(_getTrackInfo('local'));

  useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY_AUDIO_SOURCE_MODE) as AudioSourceMode;
    if (savedMode) {
      setAudioSourceMode(savedMode);
      setTracks(_getTrackInfo(savedMode));
    }
  }, []);

  const handleToggleMode = (mode: AudioSourceMode) => {
    setAudioSourceMode(mode);
    localStorage.setItem(STORAGE_KEY_AUDIO_SOURCE_MODE, mode);
    setTracks(_getTrackInfo(mode));
  };

  useEffect(() => {
    if (!isOnline && audioSourceMode === 'cdn') {
      handleToggleMode('local');
    }
  }, [isOnline, audioSourceMode]);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'MP3_CACHED') {
          setTracks(prev => prev.map(track =>
            track.url === event.data.url
              ? { ...track, cached: true }
              : track
          ));
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleCacheTrack = (track: Track) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_MP3',
        url: track.url,
        filename: track.name
      });
    }
  };

  const handleInstallApp = async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt();
      console.log('Install result:', result);
      setInstallPrompt(null);
    }
  };

  return (
    <>
      <Head>
        <title>dev.focus()</title>
        <meta name="description" content="PWA for playing cached MP3 files offline" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Focus music</h1>

            {/* Status Indicators */}
            <div className="flex items-center space-x-4 mb-4">
              <div className={`flex items-center space-x-2 ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>

              {installPrompt && (
                <button
                  onClick={handleInstallApp}
                  className="px-4 py-2 bg-blue-600 text-sm rounded hover:bg-blue-500"
                >
                  📱 Install App
                </button>
              )}
            </div>

            <p className="text-gray-400">
              Cache your favorite MP3 files for offline listening.
              {!isOnline && ' You are currently offline - only cached tracks will play.'}
            </p>
          </div>

          {/* Audio Player */}
          <AudioPlayer 
            tracks={tracks} 
            onCacheTrack={handleCacheTrack}
          />
        </div>
      </div>
    </>
  );
}
