
import React from 'react';
import { GameState } from '../types';

interface StateDisplayProps {
  state: GameState;
}

const StateDisplay: React.FC<StateDisplayProps> = ({ state }) => {
  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2">
      <section>
        <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-mono">Maailman tila</h3>
        <div className="space-y-4">
          <div>
            <span className="text-xs text-zinc-400 block mb-1">Hahmot:</span>
            <div className="flex flex-wrap gap-2">
              {state.characters.map((c, i) => (
                <span key={i} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-300">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-zinc-400 block mb-1">Paikat:</span>
            <div className="flex flex-wrap gap-2">
              {state.locations.map((l, i) => (
                <span key={i} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-300">
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-zinc-400 block mb-1">Esineet:</span>
            <div className="flex flex-wrap gap-2">
              {state.items.map((it, i) => (
                <span key={i} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-300">
                  {it}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-6 border-t border-zinc-900">
        <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-mono">Draama-analyysi</h3>
        <p className="text-xs italic leading-relaxed text-zinc-400 font-serif">
          "{state.currentDramaAnalysis}"
        </p>
      </section>
    </div>
  );
};

export default StateDisplay;
