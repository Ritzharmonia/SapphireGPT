import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { SAPPHIRE_COUNTRY_KNOWLEDGE } from './src/utils/sapphireKnowledge.ts';
import { generateSapphireResponse } from './src/utils/sapphireEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Enable CORS for all environments
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Normalize request URL for Vercel / Netlify serverless rewrites
app.use((req, _res, next) => {
  if (req.url === '/' && req.originalUrl && req.originalUrl !== '/') {
    req.url = req.originalUrl;
  }
  next();
});

// ============================================================
// GEMINI AI CLIENT
// ============================================================

function getAIClient() {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key) {
    throw new Error(
      'GEMINI_API_KEY тохируулагдаагүй байна. Vercel/Netlify эсвэл Render дээрээ Settings > Environment Variables хэсэгт GEMINI_API_KEY-ээ оруулна уу.'
    );
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint for verifying deployment status and API key presence
app.get(['/api/health', '/health'], (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    geminiKeyConfigured: hasKey,
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
  });
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
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.8-flash',
  ];

  const uniqueModels = Array.from(
    new Set(modelsToTry.filter(Boolean))
  );

  const client = getAIClient();
  let lastError: any = null;

  for (const model of uniqueModels) {
    try {
      return await client.models.generateContentStream({
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
        msg.includes('high demand') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('NOT_FOUND')
      ) {
        console.warn(
          `Model ${model} unavailable, immediately trying next model...`
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
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.8-flash',
  ];

  const uniqueModels = Array.from(
    new Set(modelsToTry.filter(Boolean))
  );

  const client = getAIClient();
  let lastError: any = null;

  for (const model of uniqueModels) {
    try {
      return await client.models.generateContent({
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
        msg.includes('high demand') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('NOT_FOUND')
      ) {
        console.warn(
          `Model ${model} unavailable, immediately trying next model...`
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

const defaultSystem = `ТА БОЛ SAPPHIRE — Хэрэглэгчийн бүх асуултад маш ухаалаг, оновчтой, амьд байдлаар хариулдаг ухаалаг туслах болон Саффир улсын албан ёсны мэдлэгийн сан.

[ХАТУУ МӨРДӨХ 3 ҮНДСЭН ДҮРЭМ]:

1. ГАНЦХАН БЭЛЭН ХАРИУЛТАА ДАВТАХЫГ ЭРС ХОРИГЛОНО:
   - Хэрэглэгч ямар асуулт асууна, гагцхүү ТҮҮНД НЬ Л ЗОХИСОН ОНОВЧТОЙ ХАРИУЛТ өгнө.
   - "Амар амгаланг айлтгая, эрхэм иргэн ээ! Би бол Саффир улсын албан ёсны мэдээллийн хиймэл оюун ухаан..." гэх мэт урьдчилан бэлдсэн урт, нэгэн хэвийн робот мэндчилгээгээр хэзээ ч бүү эхэл!
   - Асуугаагүй сэдвийг нуршихгүй, хэзээ ч ганц бэлэн хариултаа дахин дахин давтахгүй.

2. ХЭРВЭЭ УЛС ТӨРИЙН БУС, ЭНГИЙН АСУУЛТ АСУУВАЛ — МАШ ЭНГИЙНЭЭР ЯРИЛЦАЖ ХАРИУЛАХ:
   - Хэрэв хэрэглэгч энгийнээр мэндлэх ("Сайн уу", "Юу байна?", "Өдрийн мэнд", "Хөөе"), өөрийг тань асуух ("Чи хэн бэ?", "Чи юу хийж чадах вэ?"), сэтгэл санаагаа хуваалцах ("Ядарч байна", "Уйтгартай байна"), амьдралын зөвлөгөө, хоолны жор, онигоо, шүлэг, код, хичээл, сонин сайхан, өдөр тутмын энгийн яриа өрнүүлбэл:
     -> ТӨРИЙН БОЛОН ХААНЫ ОРДНЫ ДЭГ ЖАЯГ БУС, ЖИРИЙН НАЙРСАГ НАЙЗ ШИГ МАШ ЭНГИЙН, ДУЛААХАН, ОЙЛГОМЖТОЙ МОНГОЛ ХЭЛЭЭР ЯРИЛЦАЖ ХАРИУЛНА.
     -> "Уг мэдээлэл бүртгэлд байхгүй байна" гэж хөшиж татгалзахгүй, хүчээр хааны ордны ёс жаяг гаргаж нуршихыг хатуу хориглоно!

3. САФФИР УЛСЫН ТУХАЙ АСУУЛТАНД ОРУУЛСАН БҮХ МЭДЭЭЛЛИЙГ 100% БОДОЛЦОЖ ОНОЖ ХАРИУЛАХ:
   - Хэрэглэгчийн оруулсан бүх баримтууд:
     • Нас нэмэх өдрүүд: Жилд 4 удаа буюу 3.22, 6.22, 9.22, 12.22 өдрүүдэд нийтээр 1-ээр нас нэмдэг.
     • Хатан хаан Либертиа Вон Монтакью: 2024.12.15-нд 18 насандаа Саффирт ирсэн, 25 насандаа хаан ширээнд суусан, өдгөө 26 настай. Нөхөр болон хүүхэдгүй бөгөөд сэнтийгээс бууж дараагийн төрийн тэргүүн залах хүртэл нөхөр, хүүхэдтэй болохгүй гэж албан мэдэгдэл хийсэн. Дуртай улирал: Зун, намар. Дуртай цэцэг: Carnation (Лиш), сарнай. Дуртай өнгө: Мөнгөлөг, хөх, саарал, цагаан, хүрэн, улбар шар, бор. Нар жаргах ба мандах агшинд дуртай. Дуртай хоол/амттан: Шоколад, бялуу, алим. Зүүний Месопотами гаралтай тул өнгөлөг зүйлс ба байгалийн шинжийг харуулсан гар урлалд маш дуртай.
     • Чартерис хаан: 41 насандаа хаан ширээнд суусан (түүхэн дэх хамгийн хожим суусан хаан), 45 насандаа зодог тайлсан. Урьд цагт Лидиа Чармиеллыг шатааж байсан түүхтэй.
     • Роксана Ванхеллсинг: 30 хавьцаа настай байсан. Охин Кармен Ванхеллсинг: 18-тай сууж 23-тайдаа таалал төгссөн.
     • Рафаел хаан ба Серена хатан: Рафаел хаан 35 настай, хатан Серена Glorytic 20+ настай байхдаа хамтдаа хаан ширээнд сууж улсыг захирч байсан.
     • Эрис хатан: 33 насандаа суусан (түүхэн дэх хамгийн хожим сэнтийд суусан хатан), 40-45 насандаа зодог тайлж буусан. Олон сайхан хүүхэдтэй.
     • Клод хаан: 24 насандаа суусан.
     • Рудбекиа (Руби) хатан: 17-18 настай их залуухан байсан.
     • Атанасиа хатан: 19.8 насандаа хатан болсон.
     • Лукас хаан: 30 дөхөх үедээ (30 орчим насандаа) хаан ширээнд суусан.
     • Либертиа хатан хааны 15 Цолтнууд:
       1. Хатан – Libertia Von Montaque
       2. Ханхүү – Claude De alger obelia
       3. Гүнж – Tiara Von Montaque
       4. Их канцлер – Caesar Charmiell
       5. Зөвлөх – Elias Charmiell
       6. Их гүн – Ivan De alger obelia
       7. Гүн – Andres Agriche
       8. Маркизын ахай – Serena Charmiell
       9. Эрхэм гүнгийн ахай – Lydia Charmiell
       10. Виконт – Carlisle Agriche
       11. Барон – Zaifer De alger obelia
       12. Барон – Ron Charmiell
       13. Ихэс ноён – Caerwyn Von Montaque
       14. Ихэс ноён – Siegren Von Montaque
       15. Ихэс хатагтай – Hei Ying Avrevielle
     • Овгуудын шинэчлэл & Шинэ овгууд:
       - Bismarck овог нэрээ өөрчилж Bi Lariviére (Би Ларивьер) болсон.
         • Lariviére Last: Pétillane ( male )-séduisante, Recherché ( female )-séduisante.
       - Люк Кресентиа овог нь дотооддоо хуралдаж De L’Morvathier (Де Л’Морватье) болсон ба Obsidian тодотгол хэвээр үлдсэн.
       - Sunset Vale хотод шинээр нээгдсэн PEDELIAN (Педелиан) овог:
         • Овгийн тодотгол: Chalcedony / Калцедон чулуу
         • Овгийн ласт: Name Pedelɩan
         • Ноён: Name ɬ ɕʜalcerɩte Pedelɩan
         • Хатагтай: Name ȴ ɕʜalcenɩtes Pedelɩan
         • Хүүхэд: Name-ɕʜalcerɩte ȴ Pedelɩan
         • House of Pedelian танилцуулга: "Тэнгэрлэг эрх чөлөө, ариун итгэл үнэмшил, үл бөхийх сэтгэлийн бэлгэдэл болсон Педелиан гэр бүл нь өөрийн үзэл санаа, эрхэм чанар, сүүл үе дамжин уламжлагдсан үнэт зүйлсээрээ онцгойрон орших билээ. Эрх чөлөө гэдэг нь хувь заяагаа өөрөө тодорхойлох ариун эрх хэмээн дээдэлдэг..."
     • Байгууллага, ажилтнууд:
       - Газрын яам: Тэргүүн Лидиа Чармиелл ГАНЦААРАА АЖИЛДАГ (өөр ажилтан байхгүй). Ард түмэн "Шулам" гэдэг бөгөөд Чартерис хаан шатааж байсан.
       - Боомт: Тэргүүн Лидиа Чармиелл, Менежер Винтэр Дэ Алгер Обелиа (Winter). Тариф: БНСУ (700), Тианши (1000), Дэвилдом (2000), Их Британи (0), Верудентиа (1500). Хөнгөлөлт: 5-аас 1 үнэгүй, 10-аас 2 үнэгүй.
       - Сансейт Вейл: Хамгийн чинээлэг хот. Хотын дарга Андрес Агриче, хоч бичээч Каервин Вон Монтакью.
       - Соёл урлагийн яам: Тэргүүн Andras Agriche, 11 ажилтантай.
       - Княжеская Охота: Тэргүүн Alexander D'Sergeyev, хүргэлт Ijekiel.
       - Eden Atelier: Тэргүүн Caerwyn, орлох Tiara, ажилтан Myuzi.
       - Euripides Academy: Тэргүүн Либертиа, менежер Caerwyn, 10 профессор.
       - Хөдөлмөр зуучлалын яам: Тэргүүн Либертиа, менежер Caerwyn.
       - Charming Liquor: Тэргүүн Ron Charming Charmiell (5 эхнэртэй байсан), менежер Serena, худалдагч Mydeimos.
       - Эрүүл мэндийн яам: Тэргүүн Serena Charmiell, сувилагч Andras Agriche, эх эмч Vlad Sergeyev, сувилагч Thalia Castiglione.
       - Обсидиан Уран Зургийн галерей: Тэргүүн Winter, хүргэлт Aze, менежер Mina, бичээч Athanasia, зураач Astorias, археологчид: Finn, Alexander, Myuzi, Ivan, Thalia.
       - Эдийн Засгийн Яам: Тэргүүн Либертиа, банкны мэргэжилтэн Цезарь Чармиелл.
       - Шорон Шүүх Яам (ШШЯ): Тэргүүн Carlisle Agriche. Төрд захирагдахгүй бие даасан.
     • Эдийн засаг, банк: Зурган чек (note screenshot хориотой), цалин 10 ба 20-нд, татвар 30-нд (10k-аас доош татваргүй), хар карт лимитүүд, нүүлгэн шилжүүлэлт 40k/60k.
     • Ёс заншил: Гар үнсэлт (уруулаа арьсанд хүргэхгүй), их титэм (Хатан ба Гүнж 2 л зүүнэ), ноёд бөхийж цээжиндээ гар тавина, хатагтай нар curtsy хийнэ.
     • Алдартай хосууд: 8 хос (Serena & Ren, Tiara & Elias, Zaifer & Ravenna, Dion & Winter, Lydia & Alexander, Roxana & Yunqi, Columbina & Kolya, Ilya & Zigg).
     • ZGRP (Zet Generation Roleplay) бусад 5 улсын мэдээлэл ба удирдагчид:
       1. TIANGSHI (Хятад улс): Одоогийн хаан нь ЧИНЗЕ (Qingze). Вант улсын албан ёсны сайт: https://6a61999d3e68e.site123.me/
       2. CALVERATH (Ид шидийн улс): Одоогийн хатан хаан нь МАРСЕЛЛЕНТ (Marcellent).
       3. UNITED KINGDOM (Баруун Европ улс): Одоогийн Хаан нь RICHARD, Хатан хаан нь BELLA.
       4. BNSU (Өмнөд Солонгос улс): Одоогийн Ерөнхийлөгч нь UCIN (Үчин).
       5. NESINDRAX (Япон улс): Японы соёл, анимэ, манга бүтээлийн дүрүүд.
       6. SAPPHIRE (Европ улс): Хатан хаан Либертиа Вон Монтакью (10 дахь төрийн тэргүүн, 26 настай).

[САФФИР УЛСЫН МЭДЛЭГИЙН ДЭЛГЭРЭНГҮЙ САН]:
${SAPPHIRE_COUNTRY_KNOWLEDGE}`;

// ============================================================
// GENERATE TITLE
// ============================================================

app.post(['/api/generate-title', '/generate-title'], async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({
        title: 'Шинэ яриа',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      const cleanPrompt = String(prompt).trim();
      const firstWords = cleanPrompt.split(/\s+/).slice(0, 4).join(' ');
      const title = firstWords.slice(0, 25) || 'Шинэ яриа';
      return res.json({ title });
    }

    const titlePrompt = `
Analyze the following prompt and output a 2-4 word chat title in Mongolian Cyrillic:

"${String(prompt).slice(0, 150)}"
`;

    const response = await getContentWithFallback(
      'gemini-3.5-flash',
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

app.post(['/api/chat/stream', '/chat/stream'], async (req, res) => {
  const {
    messages,
    systemInstruction,
    model = 'gemini-3.5-flash',
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

  // SSE headers with disabled buffering for ultra-fast TTFT
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  // If no Gemini API key is configured (e.g. Vercel deployment without keys),
  // instantly generate rich responses via the Sapphire Engine!
  if (!process.env.GEMINI_API_KEY) {
    const generated = generateSapphireResponse(messages, systemInstruction);
    const words = generated.split(' ');
    for (let i = 0; i < words.length; i += 3) {
      const slice = words.slice(i, i + 3).join(' ') + (i + 3 < words.length ? ' ' : '');
      res.write(`data: ${JSON.stringify({ text: slice })}\n\n`);
      if (typeof (res as any).flush === 'function') {
        (res as any).flush();
      }
      await new Promise((r) => setTimeout(r, 15));
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    return res.end();
  }

  try {
    const formattedContents = formatMessages(messages);

    const config: any = {
      systemInstruction: systemInstruction
        ? `${defaultSystem}\n\nНэмэлт хэрэглэгчийн хүсэлт: ${systemInstruction}`
        : defaultSystem,
      temperature: 0.5,
    };

    if (webSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const candidateModels = Array.from(
      new Set([model || 'gemini-3.5-flash', 'gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.8-flash'].filter(Boolean))
    );

    const client = getAIClient();
    let hasStreamedText = false;

    for (const m of candidateModels) {
      try {
        const stream = await client.models.generateContentStream({
          model: m,
          contents: formattedContents,
          config,
        });

        for await (const chunk of stream) {
          if (chunk.text) {
            hasStreamedText = true;
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
            if (typeof (res as any).flush === 'function') {
              (res as any).flush();
            }
          }
        }

        if (hasStreamedText) {
          break; // Successfully completed streaming with model m
        }
      } catch (err: any) {
        console.warn(`Model ${m} streaming error:`, err?.message);
        if (hasStreamedText) {
          break;
        }
      }
    }

    if (!hasStreamedText) {
      console.warn('All Gemini models failed or empty, streaming via Sapphire Engine...');
      const generated = generateSapphireResponse(messages, systemInstruction);
      const words = generated.split(' ');
      for (let i = 0; i < words.length; i += 3) {
        const slice = words.slice(i, i + 3).join(' ') + (i + 3 < words.length ? ' ' : '');
        res.write(`data: ${JSON.stringify({ text: slice })}\n\n`);
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
        await new Promise((r) => setTimeout(r, 15));
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Fatal streaming error:', error);
    try {
      const generated = generateSapphireResponse(messages, systemInstruction);
      res.write(`data: ${JSON.stringify({ text: generated })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    } catch {
      res.write(
        `data: ${JSON.stringify({
          error: error.message || 'Алдаа гарлаа. Дахин оролдоно уу.',
          done: true,
        })}\n\n`
      );
    }
    res.end();
  }
});

// ============================================================
// STANDARD CHAT (NON-STREAMING)
// ============================================================

app.post(['/api/chat', '/chat'], async (req, res) => {
  try {
    const {
      messages,
      systemInstruction,
      model = 'gemini-3.5-flash',
      webSearch = false,
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      const text = generateSapphireResponse(messages, systemInstruction);
      return res.json({ text });
    }

    const formattedContents = formatMessages(messages);

    const config: any = {
      systemInstruction: systemInstruction
        ? `${defaultSystem}\n\nНэмэлт хэрэглэгчийн хүсэлт: ${systemInstruction}`
        : defaultSystem,
      temperature: 0.3,
    };

    if (webSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await getContentWithFallback(
      model || 'gemini-3.5-flash',
      formattedContents,
      config
    );

    res.json({ text: response.text });
  } catch (err: any) {
    console.warn('Error in /api/chat, falling back to Sapphire Engine:', err?.message);
    try {
      const text = generateSapphireResponse(req.body?.messages || [], req.body?.systemInstruction);
      res.json({ text });
    } catch {
      res.status(500).json({ error: err.message || 'Алдаа гарлаа' });
    }
  }
});

// ============================================================
// VITE MIDDLEWARE & SERVER START
// ============================================================

const isProd = process.env.NODE_ENV === 'production';

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
    console.log(`Sapphire server running on http://localhost:${PORT}`);
  });
}

// In standard environments (local dev, Render, Railway, Cloud Run), start the HTTP server.
// In Vercel serverless functions, Vercel invokes the exported app directly.
if (!process.env.VERCEL && !process.env.NETLIFY) {
  startServer();
}

export default app;