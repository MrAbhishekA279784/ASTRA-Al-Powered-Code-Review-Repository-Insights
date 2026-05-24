import { MobileBottomNav } from "./MobileBottomNav";
import { MobilePRView } from "./MobilePRView";
import { MobileHome } from "./MobileHome";
import { MobileActivity } from "./MobileActivity";
import { MobileRepos } from "./MobileRepos";
import { MobileDocs } from "./MobileDocs";
import { MobileChat } from "./MobileChat";
import { MobileReview } from "./MobileReview";
import { MobileProfile } from "./MobileProfile";
import { useAstra } from "../../context/AstraContext";

export function MobileLayout() {
  const { currentView } = useAstra();
  
  // Decide whether to show bottom nav
  const hideBottomNav = ['chat', 'ai-review'].includes(currentView);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#FDFCFB] text-[#1C1C1E]">
      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'dashboard' && <MobileHome />}
        {currentView === 'activity' && <MobileActivity />}
        {currentView === 'pr' && <MobilePRView />}
        {currentView === 'repos' && <MobileRepos />}
        {currentView === 'docs' && <MobileDocs />}
        {currentView === 'chat' && <MobileChat />}
        {currentView === 'ai-review' && <MobileReview />}
        {currentView === 'profile' && <MobileProfile />}
      </div>
      
      {/* Fixed bottom navigation */}
      {!hideBottomNav && <MobileBottomNav />}
    </div>
  );
}
