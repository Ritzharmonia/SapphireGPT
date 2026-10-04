import React, { useState } from 'react';
import {
  X,
  Crown,
  Users,
  MapPin,
  Scroll,
  Ship,
  Globe,
  Send,
  ExternalLink,
  BookOpen,
  Building2,
  ShieldAlert,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { SapphireIcon } from './SapphireIcon';

interface SapphireLoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskPrompt: (prompt: string) => void;
}

export const SapphireLoreModal: React.FC<SapphireLoreModalProps> = ({
  isOpen,
  onClose,
  onAskPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<
    'citizens' | 'rulers' | 'institutions' | 'rules' | 'seasons' | 'cities' | 'ranks' | 'decrees' | 'zgrp'
  >('citizens');

  if (!isOpen) return null;

  const handleAsk = (prompt: string) => {
    onAskPrompt(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#070c24] border border-[#1d2f6f] shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#142252] bg-[#091130]">
          <div className="flex items-center gap-3">
            <SapphireIcon size={30} glow={false} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Саффир Улсын Төрийн Мэдлэгийн Сан
                </h2>
                <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300 border border-sky-500/30">
                  ZGRP
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Саффир улсын түүх, иргэдийн бүртгэл, хууль дүрэм, 11 яам, 11 хувийн байгууллага, 5 хот
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-[#14214f] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#142252] bg-[#060a1c] overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('citizens')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'citizens'
                ? 'bg-blue-600/30 text-white border border-blue-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1538]'
            }`}
          >
            <Users size={14} className="text-white" />
            <span className="font-semibold text-white">Бүх Иргэд (11 Овог)</span>
          </button>

          <button
            onClick={() => setActiveTab('rulers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'rulers'
                ? 'bg-blue-600/30 text-white border border-blue-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1538]'
            }`}
          >
            <Crown size={14} className="text-white" />
            <span>10 Төрийн Тэргүүн</span>
          </button>

          <button
            onClick={() => setActiveTab('institutions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'institutions'
                ? 'bg-blue-600/30 text-sky-300 border border-blue-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1538]'
            }`}
          >
            <Building2 size={14} />
            <span>Байгууллагууд (11+11)</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'rules'
                ? 'bg-blue-600/30 text-sky-300 border border-blue-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1538]'
            }`}
          >
            <ShieldAlert size={14} />
            <span>Улсын & Freedom Дүрэм</span>
          </button>

          <button
            onClick={() => setActiveTab('seasons')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'seasons'
                ? 'bg-blue-600/30 text-sky-300 border border-blue-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1538]'
            }`}
          >
            <Calendar size={14} />
            <span>Улирал & Никний Бэлгэдэл</span>
          </button>

          <button
            onClick={() => setActiveTab('cities')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'cities'
                ? 'bg-blue-600/30 text-sky-300 border border-blue-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1538]'
            }`}
          >
            <MapPin size={14} />
            <span>5 Хот & Овгууд</span>
          </button>

          <button
            onClick={() => setActiveTab('ranks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'ranks'
                ? 'bg-blue-600/30 text-sky-300 border border-blue-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1538]'
            }`}
          >
            <Scroll size={14} />
            <span>30 Цол Хэргэм</span>
          </button>

          <button
            onClick={() => setActiveTab('decrees')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'decrees'
                ? 'bg-blue-600/30 text-sky-300 border border-blue-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1538]'
            }`}
          >
            <Ship size={14} />
            <span>Зарлиг, Титэм & Хөлгүүд</span>
          </button>

          <button
            onClick={() => setActiveTab('zgrp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'zgrp'
                ? 'bg-blue-600/30 text-sky-300 border border-blue-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1538]'
            }`}
          >
            <Globe size={14} />
            <span>ZGRP-ийн 6 Улс</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          {/* TAB 0: CITIZENS (БҮХ ИРГЭД) */}
          {activeTab === 'citizens' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#142252]">
                <div>
                  <h3 className="text-sm font-bold text-white">Саффир Улсын Бүртгэгдсэн Бүх Иргэд</h3>
                  <p className="text-xs text-slate-400">
                    Улсын албан ёсны бүртгэлд бүртгэгдсэн 11 овог, цол хэргэм ба гадаад хүргэн Юйн Цы
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleAsk('Саффир улсын бүх иргэдийг овгоор нь дэлгэрэнгүй жагсааж, тусгайлан хүргэн Юйн Цыгийн талаар мэдээлэл өгөөч.')
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <Send size={12} />
                  <span>Чат руу илгээх</span>
                </button>
              </div>

              {/* Special Yunqi card */}
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/40 text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">Mister Yunqi = Юйн Цы</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-medium text-[10px]">
                    Тианши улсаас хүрэлцэн ирсэн хүргэн
                  </span>
                </div>
                <p className="text-slate-300">
                  <b>Овог:</b> Линхиа'Ву (Тианши улс) • <b>Гэргий:</b> Grand Duchess Roxana Obelia (Их Гүнгийн хатан Роксана Обелиа)
                </p>
              </div>

              {/* 11 Houses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* 1. OBELIA */}
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#142252] mb-2">
                    <span className="font-bold text-white text-sm">1. 𝐎𝐁𝐄𝐋𝐈𝐀 / Обелиа (14)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Хааны гэр бүл</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Mister Adrien Obelia</li>
                    <li>• Miss Athanasia Obelia</li>
                    <li>• Mister Iskander Obelia</li>
                    <li>• Miss Wiolet Obelia</li>
                    <li>• Mister Killian Obelia</li>
                    <li>• <b className="text-white">Prince Claude Obelia</b> (Ханхүү Клод)</li>
                    <li>• Mister Jekiel Obelia</li>
                    <li>• <b className="text-white">Grand Duke Ivan Obelia</b> (Их Гүн Иван)</li>
                    <li>• Miss Griselda Obelia</li>
                    <li>• Miss Ioanna Obelia</li>
                    <li>• <b className="text-white">Viscountess Isabella Obelia</b> (Виконтесс Изабелла)</li>
                    <li>• Miss Solace Obelia</li>
                    <li>• Miss Winter Obelia (Уран зургийн галерейн тэргүүн)</li>
                    <li>• <b className="text-white">Baron Zaifer Obelia</b> (Барон Зайфер — Сүм, Ресторан)</li>
                  </ul>
                </div>

                {/* 2. MONTAQUE */}
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#142252] mb-2">
                    <span className="font-bold text-white text-sm">2. 𝐌𝐎𝐍𝐓𝐀𝐐𝐔𝐄 / Монтакью (15)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Төрийн тэргүүний овог</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• <b className="text-white">Monarch Libertia Von Montaque</b> (10-р төрийн тэргүүн, Хатан хаан)</li>
                    <li>• Lord Caerwyn Von Montaque (Модон урлал)</li>
                    <li>• Miss Columbina Von Montaque (Цэцгийн дэлгүүр)</li>
                    <li>• Mister Edmon Von Montaque</li>
                    <li>• Mister Elios Montaque</li>
                    <li>• Miss Elodie Von Montaque</li>
                    <li>• Miss Furina Von Montaque</li>
                    <li>• Miss Ilya Von Montaque</li>
                    <li>• Mister Louis Von Montaque</li>
                    <li>• Miss Myuzi Von Montaque</li>
                    <li>• <b className="text-white">Mayor Ren Von Montaque</b> (Хяналтын алба, Захирагч)</li>
                    <li>• Miss Rosemary Von Montaque</li>
                    <li>• Lord Siegren Von Montaque</li>
                    <li>• <b className="text-white">Princess Tiara Von Montaque</b> (Гүнж Тиара)</li>
                    <li>• Miss Alena Von Montaque</li>
                  </ul>
                </div>

                {/* 3. CHARMIELL */}
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#142252] mb-2">
                    <span className="font-bold text-white text-sm">3. 𝐂𝐇𝐀𝐑𝐌𝐈𝐄𝐋𝐋 / Чармиелл (23)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Язгууртан овог</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• <b className="text-white">Grand Chancellor Caesar Charmiell</b> (Их Канцлер)</li>
                    <li>• <b className="text-white">Countess Lydia Charmiell</b> (Гүнгийн хатан — Гадаад яам, Боомт)</li>
                    <li>• <b className="text-white">Marchioness Serena Charmiell</b> (Маркиза — Эрүүл мэндийн яам)</li>
                    <li>• Baron Ron Charmiell (Архины дэлгүүр)</li>
                    <li>• Baroness Ravenna Charmiell</li>
                    <li>• Miss Rosalyn Charmiell (Weekly news)</li>
                    <li>• Miss Lilith Charmiell</li>
                    <li>• Miss Mina Charmiell</li>
                    <li>• Mister Thibaulté Charmiell</li>
                    <li>• Mister Dain Charmiell</li>
                    <li>• Mister Moori Charmiell</li>
                    <li>• Miss Adelina Charmiell</li>
                    <li>• Miss Aisha Charmiell</li>
                    <li>• Miss Chuu Charmiell</li>
                    <li>• Miss Erliya Charmiell</li>
                    <li>• Miss Helena Charmiell</li>
                    <li>• Mister Noel Charmiell</li>
                    <li>• Miss Nina Charmiell</li>
                    <li>• Miss Evangelion Charmiell</li>
                    <li>• Miss Rosetta Charmiell</li>
                    <li>• Miss Shuri Charmiell</li>
                    <li>• Miss Villenette Charmiell</li>
                    <li>• Miss Violet Charmiell</li>
                  </ul>
                </div>

                {/* 4. DIMITRY SERGEYEV */}
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#142252] mb-2">
                    <span className="font-bold text-white text-sm">4. 𝐃𝐈𝐌𝐈𝐓𝐑𝐘 𝐒𝐄𝐑𝐆𝐄𝐘𝐄𝐕 / Сергьев (13)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Язгууртан овог</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Mister Alexander Dmitry Sergeyev</li>
                    <li>• Mister Ayato Dmitry Sergeyev</li>
                    <li>• Mister Ilay Dmitry Sergeyev</li>
                    <li>• <b className="text-white">Mister Vlad Dmitry Sergeyev</b> (Ан агнуур, Казино)</li>
                    <li>• Mister Leon Dmitry Sergeyev</li>
                    <li>• Mister Raziel Dmitry Sergeyev</li>
                    <li>• Mister Veon Dmitry Sergeyev</li>
                    <li>• Mister Ian Dmitry Sergeyev</li>
                    <li>• Mister Juhu Dmitry Sergeyev</li>
                    <li>• Mister Beckham Dmitry Sergeyev</li>
                    <li>• Mister Azriel Dmitry Sergeyev</li>
                    <li>• Mister Aether Dmitry Sergeyev</li>
                    <li>• Mister Lukiyan Dmitry Sergeyev</li>
                  </ul>
                </div>

                {/* 5. CRESCENTIA */}
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#142252] mb-2">
                    <span className="font-bold text-white text-sm">5. 𝐂𝐑𝐄𝐒𝐂𝐄𝐍𝐓𝐈𝐀 / Крецентиа (11)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Язгууртан овог</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Mister Balthazar Luc Crescentia</li>
                    <li>• Mister Finn Luc Crescentia</li>
                    <li>• Mister Matthew Luc Crescentia</li>
                    <li>• Mister Arnold Luc Crescentia</li>
                    <li>• Miss Elaris Luc Crescentia</li>
                    <li>• Miss Vanessa Luc Crescentia</li>
                    <li>• Miss Seira Luc Crescentia</li>
                    <li>• Mister Carlton Luc Crescentia</li>
                    <li>• Miss Lucianna Luc Crescentia</li>
                    <li>• Mister Astorias Luc Crescentia</li>
                    <li>• Miss Syrine Luc Crescentia</li>
                  </ul>
                </div>

                {/* 6. AGRICHE */}
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#142252] mb-2">
                    <span className="font-bold text-white text-sm">6. 𝐀𝐆𝐑𝐈𝐂𝐇𝐄 / Агриче (9)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Язгууртан овог</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• <b className="text-white">Duke Andras Agriche</b> (Гүн Андрес — Соёл урлагийн яам)</li>
                    <li>• <b className="text-white">Viscount Carlisle Agriche</b> (Виконт Карлисле — Шорон шүүх)</li>
                    <li>• Miss Clairvoyant Agriche</li>
                    <li>• Miss January Agriche</li>
                    <li>• Miss Marigold Agriche</li>
                    <li>• Miss Viola Agriche</li>
                    <li>• Mister Dion Agriche</li>
                    <li>• Mister Julian Agriche</li>
                    <li>• Miss Ivy Agriche</li>
                  </ul>
                </div>

                {/* 7. CASTIGLIONE */}
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#142252] mb-2">
                    <span className="font-bold text-white text-sm">7. 𝐂𝐀𝐒𝐓𝐈𝐆𝐋𝐈𝐎𝐍𝐄 / Кастильоне (8)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Эрдэмтэн овог</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• <b className="text-white">Astronomer Elise La Castiglione</b> (Одон орон судлал, Номын сан)</li>
                    <li>• Mister Kazuha La Castiglione</li>
                    <li>• Miss Anastasia La Castiglione</li>
                    <li>• Miss Chloé La Castiglione</li>
                    <li>• Miss Thalia La Castiglione</li>
                    <li>• Mister Hyropatir La Castiglione</li>
                    <li>• Mister Aze La Castiglione</li>
                    <li>• Miss Odette La Castiglione</li>
                  </ul>
                </div>

                {/* 8. BISMARCK */}
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#142252] mb-2">
                    <span className="font-bold text-white text-sm">8. 𝐁𝐈𝐒𝐌𝐀𝐑𝐂𝐊 / Бисмарк (7)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Язгууртан овог</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Miss Irine Bismarck</li>
                    <li>• Mister Christopher Bismarck</li>
                    <li>• Mister Leewon Bismarck</li>
                    <li>• Miss Goldwyn Bismarck</li>
                    <li>• Miss Ayna Bismarck</li>
                    <li>• Miss Sophia Bismarck</li>
                    <li>• Miss Violet Bismarck</li>
                  </ul>
                </div>

                {/* 9. VENSANTING */}
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#142252] mb-2">
                    <span className="font-bold text-white text-sm">9. 𝐕𝐄𝐍𝐒𝐀𝐍𝐓𝐈𝐍𝐆 / Венсантин (5)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Язгууртан овог</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Miss Ashley Vensanting</li>
                    <li>• Miss Elena Vensanting</li>
                    <li>• Miss Josette Vensanting</li>
                    <li>• Miss Valentina Vensanting</li>
                    <li>• Mister Rias Vensanting</li>
                  </ul>
                </div>

                {/* 10. VON DUNKELHEIT */}
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#142252] mb-2">
                    <span className="font-bold text-white text-sm">10. 𝐕𝐎𝐍 𝐃𝐔𝐍𝐊𝐄𝐋𝐇𝐄𝐈𝐓 / Дүнкелхаят (4)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Язгууртан овог</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• Mister Moscow Von Dunkelheit</li>
                    <li>• Miss Meta Von Dunkelheit</li>
                    <li>• Mister Atil Von Dunkelheit</li>
                    <li>• Mister Mydeimos Vin Dunkelheit</li>
                  </ul>
                </div>

                {/* 11. AVREVIELLE */}
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#142252] mb-2">
                    <span className="font-bold text-white text-sm">11. 𝐀𝐕𝐑𝐄𝐕𝐈𝐄𝐋𝐋𝐄 / Авревиелль (3)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Язгууртан овог</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    <li>• <b className="text-white">Lady Heiying Avrevielle</b> (Хатагтай Хэй'Ейн — Цаг уурын яам, Гоо сайхан)</li>
                    <li>• Miss Velit Avrevielle</li>
                    <li>• Miss Scarlett Avrevielle</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: RULERS */}
          {activeTab === 'rulers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#142252]">
                <div>
                  <h3 className="text-sm font-bold text-white">Саффир улсын 10 төрийн тэргүүн</h3>
                  <p className="text-xs text-slate-400">
                    Эртний Vanchellsing эзэнт гүрнээс эхлээд одоогийн 10-р тэргүүн Либертиа Вон Монтакью хүртэл
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleAsk('Саффир улсын 10 төрийн тэргүүний түүх, тэдний засаглалын онцлогийг дэлгэрэнгүй тайлбарлана уу.')
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <Send size={12} />
                  <span>Дэлгэрэнгүй асуух</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#19275f]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300">1. ROXANA VANCHELLSING</span>
                    <span className="text-[10px] text-slate-400 bg-[#050818] px-2 py-0.5 rounded">Анхны хатан</span>
                  </div>
                  <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                    Анхны вант улс Зжрп-ийг үүсгэн байгуулагч. Хаан Claude Vanchellsing-ийн хамт улсын гол багана болсон. 5 үр: Carmen, Athanasia, Francisco, Ariadne, Emeliet.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#19275f]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300">2. CARMEN VANCHELLSING</span>
                    <span className="text-[10px] text-slate-400 bg-[#050818] px-2 py-0.5 rounded">2-р хатан</span>
                  </div>
                  <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                    Roxana хатны ууган охин. 18-тайдаа хатан болсон. Түүхэнд 2 нөхөртэй байсан цорын ганц хатан. Ихэр гүнж: Этан ба Росалиа. 23-тайдаа таалал төгссөн.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#19275f]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300">3. RAPHAEL MIZELIAN</span>
                    <span className="text-[10px] text-slate-400 bg-[#050818] px-2 py-0.5 rounded">Анхны хаан</span>
                  </div>
                  <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                    Ванхэллисэнг бослогын үед Керис (Саффир)-ийн үндсийг тавьсан. Алдарт үг: <i>"Харилцаанаас харьцлаа, хүндлэлээс хүндлэл."</i> Хатан Serena, охин Haesa.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#19275f]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300">4. SERENA SERENITY</span>
                    <span className="text-[10px] text-slate-400 bg-[#050818] px-2 py-0.5 rounded">Шинэчлэгч хатан</span>
                  </div>
                  <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                    Raphael хааныг нас барсны дараа хатан болсон. Зжрп-ийн хуучинсаг ёс жаягийг халж, улс үндэстэнд шинэ эрин авчирсан зоримог удирдагч.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#19275f]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300">5. ERIS MIZELIAN</span>
                    <span className="text-[10px] text-slate-400 bg-[#050818] px-2 py-0.5 rounded">Анхны хатан хаан</span>
                  </div>
                  <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                    Энэрэл ба эр зоригийн нэгдэл. 3 овгийн хамтын хүч, ард түмний итгэлээр өргөмжлөгдсөн. Зарчим: Шударга ёс, эв нэгдэл, иргэдийн дуу хоолой.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#19275f]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300">6. CLAUDE DE ALGER OBELIA</span>
                    <span className="text-[10px] text-slate-400 bg-[#050818] px-2 py-0.5 rounded">2 дахь хаан</span>
                  </div>
                  <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                    Эрис хатны том хүү. Хаан суудлыг энх амгалангаар залгамжилсан. Төлөв даруу, дуу цөөтэй, гүн ухаан тээгч нам гүм удирдагч.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#19275f]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300">7. RUDBECKIA DE ALGER OBELIA</span>
                    <span className="text-[10px] text-slate-400 bg-[#050818] px-2 py-0.5 rounded">3 дахь хатан</span>
                  </div>
                  <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                    Эрис хатны бага охин. Ширүүн шуурга мэт тод, эрхэмсэг, шийдэмгий шинэ үеийн төлөөлөл. "Итгэлтэй үед түшиг, хүнд үед дуулгавартай биш ухаантай удирдагч".
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#19275f]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300">8. LUCAS DE ALGER OBELIA</span>
                    <span className="text-[10px] text-slate-400 bg-[#050818] px-2 py-0.5 rounded">3 дахь хаан</span>
                  </div>
                  <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                    Эрис хатны дундах хүү. Дөлгөөн хэрнээ тэсрэх эрч хүчтэй. Гэргий Aisha Agriche-ийн хамт 2 хүү, 1 охин өсгөсөн.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#091130] border border-[#19275f]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300">9. DION AGRICHE & CHARTERIS</span>
                    <span className="text-[10px] text-slate-400 bg-[#050818] px-2 py-0.5 rounded">28-р он (9 он засагласан)</span>
                  </div>
                  <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                    Dion: Керисийг Зжрп-д албан ёсоор оруулж хуулийн үндсийг тавьсан. Charteris хаан Ариа Агриче хатны хамт 9 он төр барьж, цол хэргэм, урлагийн яамыг шинэчилсэн.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0c1a4d] to-[#122363] border border-blue-500/60 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Crown size={15} className="text-white" />
                      10. LIBERTIA VON MONTAQUE
                    </span>
                    <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">
                      Одоогийн Хатан Хаан
                    </span>
                  </div>
                  <p className="mt-1 text-slate-200 text-xs leading-relaxed">
                    10-р төрийн тэргүүн, 6 дахь хатан хаан. 2026.08.06-нд сэнтийд залрав. 40-р онд Сэргэн мандалтын эрин үеийг зарлаж, 4 Их хөлөг онгоц, шинэ ордон, Хүндэт титмийг тунхаглав.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INSTITUTIONS (11 State + 11 Private) */}
          {activeTab === 'institutions' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#142252]">
                <div>
                  <h3 className="text-sm font-bold text-white">Саффир улсын байгууллагууд</h3>
                  <p className="text-xs text-slate-400">Төрийн захиргааны 11 байгууллага ба Хувийн 11 байгууллага</p>
                </div>
                <button
                  onClick={() =>
                    handleAsk('Саффир улсын төрийн 11 яам ба хувийн 11 байгууллагын нэрс, яамны тэргүүнүүдийг дэлгэрэнгүй жагсааж тайлбарлаж өгөөч.')
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <Send size={12} />
                  <span>Чат руу илгээх</span>
                </button>
              </div>

              {/* State Ministries */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                  <Building2 size={14} />
                  <span>ТӨРИЙН ЗАХИРГААНЫ БАЙГУУЛЛАГУУД (11)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#091130] border border-[#162558]">
                    <b className="text-sky-300">♯1 ⋮ Эдийн Засгийн Яам</b>
                    <div className="text-slate-300 text-[11.5px] mt-0.5">Яамны тэргүүн: Либертиа Вон Монтакью</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#091130] border border-[#162558]">
                    <b className="text-sky-300">♯2 ⋮ Хөдөлмөр Зохицуулалтын Яам</b>
                    <div className="text-slate-300 text-[11.5px] mt-0.5">Яамны тэргүүн: Либертиа Вон Монтакью</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#091130] border border-[#162558]">
                    <b className="text-sky-300">♯3 ⋮ Шорон Шүүх Яам</b>
                    <div className="text-slate-300 text-[11.5px] mt-0.5">Яамны тэргүүн: Карлисле Агриче</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#091130] border border-[#162558]">
                    <b className="text-sky-300">♯4 ⋮ Эрүүл Мэндийн Яам</b>
                    <div className="text-slate-300 text-[11.5px] mt-0.5">Яамны тэргүүн: Серена Чармиелл</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#091130] border border-[#162558]">
                    <b className="text-sky-300">♯5 ⋮ Цаг Уур Мэдээний Яам</b>
                    <div className="text-slate-300 text-[11.5px] mt-0.5">Яамны тэргүүн: Хэй'Ейн Авревиелл</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#091130] border border-[#162558]">
                    <b className="text-sky-300">♯6 ⋮ Гадаад Яам</b>
                    <div className="text-slate-300 text-[11.5px] mt-0.5">Яамны тэргүүн: Лидиа Чармиелл</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#091130] border border-[#162558]">
                    <b className="text-sky-300">♯7 ⋮ Соёл Урлагийн Яам</b>
                    <div className="text-slate-300 text-[11.5px] mt-0.5">Яамны тэргүүн: Андрес Агриче</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#091130] border border-[#162558]">
                    <b className="text-sky-300">♯8 ⋮ Боомт</b>
                    <div className="text-slate-300 text-[11.5px] mt-0.5">Яамны тэргүүн: Лидиа Чармиелл</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#091130] border border-[#162558]">
                    <b className="text-sky-300">♯9 ⋮ Хяналтын Алба</b>
                    <div className="text-slate-300 text-[11.5px] mt-0.5">Байгууллагын тэргүүн: Рен Вон Монтакью</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#091130] border border-[#162558]">
                    <b className="text-sky-300">♯10 ⋮ Долоо хоногийн мэдээ / Weekly news</b>
                    <div className="text-slate-300 text-[11.5px] mt-0.5">Байгууллагын тэргүүн: Росалин Чармиелл</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#091130] border border-[#162558] sm:col-span-2">
                    <b className="text-sky-300">♯11 ⋮ Католик Сүм</b>
                    <div className="text-slate-300 text-[11.5px] mt-0.5">Байгууллагын тэргүүн: Зайфер Де Алгер Обелиа</div>
                  </div>
                </div>
              </div>

              {/* Private Businesses */}
              <div className="space-y-2 pt-2 border-t border-[#142252]">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>САФФИР УЛСЫН ХУВИЙН БАЙГУУЛЛАГУУД (11)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#060a1c] border border-[#131e47]">
                    <b className="text-indigo-300">♯1 ⋮ Цэцгийн дэлгүүр</b>
                    <div className="text-slate-400 text-[11.5px] mt-0.5">Тэргүүн: Колумбина Вон Монтакью</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060a1c] border border-[#131e47]">
                    <b className="text-indigo-300">♯2 ⋮ Архины дэлгүүр</b>
                    <div className="text-slate-400 text-[11.5px] mt-0.5">Тэргүүн: Рон Чармиелл</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060a1c] border border-[#131e47]">
                    <b className="text-indigo-300">♯3 ⋮ Гоо сайхны дэлгүүр</b>
                    <div className="text-slate-400 text-[11.5px] mt-0.5">Тэргүүн: Хэй'Ейн Авревиелл</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060a1c] border border-[#131e47]">
                    <b className="text-indigo-300">♯4 ⋮ Одон орон судлалын төв</b>
                    <div className="text-slate-400 text-[11.5px] mt-0.5">Тэргүүн: Элис Кастильоне</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060a1c] border border-[#131e47]">
                    <b className="text-indigo-300">♯5 ⋮ Номын сан</b>
                    <div className="text-slate-400 text-[11.5px] mt-0.5">Тэргүүн: Элис Кастильоне</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060a1c] border border-[#131e47]">
                    <b className="text-indigo-300">♯6 ⋮ Модон урлалын дэлгүүр</b>
                    <div className="text-slate-400 text-[11.5px] mt-0.5">Тэргүүн: Каервин Вон Монтакью</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060a1c] border border-[#131e47]">
                    <b className="text-indigo-300">♯7 ⋮ Ан агнуурын дэлгүүр</b>
                    <div className="text-slate-400 text-[11.5px] mt-0.5">Тэргүүн: Влад Дмитрий Сергьев</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060a1c] border border-[#131e47]">
                    <b className="text-indigo-300">♯8 ⋮ Уран зураг / Галерей</b>
                    <div className="text-slate-400 text-[11.5px] mt-0.5">Тэргүүн: Винтер Де Алгер Обелиа</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060a1c] border border-[#131e47]">
                    <b className="text-indigo-300">♯9 ⋮ Амттаны дэлгүүр</b>
                    <div className="text-slate-400 text-[11.5px] mt-0.5">Тэргүүн: Элиас Чармиелл</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060a1c] border border-[#131e47]">
                    <b className="text-indigo-300">♯10 ⋮ Казино</b>
                    <div className="text-slate-400 text-[11.5px] mt-0.5">Тэргүүн: Влад Дмитрий Серсъев</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060a1c] border border-[#131e47] sm:col-span-2">
                    <b className="text-indigo-300">♯11 ⋮ Ресторан</b>
                    <div className="text-slate-400 text-[11.5px] mt-0.5">Тэргүүн: Зайфер Де Алгер Обелиа</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RULES (State Rules + Freedom Group Rules) */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#142252]">
                <div>
                  <h3 className="text-sm font-bold text-white">Саффир улсын дүрэм журам</h3>
                  <p className="text-xs text-slate-400">Улсын бүлгэмд мөрдөгдөх дүрэм ба Freedom бүлгэмийн дүрэм</p>
                </div>
                <button
                  onClick={() =>
                    handleAsk('Саффир улсад мөрдөгдөх 6 дүрэм болон Freedom бүлгэмийн дүрмүүдийг бүрэн тайлбарлаж өгөөч.')
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <Send size={12} />
                  <span>Чат руу илгээх</span>
                </button>
              </div>

              {/* State Rules */}
              <div className="p-4 rounded-xl bg-[#091130] border border-[#1a2b66] space-y-2">
                <div className="flex items-center gap-2 font-bold text-sky-300 text-xs">
                  <ShieldAlert size={15} />
                  <span>САФФИР УЛСАД МӨРДӨГДӨХ ДҮРМҮҮД (УЛСЫН БҮЛГЭМ)</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li><b>Latin үсгээр бичих, quick reaction дарахыг хориглоно.</b></li>
                  <li><b>Эрхэм дээдэс, хаан угсаа, өөрөөс ахимаг нас, цол хэргэмтэй нэгэнтэй хүндэтгэлтэй харьцана.</b> (Өөрөөсөө дээд албан тушаалын хүмүүст ёслохоо мартуузай).</li>
                  <li><b>Улсын бүлгэмд идэвхтэй дүрд орно.</b> Тиймд freedom бүлгэмд хэт удаан маазарч, улсын бүлгэмээ хаягдуулахгүй байх.</li>
                  <li><b>Улсын дэг журмыг санаатай болон санаандгүйгээр зөрчиж, улсын хөгжил дэвшилд халгаатай хорт явуулга үйлдэхгүй, улсад далд санаа өвөрлөхгүй байх.</b></li>
                  <li><b>Гэмт хэрэг үйлдэх, хэн нэгнийг дээрэлхэх, олуулаа нийлэн хэрүүл маргаан үүсгэх, төрийн ажилчдын эсрэг эсэргүү зарлахыг хориглоно.</b></li>
                  <li><i>Эдгээр дүрэм freedom бүлгэмд харгалзахгүй.</i></li>
                </ol>
              </div>

              {/* Freedom Rules */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-300 text-xs flex items-center gap-2">
                    <ShieldAlert size={15} />
                    FREEDOM БҮЛГЭМИЙН ДҮРМҮҮД
                  </span>
                  <span className="text-[10px] text-white bg-white/10 px-2 py-0.5 rounded border border-white/20 font-medium">
                    Зөрчвөл 100 алтан зоос хасна
                  </span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed">
                  <li>+18 болон хэт зохисгүй агуулга бүхий nickname бичих, зураг явуулах, садар самуун сурталчлах хориотой.</li>
                  <li>Хараалын үг яриа ашиглан бусдад таагүй нөхцөл байдал үүсгэх хориотой.</li>
                  <li>Хэрүүл маргаан үүсгэх, хэн нэгнийг олноор нийлэн бөөрөлхөх, шүүмжлэх, ил болон далд утгаар өдөөн хатгах хориотой.</li>
                  <li>Voice бичлэг болон өөрийн % зураг явуулах хориотой.</li>
                  <li><b>Хэт их quick reaction даран scam хийж олны тухыг алдуулах хориотой. (Зөрчвөл 100 алтан зоос хасна).</b></li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB: SEASONS & NICKNAMES */}
          {activeTab === 'seasons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#142252]">
                <div>
                  <h3 className="text-sm font-bold text-white">Улирал, Цаг Тоолол ба Никний Бэлгэдэл</h3>
                  <p className="text-xs text-slate-400">
                    Улирлын реакшн, сарын хуваарь ба Roleplay Nickname-ийн албан ёсны эможиуд
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleAsk('Саффир улсын улирлуудын өдрийн хуваарь, реакшн болон Nickname-ийн бүх эможи бэлгэдлийн тайлбарыг өгөөч.')
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <Send size={12} />
                  <span>Чат руу илгээх</span>
                </button>
              </div>

              {/* Time rule */}
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/40 text-xs text-slate-200">
                <span className="font-bold text-sky-300">ЦАГ ХУГАЦААНЫ ХАРЬЦАА:</span> "Саффир улсад 1 жил нь бодит амьдрал дээр 1 сар байна."
                <div className="text-[11px] text-slate-400 mt-1">
                  Улсад таарч дүрд орох гэж буй иргэд никээ сайтар анзаарч, хамтрагчтайгаа цаг үеэ баримталж дүрд орно. Өөрөөсөө дээд албан тушаалтанд ёслохоо мартуузай.
                </div>
              </div>

              {/* Season reactions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-[#091130] border border-[#162558]">
                  <span className="text-xl">🌱</span>
                  <div className="font-bold text-white mt-1">ХАВАР</div>
                  <div className="text-[11px] text-slate-400">1 - 7-ны өдөр</div>
                </div>
                <div className="p-3 rounded-xl bg-[#091130] border border-[#162558]">
                  <span className="text-xl">🌻</span>
                  <div className="font-bold text-white mt-1">ЗУН</div>
                  <div className="text-[11px] text-slate-400">8 - 14-ний өдөр</div>
                </div>
                <div className="p-3 rounded-xl bg-[#091130] border border-[#162558]">
                  <span className="text-xl">🍂</span>
                  <div className="font-bold text-white mt-1">НАМАР</div>
                  <div className="text-[11px] text-slate-400">15 - 21-ний өдөр</div>
                </div>
                <div className="p-3 rounded-xl bg-[#091130] border border-[#162558]">
                  <span className="text-xl">❄️</span>
                  <div className="font-bold text-sky-300 mt-1">ӨВӨЛ</div>
                  <div className="text-[11px] text-slate-400">22-ноос сарын сүүлч</div>
                </div>
              </div>

              {/* Nickname Emojis */}
              <div className="p-4 rounded-xl bg-[#091130] border border-[#19275f] space-y-2">
                <span className="font-bold text-white text-xs">NICKNAME ТАЙЛБАР (ЭМОЖИ БЭЛГЭДЭЛ):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#060a1c] border border-[#14214f]">
                    <span className="text-base">👑</span>
                    <div><b>Хааны гэр бүл</b> (Royal Family)</div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#060a1c] border border-[#14214f]">
                    <span className="text-base">⚜️</span>
                    <div><b>Цолтой иргэд</b> (Titled Citizens)</div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#060a1c] border border-[#14214f]">
                    <span className="text-base">🕯️</span>
                    <div><b>Язгууртан овгийн ноён</b> (Noble Lord)</div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#060a1c] border border-[#14214f]">
                    <span className="text-base">🦢</span>
                    <div><b>Язгууртан овгийн хатагтай</b> (Noble Lady)</div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#060a1c] border border-[#14214f]">
                    <span className="text-base">🪶</span>
                    <div><b>Эгэл овгийн ноён</b> (Common Clan Lord)</div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#060a1c] border border-[#14214f]">
                    <span className="text-base">🕊️</span>
                    <div><b>Эгэл овгийн хатагтай</b> (Common Clan Lady)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CITIES & LAND */}
          {activeTab === 'cities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#142252]">
                <div>
                  <h3 className="text-sm font-bold text-white">Саффир улсын 5 хот, овгууд ба газрын үнэ</h3>
                  <p className="text-xs text-slate-400">Хотуудын үйлдвэрлэл, баялаг, нутаг дэвсгэрийн зоосны ханш</p>
                </div>
                <button
                  onClick={() =>
                    handleAsk('Саффир улсын 5 хотын онцлог, багтах овгууд болон газрын үнийг бүрэн жагсааж тайлбарлаж өгөөч.')
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <Send size={12} />
                  <span>Чат руу илгээх</span>
                </button>
              </div>

              <div className="space-y-3">
                {/* City 1 */}
                <div className="p-4 rounded-xl bg-[#091130] border border-[#1b2b68]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300 text-sm">𝕮ELESTINE (Селестине) — Нийслэл / Төв хот</span>
                    <span className="text-xs font-semibold text-white">1 га = 1,000,000 | 1 км² = 2,000,000 зоос</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-300 space-y-1">
                    <div><b>Овгууд:</b> 𝐎𝐁𝐄𝐋𝐈𝐀 (Язгууртан) — Тэргүүн: Zaifer De Alger Obelia | 𝐕𝐎𝐍 𝐃𝐔𝐍𝐊𝐄𝐋𝐇𝐄𝐈𝐓 (Эгэл) — Тэргүүн: Moscow Von Dunkelheit</div>
                    <div className="text-slate-400"><b>Онцлог:</b> Төрийн нийслэл хот, Либертиа Хатан хааны ордон, музей болсон хуучин The Royal Palace (Цагаан ордон) байрладаг.</div>
                  </div>
                </div>

                {/* City 2 */}
                <div className="p-4 rounded-xl bg-[#091130] border border-[#1b2b68]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300 text-sm">𝕸ESOPATAMÍA / LUDWINBURG — Зүүн хот</span>
                    <span className="text-xs font-semibold text-white">1 га = 300,000 | 1 км² = 1,000,000 зоос</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-300 space-y-1">
                    <div><b>Овгууд:</b> 𝐌𝐎𝐍𝐓𝐀𝐐𝐔𝐄 (Хааны овог) — Тэргүүн: Libertia Von Montaque | 𝐂𝐀𝐒𝐓𝐈𝐆𝐋𝐈𝐎𝐍𝐄 (Эгэл) — Тэргүүн: Elise La Castiglione</div>
                    <div className="text-slate-400"><b>Онцлог:</b> Жимс, ногоо, цэцэг, эмийн ургамал, шавар, шил, шаазан эдлэл, баримал, модон сийлбэр, энгийн модон хөгжим (хийл, лимбэ, ятга).</div>
                  </div>
                </div>

                {/* City 3 */}
                <div className="p-4 rounded-xl bg-[#091130] border border-[#1b2b68]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300 text-sm">𝕾AINT ELYNTHIA (Сэйнт Элинтиа) — Өмнөд хот</span>
                    <span className="text-xs font-semibold text-white">1 га = 400,000 | 1 км² = 1,000,000 зоос</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-300 space-y-1">
                    <div><b>Овгууд:</b> 𝐂𝐇𝐀𝐑𝐌𝐈𝐄𝐋𝐋 (Хааны тулгуур, язгууртан) — Serena Charmiell | 𝐕𝐄𝐍𝐒𝐀𝐍𝐓𝐈𝐍𝐆 (Эгэл) — Josette De Vensanting | 𝐂𝐑𝐄𝐒𝐂𝐄𝐍𝐓𝐈𝐀 (Эгэл) — Tiara Von Montaque</div>
                    <div className="text-slate-400"><b>Онцлог:</b> Загас, хясаа, далайн бүтээгдэхүүн, шүр, сувд, ноос, ноолуур, торго, дурдан, сүү, мах, өндөг, усанд тэсвэртэй усан онгоц, завь, будаг, олс.</div>
                  </div>
                </div>

                {/* City 4 */}
                <div className="p-4 rounded-xl bg-[#091130] border border-[#1b2b68]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300 text-sm">𝕾UNSET VALE (Сансет Вэйл) — Баруун хот</span>
                    <span className="text-xs font-semibold text-white">1 га = 350,000 | 1 км² = 1,000,000 зоос</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-300 space-y-1">
                    <div><b>Овгууд:</b> 𝐀𝐆𝐑𝐈𝐂𝐇𝐄 (Язгууртан) — Roxana Agriche | 𝐀𝐕𝐑𝐄𝐕𝐈𝐄𝐋𝐋𝐄 (Эгэл) — Hei'Ying Avrevielle</div>
                    <div className="text-slate-400"><b>Онцлог:</b> Алт, мөнгө, үнэт металл, бүх төрлийн үнэт чулуу, эрдэнэс, зоос цутгалт, дархны урлал, буу, тансаг механик тоногтой хөгжим, сүйх тэрэг, тавилга.</div>
                  </div>
                </div>

                {/* City 5 */}
                <div className="p-4 rounded-xl bg-[#091130] border border-[#1b2b68]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300 text-sm">𝕸ONOLITH (Монолит) — Хойд хот</span>
                    <span className="text-xs font-semibold text-white">1 га = 750,000 | 1 км² = 1,000,000 зоос</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-300 space-y-1">
                    <div><b>Овгууд:</b> 𝐃𝐈𝐌𝐈𝐓𝐑𝐘 𝐒𝐄𝐑𝐆𝐄𝐘𝐄𝐕 (Эгэл) — Sylus Dimitry Sergeyev | 𝐁𝐈𝐒𝐌𝐀𝐑𝐂𝐊 (Эгэл) — Claude De Alger Obelia</div>
                    <div className="text-slate-400"><b>Онцлог:</b> Ангийн амьтад, мах, яс, эвэр, үс, хүйтний хувцас, дуулганы арьсан өмсгөл, хар модон зэвсэг, жад, сум, нүүрс, төмөр, зэс, барилгын мод.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 30 RANKS */}
          {activeTab === 'ranks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#142252]">
                <div>
                  <h3 className="text-sm font-bold text-white">Саффир улсын албан ёсны 30 цол хэргэм</h3>
                  <p className="text-xs text-slate-400">Хаан угсаа, Ордны зөвлөхүүд, Дээд ба Дунд язгууртан, Эгэл хүндэт цол</p>
                </div>
                <button
                  onClick={() =>
                    handleAsk('Саффир улсын албан ёсны 30 цол хэргэмийг 6 түвшин тус бүрээр тайлбартай жагсааж өгнө үү.')
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <Send size={12} />
                  <span>Чат руу илгээх</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Rank 1 */}
                <div className="p-3 rounded-xl bg-[#091130] border border-[#172559]">
                  <span className="font-bold text-sky-400">I. ХААН УГСААНЫ ХЭРГЭМ</span>
                  <ul className="mt-1.5 space-y-1 text-slate-300 list-disc list-inside">
                    <li><b>Эрхэм Дээдэс, Төрийн тэргүүн</b> (Her/His Majesty the Monarch)</li>
                    <li><b>1. Хаан</b> (His Majesty the King)</li>
                    <li><b>2. Хатан</b> (Her Majesty the Queen)</li>
                    <li><b>3. Титэмт Ханхүү</b> (Crown Prince)</li>
                    <li><b>4. Титэмт Гүнж</b> (Crown Princess)</li>
                    <li><b>5. Ханхүү</b> (Prince) / <b>6. Гүнж</b> (Princess)</li>
                  </ul>
                </div>

                {/* Rank 2 */}
                <div className="p-3 rounded-xl bg-[#091130] border border-[#172559]">
                  <span className="font-bold text-sky-400">II. ХААНЫ ДЭРГЭДЭХ ДЭЭД АЛБАН ТУШААЛ</span>
                  <ul className="mt-1.5 space-y-1 text-slate-300 list-disc list-inside">
                    <li><b>7. Их Канцлер</b> (Lord Grand Chancellor) — Хааны баруун гар, төрийн ажил удирдана</li>
                    <li><b>8. Хааны Дээд Зөвлөх</b> (Lord High Counselor) — Бодлогын гол зөвлөх</li>
                    <li><b>9. Ордны зарлагч</b> (Court Herald) — Зарлиг, хурлыг нийтэд зарлана</li>
                  </ul>
                </div>

                {/* Rank 3 */}
                <div className="p-3 rounded-xl bg-[#091130] border border-[#172559]">
                  <span className="font-bold text-sky-400">III. ДЭЭД ЯЗГУУРТАН</span>
                  <ul className="mt-1.5 space-y-1 text-slate-300 list-disc list-inside">
                    <li><b>10. Их Гүн</b> (Grand Duke) / <b>11. Их Гүнгийн ахай</b></li>
                    <li><b>12. Вант Гүн</b> (Sovereign Duke) / <b>13. Вант Гүнгийн ахай</b></li>
                    <li><b>14. Гүн</b> (Duke) / <b>15. Гүнгийн ахай</b> (Duchess)</li>
                  </ul>
                </div>

                {/* Rank 4 */}
                <div className="p-3 rounded-xl bg-[#091130] border border-[#172559]">
                  <span className="font-bold text-sky-400">IV. ДУНД ЯЗГУУРТАН</span>
                  <ul className="mt-1.5 space-y-1 text-slate-300 list-disc list-inside">
                    <li><b>16. Маркиз</b> (Marquess) / <b>17. Маркиз ахайтан</b></li>
                    <li><b>18. Эрхэм гүн</b> (Count) / <b>19. Эрхэм гүнгийн ахайтан</b></li>
                    <li><b>20. Виконт</b> (Viscount) / <b>21. Виконтын ахай</b></li>
                    <li><b>22. Барон</b> (Baron) / <b>23. Бароны ахай</b></li>
                  </ul>
                </div>

                {/* Rank 5 & 6 */}
                <div className="p-3 rounded-xl bg-[#091130] border border-[#172559] md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="font-bold text-sky-400">V. ЯЗГУУРТАН (NOBLE)</span>
                      <ul className="mt-1.5 space-y-1 text-slate-300 list-disc list-inside">
                        <li><b>24. Ихэс ноён</b> (Lord)</li>
                        <li><b>25. Ихэс хатагтай</b> (Lady)</li>
                        <li><b>26.</b> Язгууртан овгоос гаралтай цолгүй язгууртнууд</li>
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold text-sky-400">VI. ЯЗГУУРТНЫ БУС ХҮНДЭТ ЦОЛ</span>
                      <ul className="mt-1.5 space-y-1 text-slate-300 list-disc list-inside">
                        <li><b>27. Хотын Захирагч</b> (Mayor)</li>
                        <li><b>28. Яамны тэргүүн</b> (Provost)</li>
                        <li><b>29. Хүлэг Баатар</b> (Knight)</li>
                        <li><b>30. Ордны Үйлчлэгч</b> (Servant)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DECREES & SHIPS */}
          {activeTab === 'decrees' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#142252]">
                <div>
                  <h3 className="text-sm font-bold text-white">Төрийн Зарлигууд, Хүндэт Титэм ба 4 Их Хөлөг Онгоц</h3>
                  <p className="text-xs text-slate-400">Хатан хаан Либертиа Вон Монтакью-гийн зарлигууд ба өв</p>
                </div>
                <button
                  onClick={() =>
                    handleAsk('Хатан хаан Либертиагийн Хүндэт Титэм, 4 Их хөлөг онгоц болон овгийн гишүүд, нас нэмэх ёсны зарлигийг дэлгэрэнгүй тайлбарлана уу.')
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <Send size={12} />
                  <span>Чат руу илгээх</span>
                </button>
              </div>

              <div className="space-y-3">
                {/* The Crown */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#0c1840] to-[#12235c] border border-blue-500/50">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Crown size={17} className="text-white" />
                    <span>САФФИРЫН ХҮНДЭТ ТИТЭМ (ХААН ШИРЭЭНИЙ ТӨРИЙН ҮНЭТ ӨВ)</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    Цэвэр алтаар урласан, өндөр нуман хийцтэй, гүн час улаан хилэн доторлогоотой. Бадмаараг (голдоо том бадмаараг), индранил, маргад, алмаз, болор, сувд, топаз шигтгээтэй, оройдоо алтан загалмайтай. <b>Жин:</b> ~1.5 кг | <b>Өндөр:</b> 30 см, <b>Өргөн:</b> 20 см. Хувийн өмч биш, хаанаас хаанд сэнтий дамжин уламжлагдана. Хамгаалалтыг Төрийн зөвлөлийн тэргүүд хүлээнэ.
                  </p>
                </div>

                {/* 4 Ships */}
                <div className="p-4 rounded-xl bg-[#091130] border border-[#1b2b68]">
                  <div className="flex items-center gap-2 font-bold text-sky-300 text-sm mb-2">
                    <Ship size={16} />
                    <span>САФФИР УЛСЫН 4 ИХ ХӨЛӨГ ОНГОЦ</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="p-2.5 rounded-lg bg-[#060a1c] border border-[#14214f]">
                      <b className="text-sky-300">1. POSEIDON:</b> Галын эзэнт гүрэн Тианши (Tiangshi) хүрэх хөлөг (Газар дундын тэнгис).
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#060a1c] border border-[#14214f]">
                      <b className="text-sky-300">2. CIRCE (ЦИРЦЕ):</b> Калвератын эзэнт гүрэн (Calverath) хүрэх хөлөг (Номхон далай).
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#060a1c] border border-[#14214f]">
                      <b className="text-sky-300">3. NEMESIS:</b> Их Британи (United Kingdom) хүрэх хөлөг (Атлантын далай).
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#060a1c] border border-[#14214f]">
                      <b className="text-sky-300">4. LOUISIANA:</b> Солонгос улс (BNSU) хүрэх хөлөг (Карибын тэнгис).
                    </div>
                  </div>
                </div>

                {/* Key Decrees */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                    <b className="text-sky-400">ЗАРЛИГ II: Овгийн гишүүдийн тоо</b>
                    <p className="mt-1 text-slate-300">
                      Эгэл овог үндсэн 10 гишүүн (хэтрэхгүй 15). Язгууртан овог үндсэн 8 гишүүн (онцгой үед 15 хүртэл). Үндсэн гишүүдийн үр хүүхэд энэ тоонд орохгүй.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#091130] border border-[#172559]">
                    <b className="text-sky-400">ЗАРЛИГ III: Нас нэмэх ёс</b>
                    <p className="mt-1 text-slate-300">
                      Саффир улсын иргэд жилд 4 удаа нас нэмнэ: <b>3 сарын 22, 6 сарын 22, 9 дүгээр сарын 22, 12 дугаар сарын 22</b>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ZGRP */}
          {activeTab === 'zgrp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#142252]">
                <div>
                  <h3 className="text-sm font-bold text-white">ZGRP (Zet Generation Roleplay) — 6 Улс</h3>
                  <p className="text-xs text-slate-400">Нэг дэлхий, 6 тусдаа бие даасан улс ба Roleplay-ийн хууль дүрэм</p>
                </div>
                <button
                  onClick={() =>
                    handleAsk('ZGRP-ийн 6 улс (Tiangshi, Sapphire, Calverath, BNSU, UK, Nesindrax)-ын тухай болон Саффирын дүрийн хоригийг бүрэн тайлбарлаж өгөөч.')
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <Send size={12} />
                  <span>Чат руу илгээх</span>
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-[#091130] border border-[#172559]">
                  <b className="text-sky-300">1. TIANGSHI (Хятад улс):</b> Хятад соёл, C-drama, жүжигчин, idol, уран бүтээлчид. Түүхэн ба эртний Хятад.
                </div>
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40">
                  <div className="flex items-center justify-between">
                    <b className="text-sky-300">2. SAPPHIRE (Европ улс):</b>
                    <span className="text-[10px] text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">Сэргэн мандалт (XIV-XVII зуун)</span>
                  </div>
                  <p className="mt-1 text-slate-300 text-xs">
                    Европ манхва, анимэ, тоглоомын дүрүүд. <br />
                    <span className="text-red-400 font-semibold">«ХОРИГ: Чөтгөр, шулам, цус сорогч болон харанхуйн дүрүүдийг Саффир улсад ашиглахыг хатуу хориглоно!»</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#091130] border border-[#172559]">
                  <b className="text-sky-300">3. CALVERATH (Ид шидийн улс):</b> Ид шид, ер бусын чадвар, эвэр, сүүлтэй дүрүүд. Ид шидийг албан ёсоор ашигладаг цорын ганц улс.
                </div>
                <div className="p-3 rounded-xl bg-[#091130] border border-[#172559]">
                  <b className="text-sky-300">4. BNSU (Өмнөд Солонгос улс):</b> Орчин үеийн Солонгос, K-pop idol, K-drama жүжигчид.
                </div>
                <div className="p-3 rounded-xl bg-[#091130] border border-[#172559]">
                  <b className="text-sky-300">5. UNITED KINGDOM (Баруун Европ улс):</b> Бодит Hollywood жүжигчин, барууны дуучид, уран бүтээлчид.
                </div>
                <div className="p-3 rounded-xl bg-[#091130] border border-[#172559]">
                  <b className="text-sky-300">6. NESINDRAX (Япон улс):</b> Японы соёл, анимэ, манга бүтээлийн дүрүүд.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with External Link */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#142252] bg-[#060a1c] text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen size={14} className="text-sky-400" />
            <span>Саффир улсын албан ёсны вэб портал:</span>
          </div>
          <a
            href="https://sapphire-country-zgrp.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e183e] text-sky-300 border border-[#1c2e6f] hover:bg-[#162558] hover:text-white transition-colors"
          >
            <span>sapphire-country-zgrp.vercel.app</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
};
