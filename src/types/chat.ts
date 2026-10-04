export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  image?: {
    mimeType: string;
    data: string; // Base64 without data URI scheme or full data URI
    url?: string;
  };
  isStreaming?: boolean;
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  systemPrompt?: string;
  model?: string;
  personaId?: string;
  pinned?: boolean;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  iconName: string;
  systemPrompt: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  badge: string;
  recommendedFor: string;
}
