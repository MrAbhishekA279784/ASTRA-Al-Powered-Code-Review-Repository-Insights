import { Sparkles, FileText, Send, X } from "lucide-react";
import { useState } from "react";
import { useAstra } from "../context/AstraContext";
import { fetchJson } from "../lib/fetch-json";

function ScoreGauge({ score }: { score: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="var(--color-astra-border)"
          strokeWidth="6"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="url(#gradient-purple)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-astra-purple-light)" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-astra-text font-mono leading-none tracking-tight">{score}</span>
        <span className="text-[10px] text-astra-muted font-mono leading-none mt-1">/100</span>
      </div>
    </div>
  );
}

function DocItem({ title, subtext }: { title: string, subtext: string }) {
  return (
    <div className="flex items-center justify-between group py-2 border-b border-astra-hover last:border-0">
      <div className="flex items-start gap-4">
        <div className="flex flex-col font-sans">
          <span className="text-[11px] uppercase tracking-widest text-astra-text font-bold mb-1">{title}</span>
          <span className="text-[10px] text-astra-tertiary italic font-serif">{subtext}</span>
        </div>
      </div>
      <button className="px-3 py-1.5 bg-transparent border border-astra-border hover:bg-astra-text hover:text-astra-elevated transition-colors text-[9px] uppercase tracking-widest font-bold text-astra-text opacity-0 group-hover:opacity-100 focus:opacity-100">
        Preview
      </button>
    </div>
  );
}

