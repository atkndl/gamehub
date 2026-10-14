import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Send, Smile, MessageCircle } from 'lucide-react';

const QUICK_EMOJIS = ['👋', '🔥', '🏆', '😎', '😂', '👏', '🚀', '🎯', '🤔', '😱'];

export default function LiveChat({ title = "Canlı Sohbet & Reaksiyonlar", compact = false }) {
  const { chatMessages, sendChat, player } = useGame();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendChat(text.trim(), null);
    setText('');
  };

  const handleEmojiClick = (em) => {
    sendChat('', em);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[320px] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <span className="font-heading font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4 text-emerald-500" />
          {title}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Canlı
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {chatMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 text-center px-4">
            Henüz mesaj yok. Arkadaşlarına bir emoji fırlat! 👇
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isSelf = msg.senderId === player?.id;
            return (
              <div key={msg.id} className={`flex items-start gap-1.5 text-xs ${isSelf ? 'justify-end' : 'justify-start'}`}>
                {!isSelf && (
                  <span className="text-base select-none shrink-0">{msg.avatar}</span>
                )}
                <div
                  className={`rounded-2xl px-3 py-1.5 max-w-[82%] border shadow-2xs ${
                    isSelf
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-800 border-slate-200/80'
                  }`}
                >
                  {!isSelf && (
                    <span className="font-bold text-[11px] text-slate-500 block -mb-0.5">
                      {msg.senderName}
                    </span>
                  )}
                  {msg.emoji ? (
                    <span className="text-2xl inline-block py-0.5 animate-bounce-subtle">{msg.emoji}</span>
                  ) : (
                    <span className="break-words leading-relaxed text-xs">{msg.message}</span>
                  )}
                </div>
                {isSelf && (
                  <span className="text-base select-none shrink-0">{msg.avatar}</span>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Emojis */}
      <div className="px-2.5 py-1.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1 overflow-x-auto">
        {QUICK_EMOJIS.map((em) => (
          <button
            key={em}
            type="button"
            onClick={() => handleEmojiClick(em)}
            className="w-7 h-7 rounded-lg hover:bg-white text-base flex items-center justify-center transition active:scale-90 shrink-0 cursor-pointer"
            title="Hızlı Reaksiyon Gönder"
          >
            {em}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-2 border-t border-slate-100 flex items-center gap-1.5 bg-white">
        <input
          type="text"
          maxLength={80}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Bir mesaj yaz..."
          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white text-slate-800"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition active:scale-95 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
