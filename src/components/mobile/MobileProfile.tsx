import { ChevronLeft, User, Github, Bell, Palette, Shield, ChevronRight, PenLine, LogOut, ExternalLink } from "lucide-react";
import { useAstra } from "../../context/AstraContext";
import { useAuth } from "../../hooks/useAuth";

export function MobileProfile() {
  const { setCurrentView } = useAstra();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) return null;

  const settings = [
    { icon: User, label: 'Account Settings', desc: 'Profile, email, name' },
    { icon: Github, label: 'GitHub Integration', desc: 'Connect repositories' },
    { icon: Bell, label: 'Notifications', desc: 'Alerts and updates' },
    { icon: Palette, label: 'Appearance', desc: 'Theme and layout' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Sessions and data' },
  ];

  return (
    <div className="flex flex-col bg-[#FDFCFB] min-h-dvh h-full relative overflow-y-auto pb-32">
      {/* Header */}
      <header className="sticky top-0 px-5 py-4 flex items-center bg-[#FDFCFB]/80 backdrop-blur-lg z-10 text-[#1C1C1E] border-b border-[#F0EFEB]">
        <button onClick={() => setCurrentView('dashboard')} className="p-1 -ml-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="ml-2 font-bold text-[17px] flex-1 text-center pr-6 font-sans">Profile</h1>
        <div className="w-6" />
      </header>

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-8 px-5">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#EADDD7] border-[3px] border-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[36px] font-bold text-[#1C1C1E] font-sans">
                {user.displayName?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center border-[2.5px] border-[#FDFCFB] shadow-md hover:bg-[#333] transition-colors active:scale-95">
            <PenLine size={14} />
          </button>
        </div>
        <h2 className="mt-5 font-bold text-[22px] text-[#1C1C1E] font-sans">{user.displayName || 'Developer'}</h2>
        <p className="text-[#8E8E93] text-[13px] mt-1 font-sans">{user.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="mx-5 my-8 bg-white border border-[#F0EFEB] rounded-2xl flex items-center justify-between p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] divide-x divide-[#F0EFEB]">
        <div className="flex flex-col items-center flex-1 py-1">
          <span className="text-[#1C1C1E] font-bold text-[22px] font-mono">128</span>
          <span className="text-[#8E8E93] text-[10px] font-medium mt-0.5 font-sans uppercase tracking-wider">Reviews</span>
        </div>
        <div className="flex flex-col items-center flex-1 py-1">
          <span className="text-[#1C1C1E] font-bold text-[22px] font-mono">24</span>
          <span className="text-[#8E8E93] text-[10px] font-medium mt-0.5 font-sans uppercase tracking-wider">Repositories</span>
        </div>
        <div className="flex flex-col items-center flex-1 py-1">
          <span className="text-[#198754] font-bold text-[22px] font-mono">87</span>
          <span className="text-[#8E8E93] text-[10px] font-medium mt-0.5 font-sans uppercase tracking-wider">Quality</span>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-5 flex flex-col gap-1">
        {settings.map((item, i) => (
          <button
            key={item.label}
            className="flex items-center justify-between p-4 bg-white rounded-2xl transition-all active:scale-[0.98] border border-transparent hover:border-[#F0EFEB] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F5F4F1] flex items-center justify-center">
                <item.icon size={18} className="text-[#1C1C1E]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[#1C1C1E] font-semibold text-[14px] font-sans">{item.label}</span>
                <span className="text-[#8E8E93] text-[11px] font-sans">{item.desc}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#8E8E93] group-hover:text-[#1C1C1E] transition-colors shrink-0" />
          </button>
        ))}
      </div>

      {/* GitHub Status */}
      <div className="mx-5 mt-4 mb-8 p-4 bg-white rounded-2xl border border-[#F0EFEB] flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#198754] flex-shrink-0" />
        <div className="flex flex-col flex-1">
          <span className="text-[13px] font-semibold font-sans text-[#1C1C1E]">GitHub Connected</span>
          <span className="text-[11px] text-[#8E8E93] font-sans">Last synced 2 minutes ago</span>
        </div>
        <ExternalLink size={16} className="text-[#8E8E93]" />
      </div>

      {/* Logout */}
      <div className="px-5">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white rounded-2xl border border-[#F0EFEB] text-[#D93025] font-semibold text-[14px] font-sans active:scale-[0.98] transition-all hover:bg-[#FFF5F5]"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
