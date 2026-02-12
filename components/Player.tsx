
import React, { useState, useEffect, useRef } from 'react';
import { Track } from '../types';

interface PlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onToggleLike: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleLyrics: () => void;
}

const Player: React.FC<PlayerProps> = ({ 
  currentTrack, isPlaying, setIsPlaying, onToggleLike, onNext, onPrev, onToggleLyrics 
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * duration;
  };

  const progressPercent = (currentTime / duration) * 100 || 0;

  return (
    <div className="h-24 bg-zinc-950/95 border-t border-zinc-800/50 px-6 flex items-center justify-between fixed bottom-0 left-0 right-0 z-[110] backdrop-blur-xl">
      <audio
        ref={audioRef}
        src={currentTrack.previewUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />

      <div className="flex items-center gap-4 w-[30%]">
        <img src={currentTrack.coverUrl} className="w-14 h-14 rounded-lg object-cover shadow-lg" alt="" />
        <div className="truncate">
          <h4 className="text-sm font-bold truncate text-white">{currentTrack.title}</h4>
          <p className="text-xs text-zinc-500 truncate">{currentTrack.artist}</p>
        </div>
        <button onClick={onToggleLike} className={`ml-2 transition-colors ${currentTrack.isLiked ? 'text-green-500' : 'text-zinc-600 hover:text-white'}`}>
          <svg className="w-5 h-5" fill={currentTrack.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 flex-1 max-w-[40%]">
        <div className="flex items-center gap-6">
          <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63a1 1 0 001.555-.832V5.999a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg">
            {isPlaying ? (
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-6 h-6 text-black translate-x-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            )}
          </button>
          <button onClick={onNext} className="text-zinc-400 hover:text-white transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" /></svg></button>
        </div>
        <div className="flex items-center gap-3 w-full group">
          <span className="text-[10px] text-zinc-500 w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
          <div 
            onClick={handleProgressClick}
            className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden relative cursor-pointer"
          >
            <div className="h-full bg-white group-hover:bg-green-500 transition-colors" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <span className="text-[10px] text-zinc-500 w-10 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-5 w-[30%]">
        <button 
          onClick={onToggleLyrics}
          className="text-zinc-400 hover:text-green-500 transition-all flex flex-col items-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span className="text-[8px] font-black uppercase mt-1 tracking-tighter">Lyrics</span>
        </button>
        <div className="flex items-center gap-2 w-32 group">
          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white hover:accent-green-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
