import React, { useState, useEffect } from 'react';
import { Team, UserPreferences } from '../types';
import TeamAutocomplete from './TeamAutocomplete';
import { TIMEZONES } from '../constants';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences) => void;
  initialPreferences?: UserPreferences | null;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialPreferences }) => {
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('America/Los_Angeles'); // Default to Pacific Time

  useEffect(() => {
    if (initialPreferences) {
      setSelectedTeams(initialPreferences.teams);
      setEmail(initialPreferences.email);
      setTimezone(initialPreferences.timezone);
    }
  }, [initialPreferences]);

  const handleAddTeam = (team: Team) => {
    if (selectedTeams.find((t) => t.id === team.id)) return;
    if (selectedTeams.length >= 10) return;
    setSelectedTeams([...selectedTeams, team]);
  };

  const handleRemoveTeam = (id: string) => {
    setSelectedTeams(selectedTeams.filter((t) => t.id !== id));
  };

  const handleComplete = () => {
    if (!email || selectedTeams.length === 0) return;
    onComplete({
      email,
      timezone,
      teams: selectedTeams
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 pb-2">
            CourtSide Pulse
          </h1>
          <p className="text-slate-400 text-lg">
            {initialPreferences ? 'Update your preferences' : 'Stay in the game. Setup your tracking preferences.'}
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm space-y-6 text-left max-w-xl mx-auto">
           {/* Email Input */}
           <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-500"
              />
           </div>

           {/* Timezone Select */}
           <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
           </div>
           
           {/* Team Selection */}
           <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Follow Teams <span className="text-slate-500 text-xs">(Max 10)</span>
              </label>
              <TeamAutocomplete 
                onSelect={handleAddTeam} 
                disabled={selectedTeams.length >= 10} 
              />
              
              {selectedTeams.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-2">
                  {selectedTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-full pl-3 pr-2 py-1 text-xs text-slate-200"
                    >
                      <span>{team.name}</span>
                      <button
                        onClick={() => handleRemoveTeam(team.id)}
                        className="p-0.5 hover:bg-slate-600 rounded-full text-slate-400 hover:text-red-400 transition-colors"
                        aria-label="Remove team"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleComplete}
            disabled={!email || selectedTeams.length === 0}
            className="px-12 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white font-semibold transition-all shadow-lg shadow-blue-900/20 transform hover:-translate-y-0.5"
          >
            {initialPreferences ? 'Save Changes' : 'Start Tracking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
