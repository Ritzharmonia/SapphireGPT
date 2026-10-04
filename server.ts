import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { SAPPHIRE_COUNTRY_KNOWLEDGE } from './src/utils/sapphireKnowledge.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI SDK on server-side only
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatMessagePart {
  text?: string;
  image?: {
    mimeType: string;
    data: string; // base64
  };
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
  image?: {
    mimeType: string;
    data: string;
  };
}

// Convert user/assistant messages to Gemini format
function formatMessages(messages: ChatMessage[]) {
  return messages.map((msg) => {
    const role = msg.role === 'assistant' ? 'model' : 'user';
    const parts: any[] = [];

    if (msg.image?.data) {
      parts.push({
        inlineData: {
          mimeType: msg.image.mimeType || 'image/jpeg',
          data: msg.image.data,
        },
      });
    }

    if (msg.content) {
      parts.push({ text: msg.content });
    } else if (!msg.image?.data) {
      parts.push({ text: ' ' });
    }

    return {
      role,
      parts,
    };
  });
}

// Robust fallback mechanism for high-demand spikes (503/429)
async function getStreamWithFallback(primaryModel: string, contents: any, config: any) {
  const modelsToTry = [primaryModel, 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  const uniqueModels = Array.from(new Set(modelsToTry.filter(Boolean)));

  let lastError: any = null;
  for (const m of uniqueModels) {
    try {
      return await ai.models.generateContentStream({
        model: m,
        contents,
        config,
      });
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || '');
      if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429') || msg.includes('high demand')) {
        console.warn(`Model ${m} encountered demand spike, trying next model...`);
        await new Promise((r) => setTimeout(r, 700));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

async function getContentWithFallback(primaryModel: string, contents: any, config: any) {
  const modelsToTry = [primaryModel, 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  const uniqueModels = Array.from(new Set(modelsToTry.filter(Boolean)));

  let lastError: any = null;
  for (const m of uniqueModels) {
    try {
      return await ai.models.generateContent({
        model: m,
        contents,
        config,
      });
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || '');
      if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429') || msg.includes('high demand')) {
        console.warn(`Model ${m} encountered demand spike, trying next model...`);
        await new Promise((r) => setTimeout(r, 700));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Generate short title for a conversation
app.post('/api/generate-title', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.json({ title: 'Шинэ яриа' });
    }

    const titlePrompt = `Analyze the following initial user prompt and generate a short, concise, natural chat title (3-5 words max). Keep the same language as the prompt (prefer Mongolian if in Mongolian). Do not use quotes or punctuation:
"${prompt.slice(0, 300)}"`;

    const response = await getContentWithFallback('gemini-3.8-flash', titlePrompt, {
      systemInstruction: 'You generate ultra-short, crisp conversation titles without quotation marks.',
    });

    const title = response.text ? response.text.trim().replace(/^["']|["']$/g, '') : 'Шинэ яриа';
    res.json({ title: title.slice(0, 40) });
  } catch (err: any) {
    console.error('Error generating title:', err);
    res.json({ title: 'Шинэ яриа' });
  }
});

// SSE Streaming chat endpoint
app.post('/api/chat/stream', async (req, res) => {
  const { messages, systemInstruction, model = 'gemini-3.8-flash', webSearch = false } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const formattedContents = formatMessages(messages);

  const defaultSystem = `${SAPPHIRE_COUNTRY_KNOWLEDGE}

ХАРИУЛТ ӨГӨХ ЗААВАР:
- Та бол Саффир улсын төрийн мэдлэгийн сан, албан ёсны хиймэл оюун ухаан SapphireGPT.
- Саффир улсын болон ZGRP-ийн тухай асуусан асуултад дээрх бүртгэгдсэн албан ёсны баримт, түүх, хууль, зарлиг, хотууд, овгууд, цол хэргэмүүдийг баримтлан маш үнэн зөв, тодорхой, яруу тансаг хариулна.
- ХЭРЭВ системд бүртгэгдээгүй эсвэл тодорхой бус зүйл асуувал ХЭЗЭЭ Ч ЗОХИОЖ ХАРИУЛАХГҮЙ. "Уг мэдээлэл Саффир улсын албан ёсны бүртгэлд байхгүй байна" эсвэл "Энэ тухай Саффир улсын албан ёсны эх сурвалжид тэмдэглэгдээгүй байна" гэж шууд мэдэгдэнэ.
- Бусад ерөнхий сэдэв, кодчлол, эссэ, боловсролын сэдвээр асуувал ChatGPT-ийн нэгэн адил өндөр чадвартай, боловсон, тустай байдлаар хариулна.
- Хариултаа Markdown формат (тодорхой гарчиг, цэгэн болон тоон жагсаалт, хүснэгт, тодотгол)-аар цэгцтэй гаргана.`;

  const config: any = {
    systemInstruction: systemInstruction ? `${defaultSystem}\n\nНэмэлт хэрэглэгчийн хүсэлт: ${systemInstruction}` : defaultSystem,
  };

  if (webSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  try {
    const stream = await getStreamWithFallback(
      model || 'gemini-3.8-flash',
      formattedContents,
      config
    );

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Streaming error in /api/chat/stream:', error);
    res.write(
      `data: ${JSON.stringify({
        error: error.message || 'Алдаа гарлаа. Дахин оролдоно уу.',
        done: true,
      })}\n\n`
    );
    res.end();
  }
});

// Standard non-streaming chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemInstruction, model = 'gemini-3.8-flash', webSearch = false } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const formattedContents = formatMessages(messages);

    const defaultSystem = `${SAPPHIRE_COUNTRY_KNOWLEDGE}

ХАРИУЛТ ӨГӨХ ЗААВАР:
- Та бол Саффир улсын төрийн мэдлэгийн сан, албан ёсны хиймэл оюун ухаан SapphireGPT.
- Саффир улсын болон ZGRP-ийн тухай асуусан асуултад дээрх бүртгэгдсэн албан ёсны баримт, түүх, хууль, зарлиг, хотууд, овгууд, цол хэргэмүүдийг баримтлан маш үнэн зөв, тодорхой, яруу тансаг хариулна.
- ХЭРЭВ системд бүртгэгдээгүй эсвэл тодорхой бус зүйл асуувал ХЭЗЭЭ Ч ЗОХИОЖ ХАРИУЛАХГҮЙ. "Уг мэдээлэл Саффир улсын албан ёсны бүртгэлд байхгүй байна" гэж тодорхой мэдэгдэнэ.`;

    const config: any = {
      systemInstruction: systemInstruction ? `${defaultSystem}\n\nНэмэлт хэрэглэгчийн хүсэлт: ${systemInstruction}` : defaultSystem,
    };

    if (webSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await getContentWithFallback(
      model || 'gemini-3.8-flash',
      formattedContents,
      config
    );

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message || 'Алдаа гарлаа' });
  }
});

// Vite Middleware for development / Static serve for production
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`SapphireGPT server running on http://localhost:${PORT}`);
  });
}

startServer();
