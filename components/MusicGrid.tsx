
import React from 'react';
import { Track } from '../types';

interface MusicGridProps {
  tracks: Track[];
  onTrackSelect: (track: Track) => void;
  currentTrack: Track | null;
}

const MusicGrid: React.FC<MusicGridProps> = ({ tracks, onTrackSelect, currentTrack }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {tracks.map((track) => (
        <div 
          key={track.id} 
          onClick={() => onTrackSelect(track)}
          className={`group bg-zinc-900/40 p-4 rounded-lg hover:bg-zinc-800/60 transition-all cursor-pointer relative ${
            currentTrack?.id === track.id ? 'bg-zinc-800/80 ring-1 ring-[#1DB954]' : ''
          }`}
        >
          <div className="relative mb-4 aspect-square">
            <img 
              src={track.coverUrl} 
              alt={track.title} 
              className="w-full h-full object-cover rounded-md shadow-2xl" 
            />
            <button 
              className={`absolute bottom-2 right-2 w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ${
                currentTrack?.id === track.id ? 'opacity-100' : ''
              }`}
            >
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
          </div>
          <div>
            <h3 className="font-bold text-base truncate mb-1">{track.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MusicGrid;
