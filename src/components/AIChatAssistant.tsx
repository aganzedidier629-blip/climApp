import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Brain, RefreshCw, User } from 'lucide-react';
import { ChatMessage, WeatherData } from '../types';

interface AIChatAssistantProps {
  currentWeather: WeatherData | null;
}

export default function AIChatAssistant({ currentWeather }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize with welcome message from Shirikano AI
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: "Bonjour ! Je suis votre conseiller climatique Shirikano IA. " + 
                (currentWeather 
                  ? `J'ai pris note de votre environnement actuel à **${currentWeather.city}** (${currentWeather.temperature}°C, ${currentWeather.condition}).`
                  : "Comment puis-je vous aider à optimiser votre style de vie, votre habillement ou vos activités physiques par rapport aux saisons ?"),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, [currentWeather]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Send message
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatHistory,
          currentContext: currentWeather,
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible de joindre le serveur de Shirikano IA.");
      }

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'model',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'model',
          text: "Désolé, j'ai rencontré un problème technique en contactant mon cerveau neural Shirikano. Veuillez réessayer dans quelques instants.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Starter suggestion chips
  const starterChips = currentWeather ? [
    { label: "🥘 Que cuisiner ce soir ?", prompt: "Quelles recettes adaptées et saines puis-je cuisiner ce soir par rapport aux conditions météo actuelles ?" },
    { label: "🏃‍♂️ Puis-je faire du sport dehors ?", prompt: "Est-ce une bonne idée de faire du sport ou du cardio en extérieur avec ce climat actuel ? Quel type de routine ?" },
    { label: "👔 Conseil style vestimentaire", prompt: "Donne-moi des idées de tenues à la fois élégantes et fonctionnelles adaptées à ce temps." },
    { label: "⚠️ Comportements à éviter", prompt: "Quels sont les comportements ou les habitudes les plus néfastes avec ce type de climat pour ma santé ?" }
  ] : [
    { label: "👗 S'habiller en saison des pluies", prompt: "Quels vêtements techniques et de style me conseilles-tu pour faire face à la saison des pluies ?" },
    { label: "🥦 Alimentation d'été", prompt: "Quelle alimentation saine privilégier lors d'un été très ensoleillé ?" },
    { label: "🏋️‍♂️ Routine sport d'hiver", prompt: "Donne-moi une routine d'activités physiques idéales quand il fait très froid à l'extérieur." }
  ];

  return (
    <div className="flex flex-col h-[520px] bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden" id="ai-chat-assistant">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 bg-slate-900/60 border-b border-slate-900 shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800/40 flex items-center justify-center">
            <Brain className="w-4.5 h-4.5 text-teal-400" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-white leading-none">Coach Climate-AI</h3>
            <span className="text-[9px] text-teal-400 font-bold uppercase mt-1 inline-block">Shirikano Cognitive</span>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome',
                role: 'model',
                text: "Conversation réinitialisée. Comment puis-je vous accompagner aujourd'hui ?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            ]);
          }}
          className="text-slate-500 hover:text-teal-400 transition-colors"
          title="Réinitialiser"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((m) => {
          const isModel = m.role === 'model';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[85%] ${isModel ? 'self-start' : 'self-end flex-row-reverse'}`}
            >
              <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] ${
                isModel ? 'bg-teal-950 text-teal-400 border border-teal-800/40' : 'bg-slate-800 text-slate-300'
              }`}>
                {isModel ? <Brain className="w-3 h-3" /> : <User className="w-3 h-3" />}
              </div>
              <div className="flex flex-col gap-1">
                <div className={`rounded-2xl p-3 text-xs leading-relaxed ${
                  isModel 
                    ? 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800/30' 
                    : 'bg-teal-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-teal-500/5'
                }`}>
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className={`text-[8px] text-slate-500 ${isModel ? 'self-start' : 'self-end'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2.5 max-w-[85%] self-start">
            <div className="w-6 h-6 rounded-full bg-teal-950 text-teal-400 border border-teal-800/40 flex items-center justify-center">
              <Brain className="w-3 h-3 animate-bounce" />
            </div>
            <div className="bg-slate-900 rounded-2xl rounded-tl-none px-4 py-3 flex items-center justify-center border border-slate-800/30">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Starter suggestions */}
      {messages.length <= 1 && !isTyping && (
        <div className="px-4 py-2 border-t border-slate-900/30 shrink-0">
          <p className="text-[8px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">Sujets suggérés</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.prompt)}
                className="snap-center bg-slate-900 hover:bg-teal-950/45 hover:border-teal-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300 font-semibold transition-all whitespace-nowrap cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 bg-slate-900/40 border-t border-slate-900 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Posez une question sur votre climat..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 disabled:opacity-55"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 flex items-center justify-center transition-colors shadow-lg shadow-teal-500/10 shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
