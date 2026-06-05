
import React, { useEffect, useRef } from 'react';
import { ChatMessage, MessageRole } from '../types';

interface ChatLogProps {
  messages: ChatMessage[];
}

const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
      {messages.map((msg) => {
        const isDirector = msg.role === MessageRole.DIRECTOR;
        const isSystem = msg.role === MessageRole.SYSTEM;

        if (isSystem) {
          return (
            <div key={msg.id} className="text-center py-4 border-y border-zinc-900 my-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-mono">Asetelma Alustettu</span>
              <div className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto font-serif italic">
                {msg.text}
              </div>
            </div>
          );
        }

        return (
          <div key={msg.id} className={`flex flex-col ${isDirector ? 'items-start' : 'items-end'}`}>
            <div className={`max-w-[85%] ${isDirector ? 'text-left' : 'text-right'}`}>
              <div className="flex items-center gap-3 mb-2 opacity-50">
                <span className={`text-[10px] uppercase tracking-widest font-mono ${isDirector ? 'text-red-500' : 'text-blue-400'}`}>
                  {isDirector ? 'OHJAAJA' : 'SINÄ (KORJAUS)'}
                </span>
                <span className="text-[10px] text-zinc-600">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className={`
                relative p-4 rounded-xl transition-all duration-300
                ${isDirector 
                  ? 'bg-zinc-900/50 border border-zinc-800 text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' 
                  : 'bg-zinc-800/30 border border-zinc-700 text-zinc-300 italic'
                }
              `}>
                {isDirector && (msg.mechanic || msg.dynamic) && (
                  <div className="flex gap-2 mb-3">
                    {msg.mechanic && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 border border-red-900/50 text-red-400 bg-red-950/20 rounded">
                        [{msg.mechanic.toUpperCase()}]
                      </span>
                    )}
                    {msg.dynamic && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 border border-zinc-700 text-zinc-400 bg-zinc-800/50 rounded">
                        ({msg.dynamic.toLowerCase()})
                      </span>
                    )}
                  </div>
                )}
                
                <p className={`text-base leading-relaxed ${isDirector ? 'font-serif' : 'font-sans'}`}>
                  {msg.text}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatLog;
