import { ChevronLeft, Share, CheckCircle2, AlertTriangle, AlertCircle, ArrowDown } from "lucide-react";
import { useAstra } from "../../context/AstraContext";

export function MobileReview() {
  const { reviewData, setCurrentView } = useAstra();

  if (!reviewData) return null;

  const score = reviewData.qualityScore?.overall || 87;

  return (
    <div className="flex flex-col bg-[#FDFCFB] min-h-dvh h-full relative overflow-y-auto pb-32">
      <header className="sticky top-0 px-5 py-4 flex items-center justify-between z-10 bg-[#FDFCFB]">
         <button onClick={() => setCurrentView('pr')} className="p-1 -ml-1"><ChevronLeft size={24} className="text-[#1C1C1E] cursor-pointer" /></button>
         <h1 className="font-bold text-[15px] text-[#1C1C1E]">AI Review</h1>
         <button className="p-1 -mr-1"><Share size={20} className="text-[#1C1C1E]" /></button>
      </header>

      <div className="px-5 mt-4 flex flex-col gap-8">
        <section>
          <h2 className="text-[15px] font-bold text-[#1C1C1E] mb-3">Summary</h2>
          <div className="bg-[#FAF9F6] border border-[#F0EFEB] rounded-2xl p-5 text-[#1C1C1E] text-[14px] leading-relaxed shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            {reviewData.summary || "This PR improves authentication flow by adding secure cookie handling, role-based tokens, and better error messages."}
          </div>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[#1C1C1E] mb-4">Highlights</h2>
          <div className="flex flex-col gap-4 text-[14px] text-[#1C1C1E]">
             <div className="flex bg-[#FDFCFB] items-start gap-3">
               <CheckCircle2 size={18} className="text-[#198754] shrink-0 mt-0.5" />
               <p>Improved security with httpOnly cookies</p>
             </div>
             <div className="flex bg-[#FDFCFB] items-start gap-3">
               <CheckCircle2 size={18} className="text-[#198754] shrink-0 mt-0.5" />
               <p>Added role-based token handling</p>
             </div>
             <div className="flex bg-[#FDFCFB] items-start gap-3">
               <AlertTriangle size={18} className="text-[#D97706] shrink-0 mt-0.5" />
               <p>Missing rate limiting on login</p>
             </div>
             <div className="flex bg-[#FDFCFB] items-start gap-3">
               <AlertCircle size={18} className="text-[#D92D20] shrink-0 mt-0.5" />
               <p>Sensitive data in error messages</p>
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-[15px] font-bold text-[#1C1C1E] mb-4">Quality Score</h2>
          <div className="flex items-center gap-8">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="50" fill="none" stroke="#F0EFEB" strokeWidth="6" />
                <circle cx="56" cy="56" r="50" fill="none" stroke="#B89C85" strokeWidth="6" strokeDasharray="314" strokeDashoffset={314 - (score / 100) * 314} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[32px] font-bold text-[#1C1C1E] leading-tight">{score}</span>
                <span className="text-[11px] font-medium text-[#8E8E93]">/100</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex justify-between items-center">
                 <span className="text-[#1C1C1E] text-[13px] font-medium">Maintainability</span>
                 <span className="text-[#198754] font-semibold text-[13px]">{reviewData.qualityScore?.maintainability || 88}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[#1C1C1E] text-[13px] font-medium">Readability</span>
                 <span className="text-[#198754] font-semibold text-[13px]">{reviewData.qualityScore?.readability || 85}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[#1C1C1E] text-[13px] font-medium">Performance</span>
                 <span className="text-[#198754] font-semibold text-[13px]">{reviewData.qualityScore?.performance || 82}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[#1C1C1E] text-[13px] font-medium">Security</span>
                 <span className="text-[#D92D20] font-semibold text-[13px]">{reviewData.qualityScore?.security || 75}</span>
              </div>
            </div>
          </div>
        </section>

        <section>
           <h2 className="text-[15px] font-bold text-[#1C1C1E] mb-4">Issues Found</h2>
           <div className="flex gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF0F0] border border-[#FFE0E0] rounded-lg">
                <ArrowDown size={14} className="text-[#D92D20]" />
                <span className="text-[#D92D20] text-[12px] font-semibold">High</span>
                <span className="text-[#1C1C1E] text-[12px] font-bold ml-1">{reviewData.issuesFound?.filter((i: any) => i.severity.toLowerCase() === 'high' || i.severity.toLowerCase() === 'critical').length || 1}</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF8EB] border border-[#FFF0D4] rounded-lg">
                <ArrowDown size={14} className="text-[#D97706]" />
                <span className="text-[#D97706] text-[12px] font-semibold">Medium</span>
                <span className="text-[#1C1C1E] text-[12px] font-bold ml-1">{reviewData.issuesFound?.filter((i: any) => i.severity.toLowerCase() === 'medium' || i.severity.toLowerCase() === 'major').length || 2}</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg">
                <ArrowDown size={14} className="text-[#198754]" />
                <span className="text-[#198754] text-[12px] font-semibold">Low</span>
                <span className="text-[#1C1C1E] text-[12px] font-bold ml-1">{reviewData.issuesFound?.filter((i: any) => i.severity.toLowerCase() === 'low' || i.severity.toLowerCase() === 'minor').length || 3}</span>
             </div>
           </div>
        </section>
      </div>
    </div>
  );
}
