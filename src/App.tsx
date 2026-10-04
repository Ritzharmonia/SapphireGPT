import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, Persona } from './types/chat';
import { PERSONAS, MODELS, SUGGESTIONS } from './utils/constants';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { EmptyState } from './components/EmptyState';
import { MessageItem } from './components/MessageItem';
import { ChatInput } from './components/ChatInput';
import { SettingsModal } from './components/SettingsModal';
import { SapphireLoreModal } from './components/SapphireLoreModal';

const STORAGE_KEY = 'sapphiregpt_conversations_v1';
const SETTINGS_KEY = 'sapphiregpt_settings_v1';

export default function App() {
  // Saved settings
  const [customInstruction, setCustomInstruction] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved).customInstruction || '' : '';
    } catch {
      return '';
    }
  });

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading conversations', e);
    }
    return [];
  });

  const [activeId, setActiveId] = useState<string | null>(() => {
    return conversations.length > 0 ? conversations[0].id : null;
  });

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoreModalOpen, setIsLoreModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-flash-latest');
  const [activePersonaId, setActivePersonaId] = useState('general');
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Persist conversations
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [conversations]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ customInstruction, webSearchEnabled, selectedModel, activePersonaId })
      );
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [customInstruction, webSearchEnabled, selectedModel, activePersonaId]);

  // Keyboard shortcut Ctrl+K / Cmd+K for new chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;
  const activePersona = PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0];

  // Auto-scroll on messages change or stream
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages, isStreaming]);

  // Start new chat
  const handleNewChat = () => {
    if (isStreaming) {
      handleStopStreaming();
    }

    // If active conversation has 0 messages, keep it
    if (activeConversation && activeConversation.messages.length === 0) {
      return;
    }

    const newChat: Conversation = {
      id: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: 'Шинэ яриа',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      model: selectedModel,
      personaId: activePersonaId,
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveId(newChat.id);
  };

  // Delete conversation
  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (activeId === id) {
        setActiveId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  // Rename conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c))
    );
  };

  // Toggle pin
  const handleTogglePin = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  // Stop generation
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);

    // Mark active streaming message as stopped
    if (activeId) {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          const updatedMessages = c.messages.map((m) =>
            m.isStreaming ? { ...m, isStreaming: false } : m
          );
          return { ...c, messages: updatedMessages };
        })
      );
    }
  };

  // Send message and trigger Gemini SSE stream
  const handleSendMessage = async (
    userText: string,
    image?: { mimeType: string; data: string; url?: string }
  ) => {
    if (isStreaming) {
      handleStopStreaming();
    }

    let targetConvId = activeId;
    let currentConv = activeConversation;

    // Create new conversation if none exists
    if (!targetConvId || !currentConv) {
      const newConv: Conversation = {
        id: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title: userText.slice(0, 30) || 'Шинэ яриа',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
        model: selectedModel,
        personaId: activePersonaId,
      };
      targetConvId = newConv.id;
      currentConv = newConv;
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(newConv.id);
    }

    const userMsgId = `msg_${Date.now()}_u`;
    const assistantMsgId = `msg_${Date.now() + 1}_a`;

    const userMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: userText,
      timestamp: Date.now(),
      image,
    };

    const assistantPlaceholder: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1,
      isStreaming: true,
    };

    const updatedMessages = [...currentConv.messages, userMessage, assistantPlaceholder];

    // Update conversation state immediately
    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetConvId
          ? {
              ...c,
              messages: updatedMessages,
              updatedAt: Date.now(),
            }
          : c
      )
    );

    // Auto-generate title if this is the first turn
    const isFirstTurn = currentConv.messages.length === 0;
    if (isFirstTurn && userText) {
      fetch('/api/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.title) {
            handleRenameConversation(targetConvId!, data.title);
          }
        })
        .catch((e) => console.error('Title generation failed', e));
    }

    // Call SSE streaming API
    setIsStreaming(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Prepare message history for Gemini (excluding streaming placeholder)
    const historyPayload = [...currentConv.messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
      image: m.image
        ? {
            mimeType: m.image.mimeType,
            data: m.image.data,
          }
        : undefined,
    }));

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: historyPayload,
          systemInstruction: [
            activePersona.systemPrompt,
            customInstruction ? `Хэрэглэгчийн тохиргоо: ${customInstruction}` : '',
          ]
            .filter(Boolean)
            .join('\n\n'),
          model: selectedModel,
          webSearch: webSearchEnabled,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Серверийн хариу: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream дэмжигдсэнгүй');

      const decoder = new TextDecoder();
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.slice(6);
            try {
              const data = JSON.parse(jsonStr);
              if (data.error) {
                throw new Error(data.error);
              }
              if (data.text) {
                accumulatedText += data.text;
                // Update message content incrementally
                setConversations((prev) =>
                  prev.map((c) => {
                    if (c.id !== targetConvId) return c;
                    const msgs = c.messages.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, content: accumulatedText, isStreaming: true }
                        : m
                    );
                    return { ...c, messages: msgs };
                  })
                );
              }
            } catch (err: any) {
              if (err.message && !jsonStr.includes('done')) {
                console.error('Error parsing SSE chunk', err);
              }
            }
          }
        }
      }

      // Finish streaming cleanly
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== targetConvId) return c;
          const msgs = c.messages.map((m) =>
            m.id === assistantMsgId ? { ...m, isStreaming: false } : m
          );
          return { ...c, messages: msgs };
        })
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream aborted by user');
      } else {
        console.error('Chat stream error:', err);
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== targetConvId) return c;
            const msgs = c.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    isStreaming: false,
                    error: err.message || 'Холболт амжилтгүй боллоо.',
                  }
                : m
            );
            return { ...c, messages: msgs };
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate last assistant response
  const handleRegenerate = () => {
    if (!activeConversation || activeConversation.messages.length === 0) return;

    const msgs = activeConversation.messages;
    const lastMsg = msgs[msgs.length - 1];

    if (lastMsg.role === 'assistant') {
      // Find the last user message
      let lastUserMsgIndex = -1;
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === 'user') {
          lastUserMsgIndex = i;
          break;
        }
      }

      if (lastUserMsgIndex !== -1) {
        const lastUserMsg = msgs[lastUserMsgIndex];
        // Slice away the last assistant message
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeConversation.id) return c;
            return { ...c, messages: msgs.slice(0, lastUserMsgIndex) };
          })
        );
        // Resend the user message
        handleSendMessage(lastUserMsg.content, lastUserMsg.image);
      }
    }
  };

  // Edit user message and re-branch
  const handleEditUserMessage = (messageId: string, newContent: string) => {
    if (!activeConversation) return;

    const index = activeConversation.messages.findIndex((m) => m.id === messageId);
    if (index === -1) return;

    const userMsg = activeConversation.messages[index];
    // Remove this message and all messages after it
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversation.id) return c;
        return { ...c, messages: c.messages.slice(0, index) };
      })
    );

    // Resend with edited text
    handleSendMessage(newContent, userMsg.image);
  };

  // Clear current active conversation
  const handleClearCurrentChat = () => {
    if (!activeId) return;
    if (window.confirm('Та одоогийн ярианы бүх мессежийг арилгахдаа итгэлтэй байна уу?')) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages: [], updatedAt: Date.now() } : c))
      );
    }
  };

  // Export conversation to Markdown
  const handleExportMarkdown = () => {
    if (!activeConversation || activeConversation.messages.length === 0) return;

    let md = `# ${activeConversation.title}\n*Огноо: ${new Date(
      activeConversation.createdAt
    ).toLocaleString()}*\n*Загвар: ${activeConversation.model || 'Gemini 3.8'}*\n\n---\n\n`;

    activeConversation.messages.forEach((m) => {
      const sender = m.role === 'user' ? '### 👤 Та' : '### 💎 SapphireGPT';
      md += `${sender} *(${new Date(m.timestamp).toLocaleTimeString()})*\n\n${m.content}\n\n---\n\n`;
    });

    // Copy to clipboard
    navigator.clipboard.writeText(md).catch((err) => console.error(err));

    // Also download file
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeConversation.title.replace(/[/\\?%*:|"<>]/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export all conversations to JSON
  const handleExportAllConversations = () => {
    const dataStr = JSON.stringify(conversations, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sapphiregpt_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Clear all conversations
  const handleClearAllConversations = () => {
    setConversations([]);
    setActiveId(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasMessages = Boolean(activeConversation && activeConversation.messages.length > 0);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050814] text-slate-100 antialiased">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={(id) => setActiveId(id)}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onTogglePin={handleTogglePin}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLoreModal={() => setIsLoreModalOpen(true)}
      />

      {/* Main Chat Viewport */}
      <div className="flex flex-1 flex-col h-full overflow-hidden bg-[#070b19] relative">
        {/* Header */}
        <ChatHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          selectedModel={selectedModel}
          onSelectModel={(model) => setSelectedModel(model)}
          onNewChat={handleNewChat}
          onClearChat={handleClearCurrentChat}
          onExportMarkdown={handleExportMarkdown}
          hasMessages={hasMessages}
          currentTitle={activeConversation?.title || 'Шинэ яриа'}
          onOpenLoreModal={() => setIsLoreModalOpen(true)}
        />

        {/* Chat Feed */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {!hasMessages ? (
            <EmptyState />
          ) : (
            <div className="flex-1 pb-6 pt-2">
              {activeConversation?.messages.map((msg, index) => {
                const isLastAssistant =
                  msg.role === 'assistant' &&
                  index === activeConversation.messages.length - 1;

                return (
                  <MessageItem
                    key={msg.id}
                    message={msg}
                    isLastAssistant={isLastAssistant}
                    onRegenerate={handleRegenerate}
                    onEditUserMessage={handleEditUserMessage}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input Bar */}
        <footer className="w-full shrink-0 bg-gradient-to-t from-[#070b19] via-[#070b19]/95 to-transparent pt-1">
          <ChatInput
            onSendMessage={handleSendMessage}
            isStreaming={isStreaming}
            onStopStreaming={handleStopStreaming}
            webSearchEnabled={webSearchEnabled}
            onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
          />
        </footer>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customInstruction={customInstruction}
        onSaveInstruction={(inst) => setCustomInstruction(inst)}
        onClearAllConversations={handleClearAllConversations}
        onExportAllConversations={handleExportAllConversations}
        conversationsCount={conversations.length}
      />

      {/* Sapphire State Lore Knowledge Modal */}
      <SapphireLoreModal
        isOpen={isLoreModalOpen}
        onClose={() => setIsLoreModalOpen(false)}
        onAskPrompt={(prompt) => handleSendMessage(prompt)}
      />
    </div>
  );
}
