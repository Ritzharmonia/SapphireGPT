import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Square,
  Plus,
  Globe,
  Mic,
  MicOff,
  X,
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string, image?: { mimeType: string; data: string; url?: string }) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  disabled?: boolean;
  webSearchEnabled?: boolean;
  onToggleWebSearch?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isStreaming,
  onStopStreaming,
  disabled = false,
  webSearchEnabled = false,
  onToggleWebSearch,
}) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<{
    mimeType: string;
    data: string;
    url: string;
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea like ChatGPT
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${Math.max(newHeight, 46)}px`;
    }
  }, [input]);

  // Handle Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'mn-MN';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Зөвхөн зураг оруулна уу.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setSelectedImage({
        mimeType: file.type,
        data: base64Data,
        url: result,
      });
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed && !selectedImage) return;
    if (disabled || isStreaming) return;

    onSendMessage(trimmed, selectedImage || undefined);
    setInput('');
    setSelectedImage(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = '46px';
    }
  };

  const canSubmit = input.trim().length > 0 || selectedImage !== null;

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pb-3">
      {/* Attached image preview */}
      {selectedImage && (
        <div className="relative mb-2 inline-flex items-center gap-2 rounded-xl bg-[#10182e] p-1.5 border border-white/10 shadow-lg">
          <img
            src={selectedImage.url}
            alt="Preview"
            className="h-12 w-12 rounded-lg object-cover"
          />
          <div className="pr-6 text-xs text-white">
            <span className="font-medium text-white">Зураг хавсаргасан</span>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-1 right-1 rounded-full bg-white/20 p-1 text-white hover:bg-white/30"
            title="Зургийг арилгах"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* ChatGPT-style Input Capsule */}
      <div className="relative flex flex-col rounded-3xl bg-[#11182c] border border-white/10 focus-within:border-white/30 shadow-xl transition-all">
        {/* Text area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Асуух зүйлээ кириллээр бичиж үлдээнэ үү..."
          rows={1}
          disabled={disabled}
          className="w-full resize-none bg-transparent px-5 pt-3.5 pb-2 text-sm text-white placeholder-slate-400 focus:outline-none"
          style={{ minHeight: '46px' }}
        />

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between px-3.5 pb-2.5 pt-1">
          {/* Left tools: Attachment, Web search, Voice */}
          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            {/* Attach Image / File button (+) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              title="Файл / Зураг хавсаргах"
            >
              <Plus size={18} />
            </button>

            {/* Web Search toggle */}
            {onToggleWebSearch && (
              <button
                type="button"
                onClick={onToggleWebSearch}
                className={`flex h-8 items-center gap-1.5 px-2.5 rounded-full text-xs font-medium transition-colors ${
                  webSearchEnabled
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                title="Вэб хайлт"
              >
                <Globe size={15} />
                <span className="hidden sm:inline">Хайлт</span>
              </button>
            )}

            {/* Voice Dictation */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title={isRecording ? 'Яриаг зогсоох' : 'Дуугаар хэлэх'}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>

          {/* Right tool: Send / Stop button (ChatGPT circular arrow) */}
          <div className="flex items-center gap-2">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-slate-200 transition-transform active:scale-95"
                title="Хариултыг зогсоох"
              >
                <Square size={12} fill="currentColor" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || disabled}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                  canSubmit && !disabled
                    ? 'bg-white text-black hover:bg-slate-200 shadow-md active:scale-95'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
                title="Илгээх (Enter)"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Minimalist Footnote */}
      <p className="mt-2 text-center text-[11px] text-slate-400 select-none">
        SapphireGPT нь алдаа гаргаж болзошгүй. Мэдээллээ нягтална уу.
      </p>
    </div>
  );
};
