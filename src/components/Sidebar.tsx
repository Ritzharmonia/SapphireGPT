import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  Settings,
  Pin,
  PinOff,
  ChevronLeft,
  BookOpen,
} from 'lucide-react';
import { Conversation } from '../types/chat';
import { SapphireIcon } from './SapphireIcon';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onTogglePin: (id: string) => void;
  onOpenSettings: () => void;
  onOpenLoreModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onTogglePin,
  onOpenSettings,
  onOpenLoreModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Group conversations by date
  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const SEVEN_DAYS = 7 * ONE_DAY;

  const pinnedChats = filtered.filter((c) => c.pinned);
  const unpinnedChats = filtered.filter((c) => !c.pinned);

  const todayChats = unpinnedChats.filter((c) => now - c.updatedAt < ONE_DAY);
  const yesterdayChats = unpinnedChats.filter(
    (c) => now - c.updatedAt >= ONE_DAY && now - c.updatedAt < 2 * ONE_DAY
  );
  const weekChats = unpinnedChats.filter(
    (c) => now - c.updatedAt >= 2 * ONE_DAY && now - c.updatedAt < SEVEN_DAYS
  );
  const olderChats = unpinnedChats.filter((c) => now - c.updatedAt >= SEVEN_DAYS);

  const startRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const renderChatItem = (conv: Conversation) => {
    const isActive = conv.id === activeId;
    const isEditing = conv.id === editingId;

    return (
      <div
        key={conv.id}
        onClick={() => onSelectConversation(conv.id)}
        className={`group relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150 cursor-pointer ${
          isActive
            ? 'bg-white/10 text-white'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`}
      >
        <MessageSquare
          size={15}
          className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}
        />

        {isEditing ? (
          <div className="flex flex-1 items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveRename(conv.id, e as any);
                if (e.key === 'Escape') cancelRename(e as any);
              }}
              autoFocus
              className="w-full rounded bg-black/40 px-2 py-0.5 text-xs text-white border border-white/30 focus:outline-none"
            />
            <button
              onClick={(e) => saveRename(conv.id, e)}
              className="p-1 text-emerald-400 hover:bg-white/10 rounded"
            >
              <Check size={13} />
            </button>
            <button
              onClick={cancelRename}
              className="p-1 text-slate-400 hover:bg-white/10 rounded"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <>
            <span className="flex-1 truncate text-xs font-medium tracking-tight">
              {conv.title || 'Шинэ яриа'}
            </span>

            {/* Hover Actions */}
            <div className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(conv.id);
                }}
                title={conv.pinned ? 'Хадахыг болиулах' : 'Дээр нь хадах'}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded"
              >
                {conv.pinned ? <PinOff size={13} /> : <Pin size={13} />}
              </button>
              <button
                onClick={(e) => startRename(conv, e)}
                title="Нэр өөрчлөх"
                className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                title="Устгах"
                className="p-1 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#050811] border-r border-white/5 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <SapphireIcon size={22} glow={false} />
            <span className="font-semibold text-sm tracking-tight text-white">SapphireGPT</span>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Цэсийг хураах"
          >
            <ChevronLeft size={17} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3 space-y-2">
          <button
            onClick={onNewChat}
            className="flex w-full items-center justify-between rounded-xl bg-white/10 hover:bg-white/15 px-3 py-2 text-xs font-semibold text-white transition-colors border border-white/10"
          >
            <div className="flex items-center gap-2">
              <Plus size={15} />
              <span>Шинэ чат</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+K</span>
          </button>

          {/* Search History */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Чат хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-white/5 pl-7 pr-3 py-1.5 text-xs text-white placeholder-slate-500 border border-transparent focus:border-white/20 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Conversations History List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-3">
          {conversations.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-slate-500">
              Яриа одоогоор алга байна.
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-slate-500">
              Чат олдсонгүй.
            </div>
          ) : (
            <>
              {/* Pinned */}
              {pinnedChats.length > 0 && (
                <div className="space-y-0.5">
                  <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Хадаастай
                  </div>
                  {pinnedChats.map(renderChatItem)}
                </div>
              )}

              {/* Today */}
              {todayChats.length > 0 && (
                <div className="space-y-0.5">
                  <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Өнөөдөр
                  </div>
                  {todayChats.map(renderChatItem)}
                </div>
              )}

              {/* Yesterday */}
              {yesterdayChats.length > 0 && (
                <div className="space-y-0.5">
                  <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Өчигдөр
                  </div>
                  {yesterdayChats.map(renderChatItem)}
                </div>
              )}

              {/* 7 Days */}
              {weekChats.length > 0 && (
                <div className="space-y-0.5">
                  <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Өмнөх 7 хоног
                  </div>
                  {weekChats.map(renderChatItem)}
                </div>
              )}

              {/* Older */}
              {olderChats.length > 0 && (
                <div className="space-y-0.5">
                  <div className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Өмнөх ярианууд
                  </div>
                  {olderChats.map(renderChatItem)}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Area: Lore & User profile */}
        <div className="p-2 border-t border-white/5 space-y-1">
          {/* Sapphire Lore / Knowledge Button */}
          {onOpenLoreModal && (
            <button
              onClick={onOpenLoreModal}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <BookOpen size={15} className="text-white" />
              <span>Саффир улсын лавлах сан</span>
            </button>
          )}

          {/* User profile & Settings */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-2 truncate">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                S
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-white truncate">montaqve@gmail.com</div>
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="rounded-md p-1 text-slate-400 hover:text-white transition-colors"
              title="Тохиргоо"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
