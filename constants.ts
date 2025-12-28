import { Team } from './types';

export const LEAGUES = [
  'NBA',
  'NFL',
  'IPL',
  "Men's International Cricket",
  "Women's International Cricket"
];

export const TIMEZONES = [
  { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
  { label: 'Mountain Time (MT)', value: 'America/Denver' },
  { label: 'Central Time (CT)', value: 'America/Chicago' },
  { label: 'Eastern Time (ET)', value: 'America/New_York' },
  { label: 'Greenwich Mean Time (GMT)', value: 'Etc/GMT' },
  { label: 'British Summer Time (BST)', value: 'Europe/London' },
  { label: 'Central European Time (CET)', value: 'Europe/Paris' },
  { label: 'Indian Standard Time (IST)', value: 'Asia/Kolkata' },
  { label: 'Australian Eastern Time (AEST)', value: 'Australia/Sydney' },
];

// Helper to create team objects
const createTeams = (names: string[], league: string): Team[] => {
  return names.map(name => ({
    id: `${league}-${name.replace(/\s+/g, '-').toLowerCase()}`,
    name,
    league
  }));
};

const NBA_TEAMS = createTeams([
  'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Charlotte Hornets', 'Chicago Bulls',
  'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons', 'Golden State Warriors',
  'Houston Rockets', 'Indiana Pacers', 'LA Clippers', 'Los Angeles Lakers', 'Memphis Grizzlies',
  'Miami Heat', 'Milwaukee Bucks', 'Minnesota Timberwolves', 'New Orleans Pelicans', 'New York Knicks',
  'Oklahoma City Thunder', 'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns', 'Portland Trail Blazers',
  'Sacramento Kings', 'San Antonio Spurs', 'Toronto Raptors', 'Utah Jazz', 'Washington Wizards'
], 'NBA');

const NFL_TEAMS = createTeams([
  'Arizona Cardinals', 'Atlanta Falcons', 'Baltimore Ravens', 'Buffalo Bills', 'Carolina Panthers',
  'Chicago Bears', 'Cincinnati Bengals', 'Cleveland Browns', 'Dallas Cowboys', 'Denver Broncos',
  'Detroit Lions', 'Green Bay Packers', 'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars',
  'Kansas City Chiefs', 'Las Vegas Raiders', 'Los Angeles Chargers', 'Los Angeles Rams', 'Miami Dolphins',
  'Minnesota Vikings', 'New England Patriots', 'New Orleans Saints', 'New York Giants', 'New York Jets',
  'Philadelphia Eagles', 'Pittsburgh Steelers', 'San Francisco 49ers', 'Seattle Seahawks', 'Tampa Bay Buccaneers',
  'Tennessee Titans', 'Washington Commanders'
], 'NFL');

const IPL_TEAMS = createTeams([
  'Chennai Super Kings', 'Delhi Capitals', 'Gujarat Titans', 'Kolkata Knight Riders', 'Lucknow Super Giants',
  'Mumbai Indians', 'Punjab Kings', 'Rajasthan Royals', 'Royal Challengers Bangalore', 'Sunrisers Hyderabad'
], 'IPL');

const ICC_MENS_TEAMS = createTeams([
  'India', 'Australia', 'England', 'South Africa', 'New Zealand', 'Pakistan', 'Sri Lanka', 'West Indies',
  'Bangladesh', 'Afghanistan', 'Ireland', 'Zimbabwe', 'Netherlands', 'Scotland'
], "Men's International Cricket");

const ICC_WOMENS_TEAMS = createTeams([
  'Australia Women', 'England Women', 'India Women', 'New Zealand Women', 'South Africa Women',
  'West Indies Women', 'Pakistan Women', 'Sri Lanka Women', 'Bangladesh Women', 'Ireland Women'
], "Women's International Cricket");

export const ALL_TEAMS: Team[] = [
  ...NBA_TEAMS,
  ...NFL_TEAMS,
  ...IPL_TEAMS,
  ...ICC_MENS_TEAMS,
  ...ICC_WOMENS_TEAMS
];
