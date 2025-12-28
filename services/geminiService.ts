import { GoogleGenAI, Type } from "@google/genai";
import { GamePreview, GameSummary, Team } from '../types';

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMorningPreview = async (teams: Team[], timezone: string): Promise<GamePreview[]> => {
  const ai = getClient();
  const teamNames = teams.map(t => `${t.name} (${t.league})`).join(', ');
  // Get date in the user's timezone if possible, otherwise default to local
  const today = new Date().toLocaleDateString('en-US', { 
    timeZone: timezone,
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const prompt = `
    Today is ${today}.
    Check if any of the following sports teams have a scheduled game today: ${teamNames}.
    Search for the official schedule for today (date in ${timezone}).
    Return a list of games. If a team is not playing today, do not include it.
    If no teams are playing, return an empty list.
    For each game found, provide:
    - competing teams (e.g., "Lakers vs Warriors")
    - time (Must be converted to ${timezone} timezone. E.g. "7:00 PM PT")
    - where to watch (TV channel or streaming service)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              matchup: { type: Type.STRING },
              time: { type: Type.STRING },
              broadcaster: { type: Type.STRING }
            },
            required: ['matchup', 'time', 'broadcaster']
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as GamePreview[];
  } catch (error) {
    console.error("Error fetching morning preview:", error);
    return [];
  }
};

export const generateEveningSummary = async (teams: Team[]): Promise<GameSummary[]> => {
  const ai = getClient();
  const teamNames = teams.map(t => `${t.name} (${t.league})`).join(', ');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `
    Today is ${today}.
    Find the final scores or current status for games played today by these teams: ${teamNames}.
    Search for the results.
    Return a list of results.
    For each game, provide:
    - matchup (e.g. "India vs Australia")
    - score (e.g. "India won by 20 runs" or "105 - 98")
    - detailsLink (a valid URL to a google search or sports news page for this specific game)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              matchup: { type: Type.STRING },
              score: { type: Type.STRING },
              detailsLink: { type: Type.STRING }
            },
            required: ['matchup', 'score', 'detailsLink']
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    return JSON.parse(jsonText) as GameSummary[];
  } catch (error) {
    console.error("Error fetching evening summary:", error);
    return [];
  }
};
