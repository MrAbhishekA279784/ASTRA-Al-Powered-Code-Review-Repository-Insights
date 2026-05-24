import { useState } from 'react';
import { User, Github, Bell, Palette, Shield, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function SettingsView() {
  const { user } = useAuth();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const sections = [
    {
      icon: User,
      title: 'Account',
      fields: [
        { label: 'Name', value: user?.displayName || 'Developer' },
        { label: 'Email', value: user?.email || 'user@example.com' },
        { label: 'User ID', value: user?.uid?.slice(0, 12) || '...' },
      ],
    },
    {
      icon: Bell,
      title: 'Notifications',
      fields: [
        { label: 'Email notifications', value: emailNotifs, toggle: () => setEmailNotifs(!emailNotifs) },
        { label: 'Push notifications', value: pushNotifs, toggle: () => setPushNotifs(!pushNotifs) },
      ],
    },
    {
      icon: Shield,
      title: 'Security',
      fields: [
        { label: 'Authentication', value: 'Firebase' },
        { label: 'Session', value: 'Active' },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Palette className="w-5 h-5 text-astra-purple-light" />
          <h2 className="text-2xl font-light italic font-serif text-astra-text">Settings</h2>
        </div>
        <p className="text-[11px] font-sans tracking-widest uppercase text-astra-muted mt-2">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.title} className="border border-astra-border bg-astra-elevated">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-astra-border">
              <section.icon className="w-4 h-4 text-astra-purple-light" />
              <h3 className="text-[11px] uppercase tracking-widest font-bold font-sans text-astra-text">{section.title}</h3>
            </div>
            <div className="divide-y divide-astra-border">
              {section.fields.map((field: any) => (
                <div key={field.label} className="flex items-center justify-between px-6 py-3.5">
                  <span className="text-[12px] font-sans text-astra-muted">{field.label}</span>
                  {field.toggle ? (
                    <button onClick={field.toggle} className="text-astra-text">
                      {field.value ? <ToggleRight className="w-5 h-5 text-astra-purple-light" /> : <ToggleLeft className="w-5 h-5 text-astra-muted" />}
                    </button>
                  ) : (
                    <span className="text-[12px] font-sans text-astra-text font-medium">{field.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 border border-astra-border bg-astra-elevated flex items-center gap-3">
        <Github className="w-5 h-5 text-astra-muted" />
        <div className="flex-1">
          <span className="text-[12px] font-semibold font-sans text-astra-text">GitHub Integration</span>
          <p className="text-[10px] text-astra-muted font-sans">Connected. Last synced 2m ago.</p>
        </div>
        <ChevronRight className="w-4 h-4 text-astra-muted" />
      </div>
    </div>
  );
}
