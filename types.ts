
import type { Chat } from "@google/genai";

export type View = 'detector' | 'chatbot' | 'resources';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type AppChat = Chat;
