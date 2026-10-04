import React, { useState } from 'react';
import {
  Menu,
  ChevronDown,
  SquarePen,
  Download,
  Trash2,
  Check,
  Zap,
  Cpu,
  BookOpen,
} from 'lucide-react';
import { MODELS } from '../utils/constants';
import { SapphireIcon } from './SapphireIcon';

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  onNewChat: () => void;
  onClearChat: () => void;
  onExportMarkdown: () => void;
  hasMessages: boolean;
  currentTitle: string;
  onOpenLoreModal?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  selectedModel,
  onSelectModel,
  onNewChat,
  onClearChat,
  onExportMarkdown,
  hasMessages,
  currentTitle,
  onOpenLoreModal,
}) => {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  const handleShare = () => {
    onExportMarkdown();
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-white/5 bg-[#080d1a] px-3 sm:px-4">
      {/* Left: Sidebar toggle & Model selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          title={isSidebarOpen ? 'Цэс хураах' : 'Цэс нээх'}
        >
          <Menu size={19} />
        </button>

        {/* ChatGPT-style Model Selector */}
        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <SapphireIcon size={18} />
            <span className="font-semibold tracking-tight text-white">SapphireGPT</span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {showModelDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowModelDropdown(false)}
              />
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#0e162c] border border-white/10 p-2 shadow-2xl z-50">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Загвар сонгох
                </div>
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setShowModelDropdown(false);
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors ${
                      model.id === selectedModel
                        ? 'bg-white/10 border border-white/20'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="mt-0.5 rounded-lg bg-white/10 p-1.5 text-white">
                      {model.id.includes('pro') ? <Cpu size={15} /> : <Zap size={15} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">
                          {model.name}
                        </span>
                        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9.5px] font-medium text-slate-200">
                          {model.badge}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400 leading-tight">
                        {model.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Clean Action Icons */}
      <div className="flex items-center gap-1">
        {/* Sapphire Lore / Knowledge Button */}
        {onOpenLoreModal && (
          <button
            onClick={onOpenLoreModal}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
            title="Саффир улсын албан ёсны мэдээлэл, иргэдийн бүртгэл"
          >
            <BookOpen size={16} className="text-white" />
            <span className="hidden sm:inline text-white">Төрийн мэдээлэл</span>
          </button>
        )}

        {/* New Chat icon button */}
        <button
          onClick={onNewChat}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
          title="Шинэ яриа эхлүүлэх"
        >
          <SquarePen size={18} />
        </button>

        {/* Export if has messages */}
        {hasMessages && (
          <>
            <button
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Татах / Хадгалах"
            >
              {copiedShare ? <Check size={17} className="text-emerald-400" /> : <Download size={17} />}
            </button>

            <button
              onClick={onClearChat}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
              title="Яриаг цэвэрлэх"
            >
              <Trash2 size={17} />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
