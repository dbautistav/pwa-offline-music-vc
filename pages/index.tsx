import { useState, useEffect } from 'react';
import Head from 'next/head';
import AudioPlayer from '../components/AudioPlayer';

interface Track {
  id: string;
  name: string;
  url: string;
  cached: boolean;
}

const _getTrackInfo = (): Track[] => {
  const trackInfo = [
    {
      id: '1',
      name: 'Short Track 1',
      url: './media/one-short.mp3',
      cached: false
    },
    {
      id: '2', 
      name: 'Long Track 2',
      url: './media/two-long.mp3',
      cached: false
    },
    {
      id: '3', 
      name: 'Long Track 3',
      url: './media/three-long.wav',
      cached: false
    }
  ];

  // Add the tracks from the noize archive - https://web.archive.org/web/20200830023255/https://noize.ml/
  const numOfOriginalItems = trackInfo.length
  for (let i = 1; i <= 10; i++) {
    const id = (numOfOriginalItems + i).toString();
    trackInfo.push({
      id,
      name: `Track ${id}`,
      url: `./media/a${i}.mp3`,
      cached: false
    });
  }

  return trackInfo
};

const TRACKS: Track[] = _getTrackInfo()

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>(TRACKS);
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Check online status
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
        <title>Offline MP3 Player</title>
        <meta name="description" content="PWA for playing cached MP3 files offline" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Offline MP3 Player</h1>
            
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

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">How to use:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Click "Cache Offline" to download tracks for offline use</li>
              <li>• Cached tracks will work even when you're offline</li>
              <li>• Install this app to your device for the best experience</li>
              <li>• Replace sample URLs with your own MP3 files</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
