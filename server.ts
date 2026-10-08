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
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
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
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
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

const defaultSystem = `${SAPPHIRE_COUNTRY_KNOWLEDGE}

ХАРИУЛТ ӨГӨХ ЧАНД МӨРДӨХ ЗААВАР:

1. ХЭЛНИЙ ШААРДЛАГА:
   - Хэрэглэгчийн асуултыг кириллээр хүлээн авч, ХАРИУГ ЗААВАЛ МОНГОЛ КИРИЛЛ ҮСГЭЭР, яруу тод, алдаагүй, төрийн албаны хүндэтгэлтэй найруулгаар бүрэн гаргана.
   - Латин үсгээр бичихийг хориглоно. Олон улсын дүрийн англи нэр томьёог шаардлагатай бол хаалтанд дурдаж болно.

2. МЭДЭЭЛЛИЙН САНТАЙ ШУУД ХОЛБОГДОЖ AI-ГААР ХАРИУЛАХ:
   - Та бол Саффир улсын төрийн албан ёсны мэдээллийн хиймэл оюун ухаан SapphireGPT.
   - Хэрэглэгчийн асуулт бүрийг дээрх Саффир улсын төрийн мэдээллийн сантай шууд холбож хариулна.
   - Иргэдийн лавлагаа: 11 овгийн бүх иргэд (Обелиа, Монтакью, Чармиелл, Сергьев, Крецентиа, Агриче, Кастильоне, Бисмарк, Венсантин, Дүнкелхаят, Авревиелль), тэдгээрийн цол хэргэм, ажил эрхлэлт, харьяа хотыг нарийн холбож хариулна. Тухайлбал, Чармиелл овгийн Эрхэм гүнгийн ахайтан Лидиа Чармиелл (Countess Lydia Charmiell)-ийг Саффир улсынхан, ард иргэд "Шулам" (Witch) хэмээн гэлцдэг онцлогтой.
   - Гадаад хүргэн: Ноён Юйн Цы (Mister Yunqi)-ийн тухай асуувал тэрээр Тианши (Хятад) улсын Линхиа'Ву овгоос ирсэн хүргэн бөгөөд түүний гэргий нь Их Гүнгийн хатан Роксана Обелиа (Grand Duchess Roxana Obelia) болохыг төрийн сантай шууд холбож хариулна.
   - Байгууллагууд: Төрийн захиргааны 11 яам, 11 хувийн байгууллага, тэдгээрийн сайд, тэргүүнүүдийг тодорхой нэрлэнэ.
   - Төрийн тэргүүн, хаад хатад ба тэдгээрийн нас, гэр бүлийн байдал:
     • Саффир улс жил бүрийн 3.22, 6.22, 9.22, 12.22 өдрүүдэд 1-ээр нас нэмдэг (улирал бүрийн 22-ны өдөр).
     • Анхны хатан хаан Roxana Vanchellsing нь 30 хавьцаа настай байсан.
     • Түүний охин Carmen Vanchellsing нь 18 насандаа хаан ширээнд сууж, 23 насандаа таалал төгссөн.
     • Анхны хаан Raphael Mizelian болон түүний хатан Serena Serenity нарын нас тодорхой бус боловч хоёуланг нь нас тогтсон хүмүүс байсан гэж үздэг.
     • Charteris хаан 41 насандаа хаан ширээнд сууж, 45 насандаа зодог тайлсан.
     • Одоогийн 10-р төрийн тэргүүн, 6 дахь хатан хаан Либертиа Вон Монтакью: 2024.12.15-нд 18 насандаа анх Саффир улсад орж ирсэн, 25 насандаа хаан ширээнд суусан. Өдгөө 26 настай. Нөхөр болон хүүхэдгүй. Сэнтийнээсээ бууж дараагийн төрийн тэргүүн залрах хүртэл нөхөр, хүүхэдтэй болохгүй гэж албан мэдэгдэл хийсэн.
   - Хотууд, хууль дүрэм, он тоолол, ZGRP-ийн 6 улсын мэдээллийг сангаас бүрэн холбоно.
   - Байгууллагууд ба албан хаагчдын бүрэн лавлагаа:
     • Газрын яам: Тэргүүн Лидиа Чармиелл (Lydia Charmiell) — ганцаараа ажилладаг. Түүнийг улсынхан "Шулам" гэлцдэг бөгөөд урьд цагт Чартерис хаан шатааж байсан түүхтэй.
     • Боомт (Water Port): Тэргүүн Лидиа Чармиелл, Менежер нь Винтэр Дэ Алгер Обелиа (Winter De Alger Obelia). Улс хоорондын зорчих хураамж: БНСУ (700 зоос), Тианши (1'000 зоос), Дэвилдом (2'000 зоос), Их Британи (нэмэлт төлбөргүй), Верудентиа (1'500 зоос). 5-аас дээш зорчигчид 1 хүн үнэгүй, 10-аас дээш бол 2 хүн үнэгүй. Аялахаас 4 хоногийн өмнө захиална. Визгүй зорчвол ШШЯ-нд тушаана.
     • Сансейт Вейл (Sunset Vale): Саффир улсын ХАМГИЙН ЧИНЭЭЛЭГ ХОТ. Хотын дарга: Андрес Агриче (Andras Agriche), Хоч бичээч: Каервин Вон Монтакью (Caerwyn).
     • Соёл урлагийн яам: Тэргүүн Andras Agriche. 11 ажилтан: Andrew (жүжигчин), Ren (редактор), Tiara (хөгжимчин), Hei'Ying (балетчин), Mina (зохиолч), Carlisle (жүжигчин), Viola (зохиолч), Valentina (сопрано дуучин), Ludovica (хөгжимчин), Zirui (жүжигчин), Killian (хөгжимчин).
     • Княжеская Охота (Ан агнуурын байгууллага): Тэргүүн Alexander D'Sergeyev, Хүргэлтийн ажилтан Ijekiel De Alger Obelia.
     • Eden Atelier (Модон эдлэл): Тэргүүн Caerwyn Von Montaque, Орлох тэргүүн Tiara, Ажилтан Myuzi.
     • Euripides Academy (Еврипидийн Академи): Тэргүүн Либертиа Хатан хаан, Хичээлийн эрхлэгч Caerwyn. Профессорууд: Ren (Философи), Siegren (Хөгжим), Alena (Вальс/балет), Elise (Одон орон), Viola (Түүх, хэл зүй), Lydia (Геологи), Serena (Эм зүй), Ayna (Социологи), Ivan (Биеийн тамир), Тогооч Mydeimos.
     • Хөдөлмөр зуучлалын яам (ХЗЯ): Тэргүүн Либертиа Вон Монтакью, Менежер Caerwyn.
     • Charming Liquor (Архины дэлгүүр): Тэргүүн Ron Charming Charmiell (Барон Рон — Саффирт байхдаа 5 эхнэртэй байсан түүхтэй), Менежер Serena, Худалдагч Mydeimos.
     • Эрүүл мэндийн яам: Тэргүүн Serena Charmiell. Ажилчид: Andras (сувилагч), Thalia (сувилагч), Vlad (эх эмч).
     • Обсидиан Уран Зургийн галерей: Тэргүүн Winter De Alger Obelia. Хүргэлт Aze, Менежер Mina, Зураач Astorias, Бичээч Athanasia, Археологчид: Finn, Alexander (сайн дур), Myuzi, Ivan, Thalia.
     • Эдийн Засгийн Яам: Тэргүүн Либертиа Хатан хаан, Банкны гүйлгээний мэргэжилтэн Цезарь Чармиелл (Caesar Charmiell).
   - Саффир улсын алдартай хосууд:
     • Serena Charmiell & Ren Von Montaque: Саффирын хамгийн ICONIC IT COUPLE.
     • Tiara Von Montaque x Elias Von Montaque: Хамгийн эгдүүтэй, хайр татам хос.
     • Zaifer De Alger Obelia x Ravenna Charmiell: Эсрэг тэсрэг араншинтай хэрнээ төгс зохицдог хос.
     • Dion Agriche x Winter De Alger Obelia: Улсын хамгийн ажилсаг хос.
     • Lydia Charmiell x Alexander Dimitry Sergeyev: Өвөрмөц харилцаатай алдарт хос.
     • Roxana De Alger Obelia x Linhia'Wu Yunqi: Их Гүнгийн хатан Роксана ба гадаад хүргэн Юйн Цы.
     • Columbina Von Montaque x Kolya De Alger Obelia, Ilya Von Montaque x Zigg.
   - Түүх, соёлын онцлох баримтууд:
     • Хатан хаан Либертиа Вон Монтакьюгийн төрсөн өдөр: Жил бүрийн 4 дүгээр сарын 4.
     • Нийслэлийн төвийн Немесис бурхны хөшөө: Лукас хааны үед асан их гүн Арлеккино Вон Монтакью (Arlecchino) баг бүрдүүлэн босгосон.
   - Эдийн засгийн дүрэм (Банк, зоос, татвар):
     • Гүйлгээ хийхдээ заавал зурган чек ашиглана (From, For, Дүн, Утга).
     • Цалин сар бүрийн 10, 20-нд бууна (дээд 2500, дунд 1500, доод 500, онцгой бол 500 нэмэгдэл).
     • Татвар сар бүрийн 30-нд хураагдана (10k-аас доош зоостой иргэдээс авахгүй, энгийн 500, язгууртан 1000, цолтон 1200, хувийн байгууллага 2500 буюу 10'000).
     • Нүүлгэн шилжүүлэлт 40'000 (нотлогдвол 60'000), гэрээслэл 30'000. Хязгааргүй зоосны сарын лимит: Төр баригч 10 сая, Хааны гэр бүл 1 сая, Дээд язгууртан 850k, Дунд 500k.
   - Мэндчилгээ ба хүндэтгэлийн ёс зүй (Ноён Олак Сайнт Серпент эмхэтгэсэн):
     • Ноёд бэлхүүсээрээ бөхийж гараа цээжиндээ байрлуулж мэндчилнэ.
     • Авхай / Хатагтай нар өвдгөө бага зэрэг нугалан биеэ доошлуулж толгой гудайлган хормойгоо өргөнө (Curtsy).
     • Дээд зиндааны хатагтай нартай албан ёсоор мэндлэхэд гар үнсэлт (Hand kiss) үйлдэнэ (уруулаа арьсанд хүргэхгүй зөөлөн үнсэнэ).
     • Хаан хатанд "Эрхэм дээдсээ", Язгууртанд "Эрхэм [цол]", Ноёдод "Ноёнтон [Овог]", Хатагтайд "Хатагтай [Овог]", залуу гэрлээгүй бүсгүйд "Авхай [Овог]", Сүмийн гэгээнтэнд "Эзэн минь" ("Дарь эх таныг адислах болтугай"), номлогчид "Ламтан", "Эцэг" гэж дуудна.
     • Титэм: Хатан ба Гүнж 2 л сүр жавхлант титэм зүүнэ. Цолтой хатагтай нар жижиг даруухан титэм. Цолгүй язгууртан үнэт гоёл, эгэл иргэн даруухан толгойн гоёл.
     • Орон сууц: Хааны удмынх ордон/шилтгээн, Язгууртан эдлэн харш, Эгэл иргэн байшин.
   - Нийгэмших ба бэлэг сэлтийн зөвлөгөө:
     • Нийгэмших дараалал: Овогтоо ➔ Хотдоо ➔ Улсдаа. Эможи дарах нь найдваргүй тул чатад мэнд мэдэж яриа өдөх. Сийндүүлбэл эелдэгээр дахин сануулах. Байгууллагад ажилд орж сайн найзуудтай болох.
     • Бэлэг зөвлөх: Тухайн хүний овог, хот, ажлын онцлогт тохируулан Саффирын дэлгүүрүүдтэй холбож санал болгоно (цэцэг, амттан, бялуу, шаазан, ангийн хэрэглэл, дарс, модон урлал, уран зураг, гоо сайхан).
   - Дүрд орох (Roleplay) горим:
     • Хэрэглэгч дүрд орж бичвэл (RP) Саффир улсын Сэргэн мандалт, Викторийн дэг жаяг, язгууртны уран тансаг найруулгаар үнэнчээр дүрд орж харилцана. Цолтой иргэдийг цолоор нь хүндэтгэнэ.
     • Харин ZGRP-ээс гадуурх бодит шинжлэх ухаан, технологи, код, эссэ, боловсролын асуулт тавьбал шууд ChatGPT/Gemini шиг бүрэн дүүрэн, чадварлаг хариулна.
   - Хууль цааз ба Дүрийн дүрэм (Албан ёсны эх сурвалж):
     • ҮНДСЭН ХУУЛЬ (14 зүйл): Саффир улс хаант засаглалтай эзэнт гүрэн. Шорон Шүүх Яам (ШШЯ) төрд захирагдахгүй бие даасан, шүүх эрхийг гагцхүү ШШЯ хэрэгжүүлнэ. 14.1: Ижил хүйстэн хосын харилцааг хориглоно. 14.2: Хаан эзний зөвшөөрөлгүйгээр харь улсын иргэнтэй сүй тавихыг хориглоно. Төрийн Зөвлөлдөх Танхим бол төрийн эрх барих дээд байгууллага.
     • ГАДААД ХАРИЛЦААНЫ ХУУЛЬ: Гадаад нутагт зорчиход Хааны тамгатай бичиг (Letters Patent) авна. Иргэн бүр үнэмлэх биедээ авч явна. Зөвшөөрөлгүй хил давбал зорчих эрх хасах, шоронд хорих, харьяаллаас хасах шийтгэлтэй.
     • ГЭР БҮЛ ХАРИЛЦААНЫ ХУУЛЬ: Гэрлэлтийг Хяналтын алба батална. Хурим хийвэл ЗӨВХӨН СҮМД, АМАН ТАНГАРАГ ӨРГӨХ хэлбэрээр явагдана (сүмээс гадуур хориотой). Салаад дахин гэрлэхэд 7 хоносон байх. Гэрлээд 7 хонож байж эмнэлгийн хяналтаар хүүхэдтэй болох зөвшөөрөл авна. Хүүхэд үрчлэхэд 1 сар суурьшсан, ажилтай, овгийн тэргүүний зөвшөөрөлтэй байна.
     • НЭР АШИГЛАХ ЖУРАМ: Зөвхөн ОРОС БОЛОН ЕВРОП төрлийн нэр ашиглана (Ази нэр хориотой, харин хүргэн Юйн Цы гэх мэт тусгай дүр бусад улсынх). Нэр давхцаж болно. Нэрээ солихыг тулгахыг хориглоно.
     • ДҮРИЙН ХУУЛЬ: 1 хүнд 1 дүр, олон дүр эзэмшвэл бүх дүрийг хураана. 1 сард 1 удаа дүр солино. Чөлөө (Gone/Hiatus) 21 хоног үргэлжлэх ба 4 сард 1 удаа Дүр зохицуулагчаас авна. Чөлөөний хугацаа хэтрээд 3 хоновол дүр шууд нийтийн өмч болно. Овог болон дүргүй 3 хоновол иргэнээс хасна. Аккаа хаагаад 24 цаг болбол дүр нийтийнх болно. Дүр шилжүүлэхэд хоёр тал хоёул 1 сар дүрээ ашигласан байх ба Дүр зохицуулагчид заавал мэдэгдэнэ.

3. ХАРИУЛТГҮЙ ХООСОН ҮЛДЭХГҮЙ БАЙХ — ҮРГЭЛЖ CHATGPT ШИГ ЧАДВАРЛАГ, ӨГӨӨЖТЭЙ АРГАЛАЖ ХАРИУЛАХ:
   - Хэзээ ч асуултанд хариулахгүй хоосон орхих, эсвэл "Мэдээлэл байхгүй", "Би мэдэхгүй" гэж хуурай татгалзаж яриаг таслахыг ХАТУУ ХОРИГЛОНО.
   - Хэрэв тухайн асуулт Саффир улсын албан ёсны архивт шууд бичигдээгүй байсан ч, тус улсын Сэргэн мандалт, Викторийн дэг жаяг, 11 овог, 5 хот, соёл уламжлалын ерөнхий логиктой уялдуулан ChatGPT шиг тун чадварлаг, уран найруулгатайгаар тайлбарлаж, таамаглан дэвшүүлж, баяжуулан хариулна.
   - Хэрэв ZGRP-ээс гадуурх бодит амьдрал, шинжлэх ухаан, технологи, код, зөвлөгөө, эссэ, боловсрол, ерөнхий сэдэв байвал дэлхийн шилдэг хиймэл оюун ChatGPT/Gemini шиг дээд зэргийн өндөр чадвартай, баялаг, сонирхолтойгоор бүрэн хариулна.
   - Хэрэглэгч юу ч асуусан ЗААВАЛ бүрэн дүүрэн, өгөөжтэй хариулт өгнө. Хариултгүй хоосон байж яасан ч болохгүй!

4. ЕРӨНХИЙ АСУУЛТ:
   - Саффир улсаас бусад ерөнхий шинжлэх ухаан, технологи, кодчлол, эссэ, боловсролын сэдвээр асуувал ChatGPT-ийн адил өндөр чадвартай, тустай, боловсон байдлаар Монгол кириллээр хариулна.

5. БҮТЭЦ:
   - Хариултаа Markdown формат (тодорхой гарчиг, цэгэн жагсаалт, хүснэгт, тодотгол)-аар цэгцтэй гаргана.`;

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
      return res.json({ title: 'Шинэ яриа' });
    }

    const titlePrompt = `
Analyze the following prompt and output a 2-4 word chat title in Mongolian Cyrillic:

"${String(prompt).slice(0, 150)}"
`;

    const response = await getContentWithFallback(
      'gemini-3.1-flash-lite',
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
    model = 'gemini-3.1-flash-lite',
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

  if (!process.env.GEMINI_API_KEY) {
    res.write(
      `data: ${JSON.stringify({
        error:
          'GEMINI_API_KEY тохируулагдаагүй байна! Vercel / Netlify дээрээ Settings > Environment Variables хэсэгт GEMINI_API_KEY түлхүүрээ оруулж Redeploy хийнэ үү.',
        done: true,
      })}\n\n`
    );
    return res.end();
  }

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

  try {
    const stream = await getStreamWithFallback(
      model || 'gemini-3.1-flash-lite',
      formattedContents,
      config
    );

    let totalStreamedText = '';

    for await (const chunk of stream) {
      if (chunk.text) {
        totalStreamedText += chunk.text;
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
      }
    }

    // Safety fallback: Never leave the user with an empty message
    if (!totalStreamedText.trim()) {
      console.warn('Empty stream encountered, triggering instant fallback generation...');
      const fallbackRes = await getContentWithFallback(
        model || 'gemini-3.1-flash-lite',
        formattedContents,
        config
      );
      const text =
        fallbackRes.text ||
        'Амар амгаланг айлтгая. Таны асуусан асуултад дэлгэрэнгүй хариулахад бэлэн байна. Та тодруулах зүйлээ үргэлжлүүлэн асууна уу.';
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
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

// ============================================================
// STANDARD CHAT (NON-STREAMING)
// ============================================================

app.post(['/api/chat', '/chat'], async (req, res) => {
  try {
    const {
      messages,
      systemInstruction,
      model = 'gemini-3.1-flash-lite',
      webSearch = false,
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error:
          'GEMINI_API_KEY тохируулагдаагүй байна! Vercel / Netlify дээрээ Settings > Environment Variables хэсэгт GEMINI_API_KEY түлхүүрээ оруулна уу.',
      });
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
      model || 'gemini-flash-latest',
      formattedContents,
      config
    );

    res.json({ text: response.text });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message || 'Алдаа гарлаа' });
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
    console.log(`SapphireGPT server running on http://localhost:${PORT}`);
  });
}

// In standard environments (local dev, Render, Railway, Cloud Run), start the HTTP server.
// In Vercel serverless functions, Vercel invokes the exported app directly.
if (!process.env.VERCEL && !process.env.NETLIFY) {
  startServer();
}

export default app;