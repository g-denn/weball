import { GoogleGenAI } from '@google/genai';
import type { Coordinates, GeminiResponse } from '../types';

if (!process.env.API_KEY) {
  // This is a fallback, but the environment is expected to have the key.
  console.warn("API_KEY environment variable is not set. The application may not function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const findCheapEats = async (dish: string, location: Coordinates | string): Promise<GeminiResponse> => {
  const locationPrompt = typeof location === 'string'
    ? `Based on the location "${location}"`
    : `Based on my current location`;

  const prompt = `You are an expert food finding assistant. ${locationPrompt}, find restaurants with a rating of at least 4.3 stars that serve '${dish}' within a 3km radius. For each restaurant, provide the following details: the restaurant's name, the lowest price for '${dish}' found on their menu or in menu photos (the price must be null if it is unknown), the distance from the specified location in kilometers, the estimated travel time by walking or driving, and whether the restaurant is currently open. Sort the results primarily by price (cheapest first). If prices are the same or unknown, sort by distance (closest first). Finally, provide a concise one-sentence summary mentioning the cheapest option available and its travel time. Your response must be a single valid JSON object with two keys: "restaurants" (an array of restaurant objects) and "summary" (a string). Do not add any text or formatting outside of the JSON object.`;

  try {
    const modelParams: { model: string; contents: string; config: any } = {
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    };

    if (typeof location === 'object' && location !== null) {
      modelParams.config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          }
        }
      };
    }

    const response = await ai.models.generateContent(modelParams);

    let jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }

    // The model might still wrap the JSON in markdown, so we extract it.
    const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonText = jsonMatch[1];
    }

    try {
        const parsedResponse = JSON.parse(jsonText) as GeminiResponse;
        return parsedResponse;
    } catch(e) {
        console.error("Failed to parse JSON response:", jsonText, e);
        throw new Error("The server returned data in an unexpected format. Please try again.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch restaurant data: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching data.");
  }
};

export const getPriceFromImage = async (dish: string, imageBase64: string, mimeType: string): Promise<string | null> => {
  const prompt = `From the provided menu image, find the price for the dish "${dish}". Respond with only the price as a string (e.g., "$15.99", "£12.50", "MYR 18.00"). If the dish or its price cannot be found, respond with "Not Found". Do not include any other text or explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    const price = response.text.trim();
    if (price.toLowerCase() === 'not found' || price === '') {
      return null;
    }
    return price;
  } catch (error) {
    console.error("Error calling Gemini API for image analysis:", error);
    throw new Error("Failed to analyze menu image.");
  }
};