export function PrRightPanel() {
  const { prData, reviewData, chatHistory, setChatHistory } = useAstra();
  const [chatMessage, setChatMessage] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<string | null>(null);

  const handleChat = async () => {
    if (!chatMessage.trim() || isChatting) return;
    const msg = chatMessage;
    setChatMessage("");
    setIsChatting(true);
    setChatHistory((prev) => [...prev, { role: "user", content: msg }]);

    try {
      const data = await fetchJson("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          diff: prData?.diff,
          prData: { title: prData?.title, repo: prData?.repo },
          history: chatHistory
        })
      });
      setChatHistory((prev) => [...prev, { role: "model", content: data.text }]);
    } catch (e) {
      console.error("[ASTRA] Chat error:", e);
      setChatHistory((prev) => [...prev, { role: "model", content: "Error communicating with AI." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const generateDocs = async () => {
    setIsGeneratingDocs(true);
    try {
      const data = await fetchJson("/api/generate-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prTitle: prData?.title,
          prBody: prData?.body || "",
          diff: prData?.diff
        })
      });
      setGeneratedDocs(data.markdown);
    } catch (e) {
      console.error("[ASTRA] Docs error:", e);
      setGeneratedDocs("Error generating documentation.");
    } finally {
      setIsGeneratingDocs(false);
    }
  };

  if (!prData || !reviewData) return null;

  return (
    <div className="flex flex-col gap-8 w-[332px]">
      
      {/* AI Summary */}
      <div className="flex flex-col gap-5 p-6 rounded-none border border-astra-border bg-astra-elevated">
        <div className="flex items-center gap-2 border-b border-astra-border pb-3">
          <h3 className="font-sans text-[10px] uppercase font-black tracking-[0.2em] text-astra-text">AI Summary</h3>
        </div>
        <p className="text-sm font-serif text-astra-tertiary leading-[1.65] italic border-l-2 border-astra-purple-light pl-4 py-1">
          "{reviewData.summary || "No summary provided."}"
        </p>
        <div className="flex flex-col gap-3 mt-2 font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-astra-hover text-[11px] uppercase tracking-widest font-bold">
            <div className="flex items-center gap-2 text-astra-muted">Files changed</div>
            <span className="text-astra-text font-mono">{prData.changedFiles}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-astra-hover text-[11px] uppercase tracking-widest font-bold">
            <div className="flex items-center gap-2 text-astra-muted">Additions</div>
            <span className="text-astra-success font-mono">+{prData.additions}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-astra-hover text-[11px] uppercase tracking-widest font-bold">
            <div className="flex items-center gap-2 text-astra-muted">Deletions</div>
            <span className="text-astra-critical font-mono">-{prData.deletions}</span>
          </div>
          <div className="flex justify-between items-center pt-1 text-[11px] uppercase tracking-widest font-bold">
            <div className="flex items-center gap-2 text-astra-muted">Impact</div>
            <span className="px-2 py-1 text-[9px] bg-astra-purple-bg text-astra-purple-light border border-astra-border">
              {reviewData.qualityScore?.overall < 70 ? 'High' : 'Medium'}
            </span>
          </div>
        </div>
      </div>

      {/* Code Quality Score */}
      <div className="flex flex-col gap-4 p-6 rounded-none border border-astra-border bg-astra-elevated">
        <div className="flex items-center gap-2 border-b border-astra-border pb-3">
          <h3 className="font-sans text-[10px] uppercase font-black tracking-[0.2em] text-astra-text">Quality Score</h3>
        </div>
        
        <div className="flex items-center gap-6 pt-2">
          <ScoreGauge score={reviewData.qualityScore?.overall || 0} />
          <div className="flex flex-col gap-3 flex-1 font-sans">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
              <span className="text-astra-muted">Maintain</span>
              <span className="font-mono text-astra-success">{reviewData.qualityScore?.maintainability || 0}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
              <span className="text-astra-muted">Read</span>
              <span className="font-mono text-astra-success">{reviewData.qualityScore?.readability || 0}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
              <span className="text-astra-muted">Perform</span>
              <span className="font-mono text-astra-major">{reviewData.qualityScore?.performance || 0}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
              <span className="text-astra-muted">Secure</span>
              <span className="font-mono text-astra-critical">{reviewData.qualityScore?.security || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div className="flex flex-col gap-4 p-6 rounded-none border border-astra-border bg-astra-elevated relative">
        <div className="flex items-center gap-2 pb-3 border-b border-astra-border">
          <h3 className="font-sans text-[10px] uppercase font-black tracking-[0.2em] text-astra-text">Documentation</h3>
        </div>
        
        {generatedDocs ? (
           <div className="relative">
             <button onClick={() => setGeneratedDocs(null)} className="absolute top-0 right-0 p-1 bg-astra-hover hover:bg-astra-border"><X size={12} /></button>
             <div className="max-h-[200px] overflow-y-auto no-scrollbar font-sans text-[11px] leading-relaxed whitespace-pre-wrap">{generatedDocs}</div>
           </div>
        ) : (
          <>
            <div className="flex flex-col">
              <DocItem title="README Updates" subtext="Changes suggested" />
              <DocItem title="API Documentation" subtext="Endpoints documented" />
            </div>
            <button 
              onClick={generateDocs}
              disabled={isGeneratingDocs}
              className="w-full mt-4 py-3 bg-transparent hover:bg-astra-text hover:text-astra-elevated border border-astra-text text-astra-text text-[10px] uppercase tracking-[0.2em] font-bold transition-colors font-sans flex items-center justify-center disabled:opacity-50"
            >
              {isGeneratingDocs ? "Generating..." : "Generate Full Documentation"}
            </button>
          </>
        )}
      </div>

      {/* ASTRA Chat */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1 border-b border-astra-border pb-2">
          <h3 className="font-sans text-[10px] uppercase font-black tracking-[0.2em] text-astra-text">ASTRA Chat</h3>
        </div>
        
        {chatHistory.length > 0 && (
          <div className="flex flex-col gap-3 font-sans text-[12px] max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
             {chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className={`px-3 py-2 border ${msg.role === 'user' ? 'bg-astra-text text-astra-elevated border-astra-text' : 'bg-astra-elevated text-astra-text border-astra-border'}`}>
                    {msg.content}
                  </span>
                </div>
             ))}
          </div>
        )}

        <div className="relative font-sans">
          <textarea 
            placeholder="Ask anything about this PR..." 
            className="w-full bg-astra-elevated border border-astra-border rounded-none p-4 pr-12 text-sm resize-none focus:outline-none focus:border-astra-purple focus:ring-1 focus:ring-astra-purple/30 text-astra-text placeholder:text-astra-tertiary transition-all no-scrollbar italic placeholder:font-serif"
            rows={3}
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 handleChat();
              }
            }}
          ></textarea>
          <button 
            className="absolute bottom-4 right-4 p-2 bg-transparent border border-astra-border hover:bg-astra-text hover:text-astra-elevated text-astra-text transition-colors disabled:opacity-50"
            onClick={handleChat}
            disabled={isChatting || !chatMessage.trim()}
          >
            {isChatting ? <span className="w-3.5 h-3.5 block border-2 border-t-transparent flex items-center justify-center animate-spin rounded-full"></span> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

    </div>
  );
}
