import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Set up larger limit to handle base64 image uploads
app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI on server-side only
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint to analyze the sky / environment via image upload or simulated photos
app.post('/api/analyze-sky', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ error: "La clé API Gemini n'est pas configurée dans les secrets de l'application." });
    }

    const { image, locationHint } = req.body;
    if (!image) {
      return res.status(400).json({ error: "L'image de l'environnement est requise pour l'analyse." });
    }

    // Extract base64 details
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let mimeType = 'image/jpeg';
    let base64Data = image;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Data = matches[2];
    }

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: `Analyse cette image représentant le ciel ou l'environnement actuel${locationHint ? ` (lieu présumé : ${locationHint})` : ''}. Détermine les conditions météo, la saison probable (Saison Sèche, Saison des Pluies, Printemps, Été, Automne ou Hiver) et crée des conseils en français pour accompagner l'utilisateur.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: "Tu es l'intelligence artificielle environnementale de Shirikano Training. Ton rôle est d'analyser une image du ciel ou des environs pour comprendre le micro-environnement. Détecte précisément le type de météo, estime la saison actuelle (les saisons classiques ou tropicales comme saison sèche/des pluies selon l'aspect), évalue les variables météo estimées (température, humidité, vent, index UV), et formule des conseils d'expert en français pour la vie quotidienne : habillement, alimentation et hydratation, exercices physiques adéquats, lieux agréables à visiter aujourd'hui, et comportements dangereux ou inadaptés à éviter. Réponds strictement sous forme d'un objet JSON valide.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedWeather: { type: Type.STRING, description: "Nom simple de la météo (ex: 'Orageux', 'Grand Soleil', 'Ciel Voilé', 'Pluie Battante')" },
            conditionCode: { type: Type.STRING, description: "Code strict parmi: 'sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy'" },
            detectedSeason: { type: Type.STRING, description: "La saison estimée (ex: 'Saison Sèche', 'Saison des Pluies', 'Été', 'Automne', 'Hiver', 'Printemps')" },
            temperatureEstimate: { type: Type.NUMBER, description: "Température estimée en degrés Celsius" },
            humidityEstimate: { type: Type.NUMBER, description: "Taux d'humidité estimé en pourcentage (0-100)" },
            windEstimate: { type: Type.NUMBER, description: "Vitesse estimée du vent en km/h" },
            uvEstimate: { type: Type.NUMBER, description: "Index UV estimé (0-11+)" },
            description: { type: Type.STRING, description: "Description poétique et scientifique détaillée de ce que tu observes dans le ciel ou l'environnement (2 à 3 phrases)" },
            recommendations: {
              type: Type.OBJECT,
              properties: {
                habillement: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 ou 4 conseils d'habillement précis adaptés au temps observé" },
                alimentation: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 ou 4 conseils d'alimentation/boisson recommandés pour ces conditions" },
                activites: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 ou 4 activités physiques adaptées (intérieur/extérieur)" },
                lieux: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 lieux agréables ou recommandés à fréquenter aujourd'hui" },
                eviter: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 comportements risqués ou à éviter absolument" }
              },
              required: ['habillement', 'alimentation', 'activites', 'lieux', 'eviter']
            }
          },
          required: ['detectedWeather', 'conditionCode', 'detectedSeason', 'temperatureEstimate', 'humidityEstimate', 'windEstimate', 'uvEstimate', 'description', 'recommendations']
        }
      }
    });

    if (!response.text) {
      throw new Error("Aucune réponse n'a été générée par le modèle.");
    }

    const data = JSON.parse(response.text.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Error in /api/analyze-sky:", error);
    return res.status(500).json({ error: error.message || "Une erreur est survenue lors de l'analyse de l'image." });
  }
});

// Endpoint to query/simulate accurate weather forecasts by city name
app.post('/api/search-weather', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ error: "La clé API Gemini n'est pas configurée dans les secrets de l'application." });
    }

    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: "La ville ou le lieu est requis pour la recherche." });
    }

    const prompt = `Crée un rapport météo ultra-réaliste pour la ville de "${city}". Estime la saison actuelle et génère les prévisions de cette semaine et les recommandations personnalisées.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Tu es l'intelligence artificielle climatique de Shirikano Training. Ton but est de fournir un bulletin météo complet et ultra-réaliste pour le lieu demandé, incluant la saison actuelle, les paramètres physiques réels estimés, un bulletin de prévisions sur 5 jours, et des recommandations de style de vie complètes et personnalisées en français (habillement, alimentation, activités physiques, lieux, comportements à éviter). Réponds strictement sous forme de cet objet JSON spécifié.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            temperature: { type: Type.NUMBER, description: "Température actuelle en °C" },
            condition: { type: Type.STRING, description: "Description textuelle en français (ex: 'Averses légères', 'Brouillard matinal', 'Soleil Radieux')" },
            conditionCode: { type: Type.STRING, description: "Un code parmi: 'sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy'" },
            humidity: { type: Type.NUMBER, description: "Pourcentage d'humidité (0-100)" },
            windSpeed: { type: Type.NUMBER, description: "Vent en km/h" },
            uvIndex: { type: Type.NUMBER, description: "Index UV (0-11+)" },
            detectedSeason: { type: Type.STRING, description: "La saison de ce lieu en ce moment (ex: 'Saison Sèche', 'Saison des Pluies', 'Été', 'Automne')" },
            description: { type: Type.STRING, description: "Un résumé textuel attrayant du climat actuel sur place" },
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "Le jour de la semaine abrégé (Lun, Mar, Mer, Jeu, Ven, Sam, Dim)" },
                  temperature: { type: Type.NUMBER, description: "Température moyenne en °C" },
                  minTemp: { type: Type.NUMBER, description: "Température minimale en °C" },
                  maxTemp: { type: Type.NUMBER, description: "Température maximale en °C" },
                  condition: { type: Type.STRING, description: "Condition en français" },
                  conditionCode: { type: Type.STRING, description: "Code parmi: 'sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy'" }
                },
                required: ['day', 'temperature', 'minTemp', 'maxTemp', 'condition', 'conditionCode']
              }
            },
            recommendations: {
              type: Type.OBJECT,
              properties: {
                habillement: { type: Type.ARRAY, items: { type: Type.STRING } },
                alimentation: { type: Type.ARRAY, items: { type: Type.STRING } },
                activites: { type: Type.ARRAY, items: { type: Type.STRING } },
                lieux: { type: Type.ARRAY, items: { type: Type.STRING } },
                eviter: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['habillement', 'alimentation', 'activites', 'lieux', 'eviter']
            }
          },
          required: ['city', 'temperature', 'condition', 'conditionCode', 'humidity', 'windSpeed', 'uvIndex', 'detectedSeason', 'description', 'forecast', 'recommendations']
        }
      }
    });

    if (!response.text) {
      throw new Error("Aucune réponse générée par le modèle.");
    }

    const data = JSON.parse(response.text.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Error in /api/search-weather:", error);
    return res.status(500).json({ error: error.message || "Erreur de chargement météo." });
  }
});

