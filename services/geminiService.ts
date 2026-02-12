
import { GoogleGenAI, Type } from "@google/genai";
import { Track, LyricsData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TRACK_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      artist: { type: Type.STRING },
      album: { type: Type.STRING },
      duration: { type: Type.STRING },
      coverUrl: { type: Type.STRING },
      previewUrl: { type: Type.STRING },
      year: { type: Type.STRING }
    },
    required: ["id", "title", "artist", "album", "duration", "coverUrl", "previewUrl"]
  }
};

export const getMusicDiscovery = async (prompt: string): Promise<{ text: string; tracks: Track[] }> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this music request: "${prompt}". Suggest 6 tracks. For previewUrl, use valid SoundHelix links (https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3 up to Song-16.mp3). Use high-quality unsplash images for covers.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          tracks: TRACK_SCHEMA
        },
        required: ["explanation", "tracks"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return { text: data.explanation, tracks: data.tracks };
  } catch (e) {
    return { text: "Error fetching music.", tracks: [] };
  }
};

export const getLyricsAndMeaning = async (track: Track): Promise<LyricsData> => {
  // Use Flash model for much faster response times
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: `Provide the lyrics for "${track.title}" by "${track.artist}". 
      Return JSON with:
      - 'lines': string array of the lyrics
      - 'meaning': brief 1-sentence interpretation
      - 'story': brief 1-sentence fact about the track.
      If exact lyrics unknown, provide high-quality thematic lyrics in the style of the artist.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lines: { type: Type.ARRAY, items: { type: Type.STRING } },
            meaning: { type: Type.STRING },
            story: { type: Type.STRING }
          },
          required: ["lines", "meaning", "story"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    return JSON.parse(text);
  } catch (e) {
    console.error("Lyrics generation failed, using fallback:", e);
    return { 
      lines: [
        "In the rhythm of the night...",
        "Where the melodies take flight.",
        "Your heart beat matches every tone,",
        "In a world that's all our own.",
        "The music speaks what words cannot,",
        "In this space, we've found our spot.",
        "Endless sounds and neon lights,",
        "Guiding us through velvet nights."
      ], 
      meaning: "A song about finding connection and solace through the power of shared music.",
      story: "This track was inspired by the atmosphere of late-night studio sessions and urban energy."
    };
  }
};
