import { useState, useRef, useEffect } from 'react';
import { PaperPlaneRight, Robot, X } from '@phosphor-icons/react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const userId = localStorage.getItem('ipku_user_id');
      const res = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: userMsg })
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || 'Terjadi kesalahan.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Gagal menghubungi server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center z-50"
      >
        <Robot size={28} weight="fill" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl flex flex-col overflow-hidden z-50">
      
      {/* Header */}
      <div className="bg-brand-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Robot size={24} weight="fill" />
          Tanya IPKu AI
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
          <X size={20} weight="bold" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-zinc-50 dark:bg-zinc-950">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 dark:text-zinc-400 text-sm mt-4">
            Halo! Saya asisten akademik Anda. Tanyakan strategi kelulusan atau cara menangani nilai E.
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-bl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-bl-none p-3 text-sm text-zinc-500">
              Mengetik...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          className="p-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl transition-colors"
        >
          <PaperPlaneRight size={20} weight="fill" />
        </button>
      </form>
    </div>
  );
}
