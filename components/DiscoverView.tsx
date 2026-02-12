
import React, { useState } from 'react';
import { Track } from '../types';
import { getMusicDiscovery } from '../services/geminiService';
import MusicGrid from './MusicGrid';

interface DiscoverViewProps {
  onTrackSelect: (track: Track) => void;
  currentTrack: Track | null;
}

const DiscoverView: React.FC<DiscoverViewProps> = ({ onTrackSelect, currentTrack }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; tracks: Track[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await getMusicDiscovery(query);
      setResult(data);
    } catch (err) {
      console.error("Discovery error:", err);
    } finally {
      setLoading(false);
    }
  };

  const presetMoods = [
    "Kenshi Yonezu style J-Pop",
    "Japanese City Pop favorites",
    "Dark synthwave for night drives",
    "Peaceful piano for reading",
    "Upbeat indie folk"
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black mb-4 tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">AI Vibe Curator</h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-2xl leading-relaxed">
            Paste a Spotify link or describe a feeling. Our AI DJ will analyze the aesthetic and build the perfect listening session.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-3xl group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste a Spotify link or type a mood..."
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-5 px-8 pl-16 text-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all backdrop-blur-md"
            />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black font-bold px-8 py-3 rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Curating...</span>
                </div>
              ) : 'Discover'}
            </button>
          </form>

          <div className="mt-8 flex flex-wrap gap-3">
            {presetMoods.map(mood => (
              <button 
                key={mood}
                onClick={() => { setQuery(mood); }}
                className="text-sm font-semibold px-4 py-2 rounded-xl bg-zinc-800/30 hover:bg-zinc-700/50 text-zinc-300 border border-zinc-800 hover:border-zinc-600 transition-all"
              >
                {mood}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-zinc-900/20 backdrop-blur-md p-8 rounded-3xl border border-zinc-800/50 shadow-xl">
            <h3 className="text-xs font-black text-green-500 uppercase tracking-[0.2em] mb-4">AI Interpretation</h3>
            <p className="text-zinc-200 text-xl leading-relaxed italic font-medium">"{result.text}"</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-black">Curated for you</h4>
              <span className="text-zinc-500 text-sm font-medium">{result.tracks.length} tracks generated</span>
            </div>
            <MusicGrid 
              tracks={result.tracks} 
              onTrackSelect={onTrackSelect} 
              currentTrack={currentTrack} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverView;
