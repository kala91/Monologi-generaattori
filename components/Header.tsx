
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
        <h1 className="text-xl font-serif tracking-tight text-zinc-100">
          Dramaturgi <span className="text-zinc-500 font-sans text-xs uppercase tracking-[0.2em] ml-2">Director's Cut</span>
        </h1>
      </div>
      <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
        Monologue LARP System v1.0
      </div>
    </header>
  );
};

export default Header;
