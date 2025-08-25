
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import type { AppChat } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzePlantImage = async (imageFile: File): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `
      You are an expert agricultural botanist and plant pathologist for Greencare.
      Analyze this image of a plant.
      1.  Identify the plant if possible.
      2.  Identify any visible diseases or pests. Be specific.
      3.  Provide a detailed description of the issue.
      4.  List potential causes for this issue.
      5.  Recommend both organic and chemical treatment options in a step-by-step manner.
      6.  Provide preventative measures to avoid this issue in the future.

      If the image is not a plant, is of poor quality, or if you cannot make a confident diagnosis, state that clearly and politely.
      Format your response in clear, easy-to-read markdown with headings for each section.
    `;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, {text: prompt}] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error analyzing plant image:", error);
    return "Sorry, I encountered an error while analyzing the image. Please try again.";
  }
};

export const createChatSession = (): AppChat => {
  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: `You are Greencare's AI Farming Assistant, a helpful AI for Nigerian farmers. 
        You are fluent in English, Hausa, Yoruba, and Igbo. 
        Always respond in the language the user is primarily using. If the user mixes languages, respond in the dominant one.
        Provide concise, practical, and easy-to-understand advice on farming, crop diseases, pest control, soil management, and weather conditions.
        Keep your tone friendly and encouraging.`
    },
  });
  return chat;
};

export const generateResourceGuide = async (topic: string): Promise<string> => {
  try {
    const prompt = `
        Generate a simple, practical, step-by-step guide for a farmer on the topic of: "${topic}".
        Use clear headings, bullet points, and easy-to-understand language.
        The guide should be actionable and focus on techniques suitable for small to medium-scale farming in Nigeria.
        Format the response in markdown.
    `;
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating resource guide:", error);
    return `Sorry, I couldn't generate a guide for "${topic}". Please try another topic.`;
  }
};