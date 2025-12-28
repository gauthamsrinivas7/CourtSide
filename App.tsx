import React, { useState, useEffect, useRef } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Toast from './components/Toast';
import { UserPreferences, GamePreview, GameSummary, View } from './types';
import { generateMorningPreview, generateEveningSummary } from './services/geminiService';

const App: React.FC = () => {
  // Load initial preferences from local storage
  const [preferences, setPreferences] = useState<UserPreferences | null>(() => {
    const saved = localStorage.getItem('courtSidePulse_prefs');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return !!localStorage.getItem('courtSidePulse_prefs');
  });

  // App State
  const [activeView, setActiveView] = useState<View>(View.PREVIEW);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<GamePreview[] | null>(null);
  const [summaryData, setSummaryData] = useState<GameSummary[] | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // References for cron logic to prevent duplicate firing within same minute
  const lastCronRun = useRef<string | null>(null);

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setPreferences(prefs);
    localStorage.setItem('courtSidePulse_prefs', JSON.stringify(prefs));
    setHasOnboarded(true);
  };

  const handleManage = () => {
    setHasOnboarded(false);
  };

  // API Call Wrappers
  const handleFetchPreview = async () => {
    if (!preferences) return;
    setLoading(true);
    const data = await generateMorningPreview(preferences.teams, preferences.timezone);
    setPreviewData(data);
    setLoading(false);
    return data;
  };

  const handleFetchSummary = async () => {
    if (!preferences) return;
    setLoading(true);
    const data = await generateEveningSummary(preferences.teams);
    setSummaryData(data);
    setLoading(false);
    return data;
  };

  // Cron Job Logic
  useEffect(() => {
    if (!preferences || !hasOnboarded) return;

    const checkTime = () => {
      const now = new Date();
      // Get current time in user's timezone
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: preferences.timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const currentKey = `${now.toDateString()}-${timeString}`;

      // Prevent running multiple times in the same minute
      if (lastCronRun.current === currentKey) return;

      if (timeString === '06:00') {
        lastCronRun.current = currentKey;
        setActiveView(View.PREVIEW);
        handleFetchPreview().then(() => {
          setToastMessage(`Morning Preview generated and sent to ${preferences.email}`);
        });
      } else if (timeString === '22:00') { // 10 PM
        lastCronRun.current = currentKey;
        setActiveView(View.SUMMARY);
        handleFetchSummary().then(() => {
           setToastMessage(`Evening Summary generated and sent to ${preferences.email}`);
        });
      }
    };

    // Check every second to be precise, though minutely checks are also fine.
    const interval = setInterval(checkTime, 5000); 
    
    return () => clearInterval(interval);
  }, [preferences, hasOnboarded]);

  return (
    <div className="min-h-screen bg-slate-900">
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
      
      {!hasOnboarded ? (
        <Onboarding 
          onComplete={handleOnboardingComplete} 
          initialPreferences={preferences}
        />
      ) : (
        preferences && (
          <Dashboard 
            preferences={preferences} 
            onManage={handleManage}
            activeView={activeView}
            setActiveView={setActiveView}
            loading={loading}
            previewData={previewData}
            summaryData={summaryData}
            onFetchPreview={handleFetchPreview}
            onFetchSummary={handleFetchSummary}
          />
        )
      )}
    </div>
  );
};

export default App;
