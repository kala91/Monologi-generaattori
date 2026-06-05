
import React, { useState, useCallback, useRef } from 'react';
import { GameState, ChatMessage, MessageRole, GameStep } from './types';
import { startNewGame, processGameStep } from './geminiService';
import Header from './components/Header';
import StateDisplay from './components/StateDisplay';
import ChatLog from './components/ChatLog';

const App: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [worldState, setWorldState] = useState<GameState>({
    characters: [],
    locations: [],
    items: [],
    currentDramaAnalysis: ''
  });
  const [inputText, setInputText] = useState('');
  
  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    try {
      const setup = await startNewGame(idea);
      const initialMessage: ChatMessage = {
        id: 'initial',
        role: MessageRole.SYSTEM,
        text: `${setup.worldDescription}\n\n${setup.characterProfile}\n\n${setup.initialSituation}`,
        timestamp: Date.now()
      };
      
      setMessages([initialMessage]);
      setWorldState(setup.initialState);
      setGameStarted(true);
    } catch (err) {
      console.error(err);
      alert("Pelin alustus epäonnistui. Tarkista API-avain.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (loading) return;
    setLoading(true);

    const historyText = messages.map(m => `${m.role}: ${m.text}`).join('\n');
    const correction = inputText.trim();
    
    // If user typed something, add it to chat as a "correction" first
    if (correction) {
      const correctionMsg: ChatMessage = {
        id: `correction-${Date.now()}`,
        role: MessageRole.PLAYER,
        text: correction,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, correctionMsg]);
      setInputText('');
    }

    try {
      const step: GameStep = await processGameStep(historyText, worldState, correction || undefined);
      
      const directorMsg: ChatMessage = {
        id: `step-${Date.now()}`,
        role: MessageRole.DIRECTOR,
        text: step.content,
        mechanic: step.mechanic,
        dynamic: step.dynamic,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, directorMsg]);
      setWorldState(step.worldState);
    } catch (err) {
      console.error(err);
      alert("Seuraavan vaiheen luominen epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full space-y-8 animate-in fade-in duration-700">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-serif text-zinc-100 tracking-tight">Dramaturgi</h1>
            <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Monologi-LARP Generaattori</p>
          </div>
          
          <form onSubmit={handleStart} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-zinc-600 font-mono ml-1">Syötä pelin siemen tai idea</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Esim. 'Eristäytynyt majakanvartija, joka löytää rannalta puhuvan radion maailmanlopun jälkeen...'"
                className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-900/50 focus:border-red-900 transition-all resize-none font-serif text-lg leading-relaxed"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="uppercase tracking-widest text-xs">Aseta näyttämö</span>
                </>
              )}
            </button>
          </form>
          
          <div className="text-[10px] text-zinc-700 text-center uppercase tracking-widest font-mono max-w-xs mx-auto">
            Inspiroitunut Jeepformista & Dramaturgisesta Taksonomiasta
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Chat Area */}
        <div className="flex-1 flex flex-col relative border-r border-zinc-900">
          <ChatLog messages={messages} />
          
          {/* Bottom Controls */}
          <div className="p-6 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 space-y-4">
            <div className="relative group">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                placeholder="Lisää kontekstia tai korjaa suuntaa (valinnainen)..."
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all text-sm font-sans"
              />
              {inputText && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-blue-500 font-mono uppercase tracking-widest animate-pulse">
                  Korjaus aktiivinen
                </span>
              )}
            </div>

            <button
              onClick={handleNextStep}
              disabled={loading}
              className={`
                w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]
                ${loading 
                  ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.2)] hover:shadow-[0_0_35px_rgba(220,38,38,0.3)]'
                }
              `}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-xl font-serif tracking-tight">And then...</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-zinc-600 uppercase tracking-[0.2em] font-mono">
              Pelaa ääneen kaikki ruudulla näkyvät ohjaajan syötteet
            </p>
          </div>
        </div>

        {/* Right: State Sidebar */}
        <aside className="w-80 bg-zinc-950 p-6 hidden lg:block overflow-hidden flex flex-col">
          <StateDisplay state={worldState} />
        </aside>
      </main>
    </div>
  );
};

export default App;
