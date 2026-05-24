import { useState } from 'react';
import { ChevronLeft, FileText, Code2, History, Users, GitMerge, ShieldAlert, Loader2 } from "lucide-react";
import { useAstra } from "../../context/AstraContext";

export function MobileDocs() {
  const { setCurrentView, prData, showToast } = useAstra();
  const [generating, setGenerating] = useState(false);
  const [docType, setDocType] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prData) {
      showToast('Open a Pull Request first to generate documentation', 'info');
      return;
    }
    if (!docType) {
      showToast('Select a documentation type first', 'info');
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('/api/generate-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prTitle: prData.title,
          prBody: prData.body || "",
          diff: prData.diff,
        }),
      });
      if (!res.ok) throw new Error('Failed to generate docs');
      const data = await res.json();
      showToast('Documentation generated successfully', 'success');
      setGenerating(false);
    } catch {
      showToast('Error generating documentation', 'error');
      setGenerating(false);
    }
  };

  const docsTypes = [
    { id: 'readme', icon: FileText, title: 'README', desc: 'Project overview' },
    { id: 'api', icon: Code2, title: 'API Docs', desc: 'Endpoints reference' },
    { id: 'changelog', icon: History, title: 'Changelog', desc: 'Version history' },
    { id: 'contributing', icon: Users, title: 'Contributing', desc: 'Guide for devs' },
    { id: 'architecture', icon: GitMerge, title: 'Architecture', desc: 'System design' },
    { id: 'security', icon: ShieldAlert, title: 'Security', desc: 'Security policy' }
  ];

  return (
    <div className="flex flex-col bg-[#FDFCFB] min-h-dvh h-full relative overflow-y-auto pb-32">
      <header className="sticky top-0 px-5 py-4 flex items-center bg-[#FDFCFB] z-10 text-[#1C1C1E]">
         <button onClick={() => setCurrentView('dashboard')} className="p-1 -ml-1"><ChevronLeft size={24} /></button>
         <h1 className="ml-2 font-bold text-[15px] flex-1 text-center pr-6">Documentation</h1>
      </header>

      <div className="px-5 mt-4 flex flex-col flex-1">
         <h2 className="text-[15px] font-bold text-[#1C1C1E] mb-4">Select type</h2>
         
         <div className="grid grid-cols-2 gap-3 mb-6">
            {docsTypes.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDocType(d.id)}
                  className={`bg-white p-5 rounded-2xl border flex flex-col items-center justify-center text-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-95 transition-all ${docType === d.id ? 'border-[#B89C85] bg-[#FAF9F6]' : 'border-[#F0EFEB]'}`}
                >
                   <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] flex items-center justify-center border border-[#F0EFEB]">
                      <d.icon size={22} className="text-[#A68A73]" strokeWidth={1.5} />
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="font-bold text-[13px] text-[#1C1C1E]">{d.title}</span>
                      <span className="text-[11px] text-[#8E8E93] mt-1">{d.desc}</span>
                   </div>
                </button>
            ))}
         </div>

         <div className="mt-auto pt-6">
             <button
               onClick={handleGenerate}
               disabled={generating}
               className="w-full bg-[#1C1C1E] text-white rounded-2xl py-4 font-semibold text-[15px] flex items-center justify-center active:scale-[0.98] transition-transform disabled:opacity-50"
             >
                {generating ? <Loader2 size={18} className="animate-spin" /> : 'Generate Documentation'}
             </button>
         </div>
      </div>
    </div>
  );
}
