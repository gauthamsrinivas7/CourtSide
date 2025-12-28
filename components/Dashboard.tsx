import React, { useState } from 'react';
import { UserPreferences, GamePreview, GameSummary } from '../types';
import { generateMorningPreview, generateEveningSummary } from '../services/geminiService';
import EmailView from './EmailView';

interface DashboardProps {
  preferences: UserPreferences;
  onManage: () => void;
}

enum View {
  PREVIEW = 'PREVIEW',
  SUMMARY = 'SUMMARY'
}

const Dashboard: React.FC<DashboardProps> = ({ preferences, onManage }) => {
  const [activeView, setActiveView] = useState<View>(View.PREVIEW);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<GamePreview[] | null>(null);
  const [summaryData, setSummaryData] = useState<GameSummary[] | null>(null);

  const todayStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  const handleFetchPreview = async () => {
    setLoading(true);
    const data = await generateMorningPreview(preferences.teams, preferences.timezone);
    setPreviewData(data);
    setLoading(false);
  };

  const handleFetchSummary = async () => {
    setLoading(true);
    const data = await generateEveningSummary(preferences.teams);
    setSummaryData(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-sm">CP</span>
              </div>
              <span className="font-bold text-lg tracking-tight text-white">CourtSide Pulse</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                 <span className="text-xs text-slate-400">Sent to {preferences.email}</span>
                 <span className="text-xs text-slate-500">{preferences.teams.length} teams active</span>
              </div>
              <button 
                onClick={onManage}
                className="text-sm bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-medium py-2 px-4 rounded-lg transition-colors border border-slate-700"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800 p-1 rounded-xl inline-flex shadow-lg">
            <button
              onClick={() => setActiveView(View.PREVIEW)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeView === View.PREVIEW 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Morning Preview
            </button>
            <button
              onClick={() => setActiveView(View.SUMMARY)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeView === View.SUMMARY 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Evening Summary
            </button>
          </div>
        </div>

        {/* View Content */}
        <div className="animate-fade-in-up">
          {activeView === View.PREVIEW && (
            <div className="flex flex-col items-center">
              {!previewData && !loading && (
                 <div className="text-center py-20 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ready for the day?</h3>
                    <p className="text-slate-400 mb-8">Generate your personalized daily digest to see upcoming games for your {preferences.teams.length} favorite teams.</p>
                    <button 
                      onClick={handleFetchPreview}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1"
                    >
                      Generate 6:00 AM Email
                    </button>
                 </div>
              )}

              {loading && (
                <div className="py-20 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-slate-400 animate-pulse">Scouting upcoming matchups...</p>
                </div>
              )}

              {previewData && (
                <EmailView 
                  title="Your Daily Game Plan" 
                  subtitle={`Upcoming games for ${todayStr}`} 
                  timeLabel="Today, 6:00 AM"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  }
                >
                  {previewData.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 italic">
                      No games scheduled for your teams today. Time to rest and recover!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {previewData.map((game, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-100">
                          <div className="mb-2 sm:mb-0">
                            <h4 className="font-bold text-slate-800 text-lg">{game.matchup}</h4>
                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded mt-1">
                              Upcoming
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-slate-900 font-medium">{game.time}</div>
                            <div className="text-xs text-slate-500 mt-1 flex items-center justify-end gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                              </svg>
                              {game.broadcaster}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {previewData.length > 0 && (
                     <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <h5 className="font-semibold text-slate-700 mb-2 text-sm">Coach's Corner</h5>
                        <p className="text-slate-600 text-sm">Don't forget to set your alarms! It's going to be an exciting day of sports.</p>
                     </div>
                  )}
                </EmailView>
              )}
            </div>
          )}

          {activeView === View.SUMMARY && (
             <div className="flex flex-col items-center">
              {!summaryData && !loading && (
                 <div className="text-center py-20 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">The Final Whistle</h3>
                    <p className="text-slate-400 mb-8">Wrap up your day with scores and highlights from today's action involving your favorites.</p>
                    <button 
                      onClick={handleFetchSummary}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-semibold shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-1"
                    >
                      Generate 10:00 PM Email
                    </button>
                 </div>
              )}

              {loading && (
                <div className="py-20 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
                  <p className="text-slate-400 animate-pulse">Gathering match results...</p>
                </div>
              )}

              {summaryData && (
                <EmailView 
                  title="Today's Match Summary" 
                  subtitle={`Results for ${todayStr}`} 
                  timeLabel="Today, 10:00 PM"
                   icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                >
                  {summaryData.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 italic">
                      No final scores recorded for your teams today.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {summaryData.map((game, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-slate-900">{game.matchup}</h4>
                             <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">FINAL</span>
                          </div>
                          <div className="text-lg font-mono text-slate-700 font-semibold mb-3">
                            {game.score}
                          </div>
                          <div className="text-sm">
                             <a 
                              href={game.detailsLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                             >
                               See Full Stats & Highlights
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                                 <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                               </svg>
                             </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </EmailView>
              )}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
