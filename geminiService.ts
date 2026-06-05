
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, GameStep, SetupResponse } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || "" });

const MODEL_NAME = "gemini-3-flash-preview";

const SYSTEM_INSTRUCTION = `Toimit maailmanluokan dramaturgina ja ohjaajana (Director), joka ohjaa pelaajaa monologi-LARPissa.
Pelityyli on "jeepform"-henkinen: olet tiukka ohjaaja, joka ei kysy pelaajalta mitä hän haluaa tehdä, vaan kerrot hänelle mitä tapahtuu ja mihin mennään.

Pelaajan toimintaa ohjataan taksonomialla:
1. Mekaniikka: Miten toiminta toteutetaan konkreettisesti (esim. suora puhe, sisäinen monologi, fyysinen toiminta, vuorovaikutus näkymättömän hahmon kanssa).
2. Dynamiikka: Toiminnan draamallinen laatu (esim. tunnustus, haastaminen, pelko, oivallus, valehtelu).
3. Kuvaus/Syöttö: Varsinainen ohje siitä, mitä pelaajan tulee sanoa tai tehdä.

Tehtäväsi on generoida pelin kulkua sykäyksittäin. Kun pelaaja painaa "And then", analysoit tilanteen ja annat uuden ohjeen.
Pelaaja puhuu ääneen kaiken, mitä ruudulla lukee ohjeena.`;

export const startNewGame = async (idea: string): Promise<SetupResponse> => {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Luo monologi-LARPin asetelma tästä ideasta: "${idea}". 
    Luo rikas maailmankuvaus, hahmoprofiili ja alkuasetelma. 
    Vastaa suomeksi JSON-muodossa.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          worldDescription: { type: Type.STRING },
          characterProfile: { type: Type.STRING },
          initialSituation: { type: Type.STRING },
          initialState: {
            type: Type.OBJECT,
            properties: {
              characters: { type: Type.ARRAY, items: { type: Type.STRING } },
              locations: { type: Type.ARRAY, items: { type: Type.STRING } },
              items: { type: Type.ARRAY, items: { type: Type.STRING } },
              currentDramaAnalysis: { type: Type.STRING }
            },
            required: ["characters", "locations", "items", "currentDramaAnalysis"]
          }
        },
        required: ["worldDescription", "characterProfile", "initialSituation", "initialState"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};

export const processGameStep = async (
  history: string, 
  currentState: GameState, 
  playerCorrection?: string
): Promise<GameStep> => {
  const prompt = `Pelin historia:\n${history}\n
Nykyinen maailman tila: ${JSON.stringify(currentState)}\n
${playerCorrection ? `PELAAJAN KORJAUS/OHJAUS: ${playerCorrection}` : ""}

Luo seuraava draamallinen askel.
1. "Prompt Builder": Muodosta pelaajalle seuraava toimintaohje (Mekaniikka, Dynamiikka, Sisältö).
2. "World Builder": Päivitä maailman tila (hahmot, esineet, paikat).
3. "Drama Analysis": Analysoi tilanne lyhyesti ja pohdi tulevaa suuntaa.

Vastaa suomeksi JSON-muodossa. Ohjeen (content) tulee olla suoraa toimintaa tai repliikkejä, jotka pelaaja esittää.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mechanic: { type: Type.STRING },
          dynamic: { type: Type.STRING },
          content: { type: Type.STRING },
          worldState: {
            type: Type.OBJECT,
            properties: {
              characters: { type: Type.ARRAY, items: { type: Type.STRING } },
              locations: { type: Type.ARRAY, items: { type: Type.STRING } },
              items: { type: Type.ARRAY, items: { type: Type.STRING } },
              currentDramaAnalysis: { type: Type.STRING }
            },
            required: ["characters", "locations", "items", "currentDramaAnalysis"]
          },
          dramaAnalysis: { type: Type.STRING }
        },
        required: ["mechanic", "dynamic", "content", "worldState", "dramaAnalysis"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};
