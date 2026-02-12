
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home' },
    { id: 'discover', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'AI Discovery' },
    { id: 'library', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', label: 'Your Library' },
  ];

  return (
    <div className="w-64 bg-black h-full flex flex-col border-r border-zinc-800 hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.135A3.235 3.235 0 005 14a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V8.636l9-1.8V11.2a3.235 3.235 0 00-1 0a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V3z" /></svg>
          </div>
          <span className="text-xl font-bold tracking-tight">VibeStream</span>
        </div>

        <nav className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 w-full px-3 py-2 rounded-md transition-colors ${
                activeTab === item.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-4 border border-zinc-700">
          <p className="text-xs font-semibold text-[#1DB954] uppercase mb-1">Expert Curation</p>
          <p className="text-sm text-zinc-300">Explore the world's largest music catalog with VibeStream.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
