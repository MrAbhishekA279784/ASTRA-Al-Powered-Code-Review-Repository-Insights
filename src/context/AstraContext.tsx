import React, { createContext, useContext, useState } from 'react';

type Toast = { message: string; type: 'success' | 'error' | 'info' };

type AstraContextType = {
  currentView: 'dashboard' | 'pr' | 'activity' | 'repos' | 'docs' | 'chat' | 'profile' | 'ai-review';
  setCurrentView: (view: 'dashboard' | 'pr' | 'activity' | 'repos' | 'docs' | 'chat' | 'profile' | 'ai-review') => void;
  prData: any;
  reviewData: any;
  isAnalyzing: boolean;
  analyzePR: (url: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
  chatHistory: any[];
  setChatHistory: React.Dispatch<React.SetStateAction<any[]>>;
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
};

const AstraContext = createContext<AstraContextType | undefined>(undefined);

export function AstraProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'pr' | 'activity' | 'repos' | 'docs' | 'chat' | 'profile' | 'ai-review'>('dashboard');
  const [prData, setPrData] = useState<any>(null);
  const [reviewData, setReviewData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const clearToast = () => setToast(null);

  const analyzePR = async (url: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/review-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl: url }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to analyze PR');
      }

      const data = await res.json();
      setPrData(data.prData);
      setReviewData(data.review);
      setChatHistory([]);
      setCurrentView('pr');
      showToast('Analysis complete', 'success');
    } catch (e: any) {
      setError(e.message);
      showToast(e.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AstraContext.Provider
      value={{
        currentView,
        setCurrentView,
        prData,
        reviewData,
        isAnalyzing,
        analyzePR,
        error,
        clearError,
        chatHistory,
        setChatHistory,
        toast,
        showToast,
        clearToast
      }}
    >
      {children}
    </AstraContext.Provider>
  );
}

export function useAstra() {
  const context = useContext(AstraContext);
  if (context === undefined) {
    throw new Error('useAstra must be used within an AstraProvider');
  }
  return context;
}
