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

app.use(express.json({ limit: '15mb' }));

// ============================================================
// GEMINI AI
// ============================================================

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// ============================================================
// TYPES
// ============================================================

interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
  image?: {
    mimeType: string;
    data: string;
  };
}

// ============================================================
// FORMAT MESSAGES
// ============================================================

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
      parts.push({
        text: msg.content,
      });
    } else if (!msg.image?.data) {
      parts.push({
        text: ' ',
      });
    }

    return {
      role,
      parts,
    };
  });
}

// ============================================================
// GEMINI FALLBACK - STREAM
// ============================================================

async function getStreamWithFallback(
  primaryModel: string,
  contents: any,
  config: any
) {
  const modelsToTry = [
    primaryModel,
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
  ];

  const uniqueModels = Array.from(
    new Set(modelsToTry.filter(Boolean))
  );

  let lastError: any = null;

  for (const model of uniqueModels) {
    try {
      return await ai.models.generateContentStream({
        model,
        contents,
        config,
      });
    } catch (err: any) {
      lastError = err;

      const msg = String(err?.message || '');

      if (
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('429') ||
        msg.includes('high demand')
      ) {
        console.warn(
          `Model ${model} unavailable, trying next model...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 700)
        );

        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

// ============================================================
// GEMINI FALLBACK - NORMAL
// ============================================================

async function getContentWithFallback(
  primaryModel: string,
  contents: any,
  config: any
) {
  const modelsToTry = [
    primaryModel,
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
  ];

  const uniqueModels = Array.from(
    new Set(modelsToTry.filter(Boolean))
  );

  let lastError: any = null;

  for (const model of uniqueModels) {
    try {
      return await ai.models.generateContent({
        model,
        contents,
        config,
      });
    } catch (err: any) {
      lastError = err;

      const msg = String(err?.message || '');

      if (
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('429') ||
        msg.includes('high demand')
      ) {
        console.warn(
          `Model ${model} unavailable, trying next model...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 700)
        );

        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

// ============================================================
// DEFAULT SAPPHIRE SYSTEM INSTRUCTION
// ============================================================

const defaultSystem = `${SAPPHIRE_COUNTRY_KNOWLEDGE}

ХАРИУЛТ ӨГӨХ ЧАНД МӨРДӨХ ЗААВАР:

1. ХЭЛНИЙ ШААРДЛАГА:
   - Хэрэглэгчийн асуултыг кириллээр хүлээн авч, ХАРИУГ ЗААВАЛ МОНГОЛ КИРИЛЛ ҮСГЭЭР, яруу тод, алдаагүй, төрийн албаны хүндэтгэлтэй найруулгаар бүрэн гаргана.
   - Латин үсгээр бичихийг хориглоно. Олон улсын дүрийн англи нэр томьёог шаардлагатай бол хаалтанд дурдаж болно.

2. МЭДЭЭЛЛИЙН САНТАЙ ШУУД ХОЛБОГДОЖ AI-ГААР ХАРИУЛАХ:
   - Та бол Саффир улсын төрийн албан ёсны мэдээллийн хиймэл оюун ухаан SapphireGPT.
   - Хэрэглэгчийн асуулт бүрийг дээрх Саффир улсын төрийн мэдээллийн сантай шууд холбож хариулна.
   - Иргэдийн лавлагаа: 11 овгийн бүх иргэд (Обелиа, Монтакью, Чармиелл, Сергьев, Крецентиа, Агриче, Кастильоне, Бисмарк, Венсантин, Дүнкелхаят, Авревиелль), тэдгээрийн цол хэргэм, ажил эрхлэлт, харьяа хотыг нарийн холбож хариулна.
   - Гадаад хүргэн: Ноён Юйн Цы (Mister Yunqi)-ийн тухай асуувал тэрээр Тианши (Хятад) улсын Линхиа'Ву овгоос ирсэн хүргэн бөгөөд түүний гэргий нь Их Гүнгийн хатан Роксана Обелиа (Grand Duchess Roxana Obelia) болохыг төрийн сантай шууд холбож хариулна.
   - Байгууллагууд: Төрийн захиргааны 11 яам, 11 хувийн байгууллага, тэдгээрийн сайд, тэргүүнүүдийг тодорхой нэрлэнэ.
   - Төрийн тэргүүн, хаад хатад: Анхны хатан Roxana Vanchellsing-ээс одоогийн 10-р төрийн тэргүүн, 6 дахь хатан хаан Либертиа Вон Монтакью хүртэлх түүхийг тодорхой гаргана.
   - Хотууд, хууль дүрэм, он тоолол, ZGRP-ийн 6 улсын мэдээллийг сангаас бүрэн холбоно.

3. БҮРТГЭГДЭЭГҮЙ МЭДЭЭЛЛИЙГ ЗОХИОХГҮЙ БАЙХ:
   - Системд бүртгэгдээгүй эсвэл Саффир улсын албан ёсны бүртгэлд байхгүй мэдээллийг хэзээ ч зохиож хариулахгүй.
   - "Уг мэдээлэл Саффир улсын албан ёсны бүртгэлд байхгүй байна" гэж шууд мэдэгдэнэ.

4. ЕРӨНХИЙ АСУУЛТ:
   - Саффир улсаас бусад ерөнхий шинжлэх ухаан, технологи, кодчлол, эссэ, боловсролын сэдвээр асуувал ChatGPT-ийн адил өндөр чадвартай, тустай, боловсон байдлаар Монгол кириллээр хариулна.

5. БҮТЭЦ:
   - Хариултаа Markdown формат (тодорхой гарчиг, цэгэн жагсаалт, хүснэгт, тодотгол)-аар цэгцтэй гаргана.`;

// ============================================================
// GENERATE TITLE
// ============================================================

app.post('/api/generate-title', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({
        title: 'Шинэ яриа',
      });
    }

    const titlePrompt = `
Analyze the following prompt and output a 2-4 word chat title in Mongolian Cyrillic:

"${String(prompt).slice(0, 150)}"
`;

    const response = await getContentWithFallback(
      'gemini-flash-latest',
      titlePrompt,
      {
        systemInstruction:
          'Return ONLY 2-4 words in Mongolian Cyrillic title. No punctuation, no quotes.',
        maxOutputTokens: 15,
        temperature: 0.2,
      }
    );

    const title = response.text
      ? response.text
          .trim()
          .replace(/^["']|["']$/g, '')
      : 'Шинэ яриа';

    return res.json({
      title: title.slice(0, 30),
    });
  } catch (error: any) {
    console.error(
      'Error generating title:',
      error
    );

    return res.json({
      title: 'Шинэ яриа',
    });
  }
});

// ============================================================
// STREAMING CHAT
// ============================================================

app.post('/api/chat/stream', async (req, res) => {
  const {
    messages,
    systemInstruction,
    model = 'gemini-flash-latest',
    webSearch = false,
  } = req.body;

  if (
    !messages ||
    !Array.isArray(messages) ||
    messages.length === 0
  ) {
    return res.status(400).json({
      error: 'Messages array is required',
    });
  }

  // SSE headers
  res.setHeader(
    'Content-Type',
    'text/event-stream; charset=utf-8'
  );
  res.setHeader(
    'Cache-Control',
    'no-cache, no-transform'
  );
  res.setHeader(
    'Connection',
    'keep-alive'
  );
  res.setHeader(
    'X-Accel-Buffering',
    'no'
 