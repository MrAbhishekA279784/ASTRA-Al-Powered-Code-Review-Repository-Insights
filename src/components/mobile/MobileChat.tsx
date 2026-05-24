import { ChevronLeft, MoreHorizontal, Paperclip, SendHorizontal, Sparkles } from "lucide-react";
import { useAstra } from "../../context/AstraContext";
import { useState } from "react";

export function MobileChat() {
  const { setCurrentView, chatHistory } = useAstra();
  const [msg, setMsg] = useState('');

  return (
    <div className="flex flex-col bg-[#FDFCFB] h-full relative">
      <header className="sticky top-0 px-5 py-4 flex items-center justify-between border-b border-[#F0EFEB] bg-[#FDFCFB] z-10">
         <button onClick={() => setCurrentView('pr')} className="p-1 -ml-1"><ChevronLeft size={24} className="text-[#1C1C1E]" /></button>
         <h1 className="font-bold text-[15px] text-[#1C1C1E]">AI Assistant</h1>
         <button className="p-1 -mr-1"><MoreHorizontal size={20} className="text-[#1C1C1E]" /></button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-28">
         {chatHistory.length === 0 ? (
            <div className="flex flex-col gap-6">
                {/* Simulated existing conversation based on reference */}
                <div className="flex flex-col items-end gap-1 mb-2">
                   <div className="bg-white border border-[#F0EFEB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4 rounded-2xl rounded-tr-sm text-[#1C1C1E] text-[14px] leading-relaxed max-w-[85%]">
                     Can you review the authentication logic in this PR?
                   </div>
                   <span className="text-[10px] font-semibold text-[#8E8E93] mr-1">10:30 AM</span>
                </div>

                <div className="flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-[12px]">
                      A
                   </div>
                   <div className="flex flex-col items-start gap-1 flex-1">
                      <div className="bg-[#FAF9F6] border border-[#F0EFEB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4 rounded-2xl rounded-tl-sm text-[#1C1C1E] text-[14px] leading-relaxed w-full">
                        <p className="mb-4">I've reviewed the authentication logic. Here are the key points:</p>
                        <ul className="list-disc pl-4 space-y-2 mb-4">
                           <li>Good use of httpOnly cookies</li>
                           <li>Consider adding rate limiting</li>
                           <li>Error messages can be more specific</li>
                           <li>Token expiration is not handled</li>
                        </ul>
                        <button onClick={() => setCurrentView('ai-review')} className="w-full py-3 bg-white border border-[#F0EFEB] rounded-xl text-[13px] font-bold text-[#1C1C1E] shadow-sm active:scale-95 transition-transform">
                           View Detailed Analysis &gt;
                        </button>
                      </div>
                      <span className="text-[10px] font-semibold text-[#8E8E93] ml-1">10:31 AM</span>
                   </div>
                </div>
            </div>
         ) : (
            <div className="flex flex-col gap-6">
               {chatHistory.map((c, i) => (
                   <div key={i} className={`flex items-start gap-3 ${c.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {c.role === 'assistant' && (
                         <div className="w-8 h-8 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-[12px]">
                            A
                         </div>
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
               placeholder="Ask anything about this PR..."
               className="w-full bg-[#F5F4F1] border-none rounded-full py-3.5 pl-4 pr-20 text-[14px] text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none shadow-inner"
            />
            <div className="absolute right-2 flex items-center gap-1">
               <button className="p-1.5 text-[#8E8E93]"><Paperclip size={18} /></button>
               <button className="p-1.5 text-[#B89C85]"><SendHorizontal size={18} /></button>
            </div>
         </div>
      </div>
    </div>
  );
}
