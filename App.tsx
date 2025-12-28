import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { UserPreferences } from './types';

const App: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setPreferences(prefs);
    setHasOnboarded(true);
  };

  const handleManage = () => {
    setHasOnboarded(false);
  };

  return (
    <div className="min-h-screen bg-slate-900">
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
          />
        )
      )}
    </div>
  );
};

export default App;
