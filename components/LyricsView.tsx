
import React, { useEffect, useState } from 'react';
import { Track, LyricsData } from '../types';
import { getLyricsAndMeaning } from '../services/geminiService';

interface LyricsViewProps {
  track: Track;
  onClose: () => void;
}

const LyricsView: React.FC<LyricsViewProps> = ({ track, onClose }) => {
  const [data, setData] = useState<LyricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getLyricsAndMeaning(track)
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Lyrics component error:", err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [track]);

  return (
    <div className="fixed inset-0 z-[150] bg-black overflow-y-auto animate-in fade-in duration-300">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-[80px] opacity-20 transition-all duration-700"
          style={{ backgroundImage: `url(${track.coverUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-20">
        {/* Header / Close Button */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-6">
            <img 
              src={track.coverUrl} 
              alt={track.title} 
              className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-xl shadow-2xl ring-1 ring-white/10" 
            />
            <div>
              <h1 className="text-2xl md:text-4xl font-black mb-1 tracking-tighter text-white">{track.title}</h1>
              <p className="text-lg md:text-xl text-zinc-400 font-bold">{track.artist}</p>
              <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest font-black">{track.album}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-90"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Lyrics Section */}
          <div className="lg:col-span-8">
            <h3 className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mb-8">Synchronized Lyrics</h3>
            {loading ? (
              <div className="space-y-6">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-10 bg-zinc-800/30 animate-pulse rounded-lg" 
                    style={{ width: `${Math.random() * 30 + 60}%`, animationDelay: `${i * 150}ms` }}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.lines && data.lines.length > 0 ? (
                  data.lines.map((line, i) => (
                    <p 
                      key={i} 
                      className="text-3xl md:text-5xl font-black text-zinc-700 hover:text-white transition-all cursor-default leading-tight tracking-tight hover:translate-x-1 duration-200"
                    >
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="text-xl text-zinc-500 italic">Finding the right words...</p>
                )}
              </div>
            )}
          </div>

          {/* Meaning & Info Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-8 space-y-8">
              <section className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mb-4">The Story</h3>
                  <p className="text-base text-zinc-300 leading-relaxed font-medium">
                    {loading ? "Discovering history..." : data?.story}
                  </p>
                </div>
                
                <div className="pt-6 border-t border-white/5">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-3 opacity-40">Lyric Insight</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed italic">
                    {loading ? "Interpreting themes..." : data?.meaning}
                  </p>
                </div>
              </section>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-white text-black text-sm font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                Return to Player
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricsView;
