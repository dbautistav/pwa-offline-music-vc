import { useState, useRef, useEffect } from 'react';

interface Track {
  id: string;
  name: string;
  url: string;
  cached: boolean;
}

interface AudioPlayerProps {
  tracks: Track[];
  onCacheTrack: (track: Track) => void;
}

export default function AudioPlayer({ tracks, onCacheTrack }: AudioPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play();
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <audio ref={audioRef} />
      
      {/* Track List */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Tracks</h2>
        <div className="space-y-2">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                currentTrack?.id === track.id 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => playTrack(track)}
                  className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full hover:bg-blue-400"
                >
                  {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
                </button>
                <span>{track.name}</span>
                {track.cached && (
                  <span className="text-green-400 text-sm">📱 Cached</span>
                )}
              </div>
              
              {!track.cached && (
                <button
                  onClick={() => onCacheTrack(track)}
                  className="px-3 py-1 bg-green-600 text-sm rounded hover:bg-green-500"
                >
                  Cache Offline
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Player Controls */}
      {currentTrack && (
        <div className="border-t border-gray-600 pt-4">
          <div className="mb-4">
            <h3 className="font-semibold">{currentTrack.name}</h3>
            {isLoading && <p className="text-sm text-gray-400">Loading...</p>}
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full cursor-pointer"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                  onClick={(e) => {
                    const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const width = rect.width;
                    const newTime = (clickX / width) * duration;
                    seek(newTime);
                  }}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => seek(Math.max(0, currentTime - 10))}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              ⏪ 10s
            </button>
            <button
              onClick={() => isPlaying ? pauseTrack() : audioRef.current?.play()}
              className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button
              onClick={() => seek(Math.min(duration, currentTime + 10))}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              10s ⏩
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
