import React, { useState } from 'react';
import { X, Trash2, Download, Shield, Sparkles, Check, Info } from 'lucide-react';
import { SapphireIcon } from './SapphireIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customInstruction: string;
  onSaveInstruction: (instruction: string) => void;
  onClearAllConversations: () => void;
  onExportAllConversations: () => void;
  conversationsCount: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  customInstruction,
  onSaveInstruction,
  onClearAllConversations,
  onExportAllConversations,
  conversationsCount,
}) => {
  const [instruction, setInstruction] = useState(customInstruction);
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveInstruction(instruction);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    if (confirmClear) {
      onClearAllConversations();
      setConfirmClear(false);
      onClose();
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-2xl bg-[#080d24] border border-[#19275e] p-5 shadow-2xl space-y-5 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#121c45] pb-3">
          <div className="flex items-center gap-2.5">
            <SapphireIcon size={24} glow />
            <h2 className="text-base font-bold text-white">SapphireGPT Тохиргоо</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-[#121c45] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Custom Instructions */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Хувийн зааварчилгаа (Custom Instructions)
          </label>
          <p className="text-[11px] text-slate-400">
            SapphireGPT тантай харилцахдаа анхаарах зүйлс, хариулах хэлбэр эсвэл таны мэргэжил, сонирхлын тухай:
          </p>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Жишээ: Би вэб хөгжүүлэгч. Код тайлбарлахдаа TypeScript болон цэвэр архитектурыг баримтлан хариулж өгөөрэй..."
            rows={3}
            className="w-full rounded-xl bg-[#060a1c] p-3 text-xs text-slate-200 placeholder-slate-600 border border-[#152352] focus:border-blue-500 focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              {saved ? (
                <>
                  <Check size={13} className="text-white" />
                  <span>Хадгаллаа</span>
                </>
              ) : (
                <span>Заавар хадгалах</span>
              )}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-3 pt-2 border-t border-[#121c45]">
          <h3 className="text-xs font-semibold text-slate-200">Өгөгдөл ба Түүх</h3>

          <div className="flex items-center justify-between rounded-xl bg-[#060a1c] p-3 border border-[#14214f]">
            <div>
              <div className="text-xs font-medium text-slate-200">Ярианы түүх экспортлох</div>
              <div className="text-[11px] text-slate-400">Нийт {conversationsCount} чат хадгалагдсан</div>
            </div>
            <button
              onClick={onExportAllConversations}
              className="flex items-center gap-1.5 rounded-lg bg-[#101b44] px-3 py-1.5 text-xs font-medium text-sky-300 border border-[#1b2b68] hover:bg-[#162558] transition-colors"
            >
              <Download size={13} />
              <span>Татах (JSON)</span>
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[#060a1c] p-3 border border-[#14214f]">
            <div>
              <div className="text-xs font-medium text-slate-200">Бүх чатыг устгах</div>
              <div className="text-[11px] text-slate-400">Энэ үйлдэл эргэж сэргээгдэхгүй</div>
            </div>
            <button
              onClick={handleClear}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                confirmClear
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-red-950/40 text-red-300 border border-red-900/40 hover:bg-red-900/60'
              }`}
            >
              <Trash2 size={13} />
              <span>{confirmClear ? 'Итгэлтэй байна уу?' : 'Бүгдийг устгах'}</span>
            </button>
          </div>
        </div>

        {/* About SapphireGPT */}
        <div className="rounded-xl bg-[#060a1c]/80 p-3 border border-[#121c42] text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
            <Sparkles size={13} />
            <span>SapphireGPT AI Engine</span>
          </div>
          <p>
            Хар хөх (Sapphire Navy) өнгө төрхтэй, хамгийн сүүлийн үеийн Gemini 3.8 Flash хөдөлгүүртэй бүрэн интеграцлагдсан ухаалаг систем.
          </p>
        </div>
      </div>
    </div>
  );
};
