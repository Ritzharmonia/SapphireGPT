import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCw,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  AlertCircle,
} from 'lucide-react';
import { Message } from '../types/chat';
import { SapphireIcon } from './SapphireIcon';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageItemProps {
  message: Message;
  isLastAssistant: boolean;
  onRegenerate?: () => void;
  onEditUserMessage?: (messageId: string, newContent: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isLastAssistant,
  onRegenerate,
  onEditUserMessage,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content.replace(/[#*`_~]/g, ''));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && onEditUserMessage) {
      onEditUserMessage(message.id, editText.trim());
      setIsEditing(false);
    }
  };

  if (isUser) {
    return (
      <div className="group w-full py-2.5 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex justify-end">
          <div className="max-w-[85%] sm:max-w-[75%]">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl bg-[#141d36] p-3 text-sm text-white border border-white/20 focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(message.content);
                    }}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                  >
                    Болих
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="rounded-full bg-white text-black px-3 py-1.5 text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Хадгалах
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                {message.image?.url && (
                  <div className="mb-2 max-w-xs rounded-2xl overflow-hidden border border-white/10">
                    <img
                      src={message.image.url}
                      alt="Хавсаргасан зураг"
                      className="max-h-60 w-auto object-contain"
                    />
                  </div>
                )}
                <div className="rounded-3xl bg-[#182342] text-white px-4 py-2.5 text-sm sm:text-[15px] leading-relaxed break-words shadow-sm">
                  {message.content}
                </div>
                {onEditUserMessage && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white p-1 rounded-md text-xs transition-opacity flex items-center gap-1"
                    title="Засах"
                  >
                    <Edit3 size={12} />
                    <span>Засах</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Assistant Message (ChatGPT layout)
  return (
    <div className="group w-full py-4 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto flex gap-3 sm:gap-4">
        {/* Sapphire Avatar */}
        <div className="shrink-0 mt-0.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 border border-white/10">
            <SapphireIcon size={16} glow={message.isStreaming} />
          </div>
        </div>

        {/* Content & Actions */}
        <div className="flex-1 min-w-0 space-y-2">
          {message.error ? (
            <div className="flex items-start gap-2.5 rounded-2xl border border-red-800/40 bg-red-950/20 p-3 text-xs text-red-200">
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
              <div>
                <div className="font-semibold">Хариу авахад алдаа гарлаа</div>
                <div className="mt-0.5 text-red-300/80">{message.error}</div>
              </div>
            </div>
          ) : (
            <div className="text-white text-sm sm:text-[15px] leading-relaxed">
              <MarkdownRenderer
                content={message.content}
                isStreaming={message.isStreaming}
              />
            </div>
          )}

          {/* Action Toolbar like ChatGPT */}
          {!message.isStreaming && (
            <div className="flex items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Хуулах"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>

              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-md transition-colors ${
                  isSpeaking
                    ? 'text-sky-400 bg-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title={isSpeaking ? 'Зогсоох' : 'Сонсох'}
              >
                {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              {isLastAssistant && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Дахин хариулах"
                >
                  <RotateCw size={14} />
                </button>
              )}

              <button
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                className={`p-1.5 rounded-md transition-colors ${
                  feedback === 'up' ? 'text-white bg-white/20' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title="Сайн хариулт"
              >
                <ThumbsUp size={14} />
              </button>

              <button
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                className={`p-1.5 rounded-md transition-colors ${
                  feedback === 'down' ? 'text-white bg-white/20' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title="Муу хариулт"
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
