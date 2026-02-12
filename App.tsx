
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import DiscoverView from './components/DiscoverView';
import MusicGrid from './components/MusicGrid';
import LyricsView from './components/LyricsView';
import { Track } from './types';
import { fetchDeezerPlaylist, fetchDeezerArtistTopTracks, fetchDeezerAlbum, fetchDeezerSearch } from './services/deezerService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [playlistTracks, artistTracks, albumTracks] = await Promise.all([
          fetchDeezerPlaylist('908622995'),
          fetchDeezerArtistTopTracks('27'),
          fetchDeezerAlbum('302127')
        ]);

        const allLoaded = [...playlistTracks, ...artistTracks, ...albumTracks];
        const uniqueTracks = Array.from(new Map(allLoaded.map(item => [item['id'], item])).values());
        
        setTracks(uniqueTracks);
        setFeaturedTracks(artistTracks);
        if (uniqueTracks.length > 0) {
          setCurrentTrack(uniqueTracks[0]);
        }
      } catch (err) {
        console.error("Failed to load Deezer data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setSearching(true);
        const results = await fetchDeezerSearch(searchQuery);
        setSearchResults(results);
        setSearching(false);
        setActiveTab('search');
      } else if (activeTab === 'search') {
        setActiveTab('home');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setHeaderOpacity(Math.min(scrollTop / 200, 1));
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // If selecting from search, we might want to add it to the general pool for Next/Prev
    if (!tracks.find(t => t.id === track.id)) {
      setTracks(prev => [track, ...prev]);
    }
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
    setIsPlaying(true);
  };

  const toggleLike = (id: string) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, isLiked: !t.isLiked } : t));
    if (currentTrack?.id === id) {
      setCurrentTrack(prev => prev ? { ...prev, isLiked: !prev.isLiked } : null);
    }
  };

  const likedSongs = tracks.filter(t => t.isLiked);

  return (
    <div className="flex h-screen w-full bg-[#000] text-white overflow-hidden font-sans select-none">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto relative pb-32" onScroll={handleScroll}>
        <header 
          className="sticky top-0 left-0 right-0 z-40 h-16 flex items-center px-8 backdrop-blur-md transition-all duration-300"
          style={{ backgroundColor: `rgba(18, 18, 18, ${headerOpacity})`, borderBottom: headerOpacity > 0.5 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
        >
          <div className="flex items-center gap-8 flex-1">
             <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent cursor-pointer" onClick={() => setActiveTab('home')}>VibeStream</span>
             
             <div className="relative max-w-md w-full group">
               <input 
                 type="text" 
                 placeholder="Search for artists, songs, or albums..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-zinc-900/60 border border-zinc-800 rounded-full py-2 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
               />
               <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               {searching && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>}
             </div>
          </div>

          <div className="ml-auto flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {loading ? 'Syncing Catalog' : 'Catalog Live'}
              </span>
            </div>
            <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold border border-zinc-700 hover:scale-110 transition-transform cursor-pointer">D</div>
          </div>
        </header>

        <div className="px-8 pt-4">
          {activeTab === 'home' && (
            <div className="space-y-12 animate-in fade-in duration-1000">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                  <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-zinc-500 font-medium animate-pulse">Initializing VibeStream...</p>
                </div>
              ) : (
                <>
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-4xl font-black tracking-tighter">Featured Rotation</h2>
                        <p className="text-zinc-500 font-medium">Top picks for you today</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredTracks.slice(0, 6).map(track => (
                        <div 
                          key={track.id}
                          onClick={() => handleTrackSelect(track)}
                          className={`group flex items-center p-3 bg-zinc-900/40 hover:bg-zinc-800/80 transition-all rounded-2xl cursor-pointer border ${currentTrack?.id === track.id ? 'border-green-500/50 bg-zinc-800/60 shadow-xl shadow-green-900/10' : 'border-zinc-800/50'}`}
                        >
                          <div className="relative overflow-hidden rounded-xl shadow-xl">
                            <img src={track.coverUrl} className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                            {currentTrack?.id === track.id && isPlaying && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="flex gap-1 items-end h-4">
                                  <div className="w-1 bg-green-500 animate-[bounce_0.6s_infinite]"></div>
                                  <div className="w-1 bg-green-500 animate-[bounce_0.8s_infinite]"></div>
                                  <div className="w-1 bg-green-500 animate-[bounce_0.5s_infinite]"></div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 px-4 truncate">
                            <p className="font-bold truncate group-hover:text-green-400 transition-colors">{track.title}</p>
                            <p className="text-xs text-zinc-500 mt-1">{track.artist}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <span>Trending Globally</span>
                      <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-mono uppercase tracking-widest">Live Updates</span>
                    </h2>
                    <MusicGrid tracks={tracks} onTrackSelect={handleTrackSelect} currentTrack={currentTrack} />
                  </section>
                </>
              )}
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h2 className="text-4xl font-black tracking-tight">Search Results for "{searchQuery}"</h2>
                <button onClick={() => { setSearchQuery(''); setActiveTab('home'); }} className="text-sm font-bold text-zinc-400 hover:text-white">Clear Results</button>
              </div>
              {searchResults.length > 0 ? (
                <MusicGrid tracks={searchResults} onTrackSelect={handleTrackSelect} currentTrack={currentTrack} />
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                  <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <p className="text-xl font-medium">No tracks found. Try a different search.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'discover' && <DiscoverView onTrackSelect={handleTrackSelect} currentTrack={currentTrack} />}

          {activeTab === 'library' && (
             <div className="py-10 animate-in fade-in duration-500">
                <div className="mb-10 flex items-end gap-6">
                  <div className="w-48 h-48 bg-gradient-to-br from-green-600 to-emerald-900 rounded-2xl shadow-2xl flex items-center justify-center">
                    <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-2 text-zinc-400">Personal Vault</p>
                    <h2 className="text-6xl font-black tracking-tighter mb-4">Your Library</h2>
                    <p className="text-zinc-500 font-medium">{likedSongs.length} tracks collection</p>
                  </div>
                </div>
                {likedSongs.length > 0 ? (
                  <MusicGrid tracks={likedSongs} onTrackSelect={handleTrackSelect} currentTrack={currentTrack} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-3xl border border-zinc-800 border-dashed">
                    <p className="text-zinc-500">Start liking tracks to build your collection here.</p>
                  </div>
                )}
             </div>
          )}
        </div>
      </main>

      {currentTrack && (
        <Player 
          currentTrack={currentTrack} 
          isPlaying={isPlaying} 
          setIsPlaying={setIsPlaying}
          onToggleLike={() => toggleLike(currentTrack.id)}
          onNext={handleNext}
          onPrev={handlePrev}
          onToggleLyrics={() => setShowLyrics(!showLyrics)}
        />
      )}

      {showLyrics && currentTrack && (
        <LyricsView track={currentTrack} onClose={() => setShowLyrics(false)} />
      )}
    </div>
  );
};

export default App;
