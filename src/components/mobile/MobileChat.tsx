import { ChevronLeft, MoreHorizontal, SendHorizontal } from "lucide-react";
import { useAstra } from "../../context/AstraContext";
import { fetchJson } from "../../lib/fetch-json";
import { useState, KeyboardEvent } from "react";

export function MobileChat() {
  const { setCurrentView, chatHistory, setChatHistory, prData, showToast } = useAstra();
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!msg.trim() || sending) return;
    const message = msg;
    setMsg('');
    setSending(true);
    setChatHistory((prev) => [...prev, { role: 'user', content: message }]);

    try {
      const data = await fetchJson('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          diff: prData?.diff,
          prData: { title: prData?.title, repo: prData?.repo },
          history: chatHistory,
        }),
      });
      setChatHistory((prev) => [...prev, { role: 'assistant', content: data.text || data.response || 'No response' }]);
    } catch (e: any) {
      showToast(e.message || 'Chat error', 'error');
      setChatHistory((prev) => [...prev, { role: 'assistant', content: 'Error communicating with AI.' }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col bg-[#FDFCFB] h-full relative">
      <header className="sticky top-0 px-5 py-4 flex items-center justify-between border-b border-[#F0EFEB] bg-[#FDFCFB] z-10">
        <button onClick={() => setCurrentView('pr')} className="p-1 -ml-1"><ChevronLeft size={24} className="text-[#1C1C1E]" /></button>
        <h1 className="font-bold text-[15px] text-[#1C1C1E]">AI Assistant</h1>
        <button className="p-1 -mr-1"><MoreHorizontal size={20} className="text-[#1C1C1E]" /></button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-28">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-14 h-14 rounded-full bg-[#FAF9F6] border border-[#F0EFEB] flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-[#1C1C1E]">A</span>
            </div>
            <h3 className="text-[15px] font-bold text-[#1C1C1E] mb-2">Ask ASTRA</h3>
            <p className="text-[13px] text-[#8E8E93] leading-relaxed">
              Ask questions about the current pull request. Get code explanations, suggestions, and more.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {chatHistory.map((c, i) => (
              <div key={i} className={`flex items-start gap-3 ${c.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {c.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-[12px]">A</div>
                )}
                <div className={`p-4 rounded-2xl text-[14px] leading-relaxed max-w-[85%] shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${c.role === 'user' ? 'bg-white border border-[#F0EFEB] rounded-tr-sm text-[#1C1C1E]' : 'bg-[#FAF9F6] border border-[#F0EFEB] rounded-tl-sm text-[#1C1C1E]'}`}>
                  {c.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#FDFCFB] px-5 py-4 pb-safe-offset border-t border-[#F0EFEB] z-20">
        <div className="relative flex items-center">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about this PR..."
            className="w-full bg-[#F5F4F1] border-none rounded-full py-3.5 pl-4 pr-14 text-[14px] text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none shadow-inner"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!msg.trim() || sending}
            className="absolute right-2 p-2 text-[#B89C85] disabled:opacity-30 transition-opacity"
          >
            {sending ? (
              <span className="w-4 h-4 border-2 border-[#B89C85] border-t-transparent rounded-full animate-spin block" />
            ) : (
              <SendHorizontal size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
