import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, MessageSquare, Cpu } from 'lucide-react';
import { getChatHistoryApi, askQuestionApi } from '../../api/chat.api.js';
import ChatMessage from './ChatMessage.jsx';
import ChatInput from './ChatInput.jsx';
import Loader from '../common/Loader.jsx';
import ErrorState from '../common/ErrorState.jsx';

/**
 * Main Article Chat Q&A widget implementing history loading, automated scrolls, and suggestion clicks
 */
const ArticleChat = ({ articleId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversationHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChatHistoryApi(articleId);
      setMessages(data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to restore conversation logs.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Sync log loading when article changes
  useEffect(() => {
    loadConversationHistory();
  }, [articleId]);

  // Scroll downwards when new logs arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    setSending(true);
    setError(null);
    try {
      const outputMsg = await askQuestionApi(articleId, text);
      setMessages((prev) => [...prev, outputMsg]);
    } catch (err) {
      // Return a clean error if LLM key is unconfigured
      const errMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Unable to fetch response.';
      setError(`Q&A service failed: ${errMsg}`);
    } finally {
      setSending(false);
    }
  };

  const suggestions = [
    'What is the main topic?',
    'What are the key points?',
    'Which organizations are mentioned?',
    'What concerns are discussed?'
  ];

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col h-[580px]">
      
      {/* Header boundary */}
      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-4 mb-4">
        <MessageSquare className="w-5 h-5 text-brand-accent shrink-0 animate-pulse" />
        <div>
          <h3 className="text-base font-bold text-gray-100 font-heading">Chat with Article</h3>
          <p className="text-[10px] text-gray-500 font-extrabold tracking-widest uppercase">
            Context-grounded QA
          </p>
        </div>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 mb-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader size="md" />
          </div>
        ) : error && messages.length === 0 ? (
          <ErrorState message={error} onRetry={loadConversationHistory} />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Cpu className="w-12 h-12 text-slate-700 mb-3 shrink-0" />
            <h4 className="text-sm font-semibold text-gray-300">Ask your first question</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
              Ask anything grounded in this news article context. The AI does not use external knowledge.
            </p>
            
            {/* Suggested chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md mt-6">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="flex items-center gap-2 text-left px-3 py-2 rounded-lg bg-brand-surface hover:bg-brand-surface-elevated border border-brand-border text-xs text-gray-400 hover:text-white transition-all duration-200 cursor-pointer focus:outline-none truncate"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-brand-accent/60 shrink-0" />
                  <span className="truncate">{sug}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((item, index) => (
              <ChatMessage key={item._id || index} message={item} />
            ))}
            
            {sending && (
              <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold italic pl-11">
                <Loader size="sm" className="inline-block" />
                <span>Formulating context-grounded response...</span>
              </div>
            )}
            <div ref={endRef} />
          </>
        )}
      </div>

      {/* Floating inline error feedback */}
      {error && messages.length > 0 && (
        <p className="text-xs text-red-400 font-semibold text-center mb-3 bg-red-950/20 border border-red-500/20 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Input widget footer */}
      {!loading && (
        <div className="border-t border-brand-border/40 pt-4">
          <ChatInput onSend={handleSendMessage} isDisabled={sending} />
        </div>
      )}
      
    </div>
  );
};

export default ArticleChat;