// Endpoint for interactive lifestyle & climate chatbot
app.post('/api/chat', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ error: "La clé API Gemini n'est pas configurée dans les secrets de l'application." });
    }

    const { messages, currentContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "La liste des messages est requise." });
    }

    // Build standard chat with system instructions
    const sysInstruction = `Tu es l'assistant météo-climatique et de bien-être écologique de Shirikano Training. Ton but est de conseiller l'utilisateur sur la meilleure façon d'adapter ses habitudes quotidiennes à la météo actuelle et aux saisons.
      Contexte actuel de l'utilisateur : ${JSON.stringify(currentContext || "Inconnu (pas encore d'analyse ou de recherche météo effectuée)")}.
      Utilise ce contexte pour personnaliser tes réponses. Si l'utilisateur demande comment s'habiller, quoi manger, quel sport pratiquer ou comment agir par rapport à sa météo actuelle, sois très spécifique !
      Exprime-toi de manière concise, chaleureuse et moderne en français. Fais allusion à Shirikano Training comme le vecteur d'intelligence numérique qui rend cette application possible. Ne parle jamais de détails techniques d'API ou de serveurs.`;

    // Map conversation for Gemini
    const contents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.7,
      }
    });

    return res.json({ text: response.text || "Désolé, je n'ai pas pu formuler de réponse à votre question." });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: error.message || "Une erreur est survenue lors de l'interaction avec le chatbot." });
  }
});

// Serve static build assets in production and Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Shirikano Eco-Clim Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
