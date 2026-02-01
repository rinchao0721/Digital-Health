import React, { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw, Bot } from 'lucide-react';

const ChatHeader = ({ onReset }) => (
  <div className="absolute top-0 left-0 right-0 p-5 flex items-center justify-between z-10 shrink-0 pointer-events-none">
    <div className="flex items-center gap-3 pointer-events-auto">
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
         <Bot size={18} className="text-[#00210E]" />
      </div>
      <div>
         <div className="font-bold text-[#00210E] text-sm">Hiyori 助手</div>
         <div className="text-[10px] text-[#006C4C] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> 在线
         </div>
      </div>
    </div>
    <button
      onClick={onReset}
      className="w-8 h-8 flex items-center justify-center text-[#006C4C] opacity-60 hover:opacity-100 hover:bg-[#006C4C]/10 rounded-full transition-all pointer-events-auto"
      title="重置对话"
    >
      <RefreshCw size={16} />
    </button>
  </div>
);

const ChatInput = ({ input, setInput, handleSend, loading }) => (
  <div className="absolute bottom-0 left-0 right-0 p-4 shrink-0 z-10 pointer-events-none">
    <div className="flex items-center gap-2 bg-[#F7FBF7]/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg shadow-[#00210E]/5 focus-within:ring-2 focus-within:ring-[#006C4C]/20 transition-all border border-white/50 pointer-events-auto">
       <input
          className="flex-1 bg-transparent px-2 py-1 text-xs text-[#191C1A] placeholder-[#404943]/60 focus:outline-none"
          placeholder="给 Hiyori 发消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
       />
       <button
          onClick={handleSend}
          disabled={loading || !input}
          className="w-7 h-7 bg-[#006C4C] rounded-full flex items-center justify-center text-white hover:bg-[#005239] disabled:opacity-50 transition-colors shadow-sm"
       >
          <Send size={12} />
       </button>
    </div>
  </div>
);

const ChatMessages = ({ messages, loading, scrollRef }) => (
  <div className="flex-1 overflow-y-auto p-4 pt-20 pb-20 space-y-4 no-scrollbar" ref={scrollRef}>
    {messages.map((m, i) => (
       <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start items-end gap-2'}`}>
          {m.role !== 'user' && (
             <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[10px] font-bold text-[#00210E]">H</div>
          )}
          <div className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed shadow-sm relative group/bubble ${
             m.role === 'user'
                ? 'bg-[#006C4C] text-white rounded-[16px] rounded-br-none'
                : 'bg-[#F7FBF7] text-[#191C1A] rounded-[16px] rounded-bl-none'
          }`}>
             {m.text}
          </div>
       </div>
    ))}
    {loading && (
       <div className="flex justify-start ml-8">
           <div className="bg-[#F7FBF7]/60 px-3 py-1.5 rounded-full text-xs text-[#00210E] flex items-center gap-2">
              <RefreshCw size={10} className="animate-spin"/> 正在输入...
           </div>
       </div>
    )}
  </div>
);

export default function AiChatWidget({ dashboard, apps, onReset }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '欧尼酱，这次我把东西都收纳好了，是不是整齐多啦？\n左边是数据，右边是我，清清楚楚！' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleInternalReset = () => {
    if (onReset) {
      onReset();
    } else {
      setMessages([{ role: 'assistant', text: '欧尼酱，让我们重新开始吧！' }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setLoading(true);

    const apiKey = "AIzaSyA8c7mNeTD9I5FS52-iS6YhHDXkocaTEJY";

    const contextData = {
      totalTime: dashboard?.totalTime || "0h 0m",
      score: dashboard?.score || 0,
      unlocks: dashboard?.unlocks || 0,
      topApps: apps?.slice(0, 5).map(app => `${app.name}: ${app.time}`).join(", ") || "None"
    };

    const prompt = `
      Persona: Izumi Hiyori (Younger sister, voice actress, takes care of brother).
      User: Onii-chan.
      Context:
      - Today's Total PC Usage: ${contextData.totalTime}
      - Health Score: ${contextData.score}
      - Phone Unlocks: ${contextData.unlocks}
      - Top Apps Used: ${contextData.topApps}

      Tone: Casual Chinese, caring but teasing.
      Instructions: Use the provided context to comment on his habits if relevant (e.g., if usage is high, tell him to rest; if playing games, tease him).
      User said: "${userMsg}"
    `;

    try {
      if (!apiKey) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessages(prev => [...prev, { role: 'assistant', text: "欧尼酱，你还没有设置 API Key 呢，快去代码里填一下吧！" }]);
        return;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Hiyori 没听清...";
      setMessages(prev => [...prev, { role: 'assistant', text: text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Hiyori 断线了..." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#BCECE0]/20 backdrop-blur-sm relative group">
       <ChatHeader onReset={handleInternalReset} />
       <ChatMessages messages={messages} loading={loading} scrollRef={scrollRef} />
       <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          loading={loading}
       />
    </div>
  );
}
