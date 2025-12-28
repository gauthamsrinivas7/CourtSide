import React, { useState, useMemo } from 'react';
import { ALL_TEAMS } from '../constants';
import { Team } from '../types';

interface TeamAutocompleteProps {
  onSelect: (team: Team) => void;
  disabled?: boolean;
}

const TeamAutocomplete: React.FC<TeamAutocompleteProps> = ({ onSelect, disabled }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredTeams = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return ALL_TEAMS.filter(
      (team) =>
        team.name.toLowerCase().includes(lowerQuery) ||
        team.league.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit suggestions to 8
  }, [query]);

  const handleSelect = (team: Team) => {
    onSelect(team);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        disabled={disabled}
        placeholder="Search for a team (e.g. Lakers, India)..."
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-400 transition-all"
      />
      
      {isOpen && query && filteredTeams.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filteredTeams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleSelect(team)}
              className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex justify-between items-center group"
            >
              <span className="text-slate-200 font-medium group-hover:text-white">{team.name}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider bg-slate-900 px-2 py-1 rounded">
                {team.league}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamAutocomplete;
