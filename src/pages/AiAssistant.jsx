import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, AlertCircle, Trash2, HelpCircle, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { aiAssistantService } from '../services/aiAssistantService';

const SUGGESTED_PROMPTS = [
  "Help me understand my symptoms",
  "What should I ask my doctor?",
  "How can I prepare for my appointment?",
  "Explain blood pressure readings simply",
  "Help me organize my health information"
];

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am your PulseCare AI Health Assistant. I can help answer general health questions, prepare you for upcoming doctor consultations, and explain medical terminology simply. How can I assist you today?",
      suggestedNext: SUGGESTED_PROMPTS
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setTyping(true);

    try {
      const response = await aiAssistantService.sendMessage(query);
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: response.text,
        suggestedNext: response.suggestedNext || []
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: "I am having difficulty connecting right now. Please try again in a moment."
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'assistant',
        text: "Chat cleared. What health or medical topic would you like to explore?",
        suggestedNext: SUGGESTED_PROMPTS
      }
    ]);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <PageHeader
        title="AI Health Assistant"
        description="Educational medical chat assistant to help prepare for consultations and understand vitals."
      >
        <Button variant="ghost" size="sm" icon={Trash2} onClick={clearChat}>
          Clear Chat
        </Button>
      </PageHeader>

      {/* Mandatory Disclaimer Alert */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 flex items-center gap-3 text-sky-900 text-xs">
        <ShieldCheck className="w-4 h-4 text-sky-600 flex-shrink-0" />
        <p>
          <strong>Safety Notice:</strong> AI-generated information is for general educational purposes only and does not replace professional medical advice, clinical diagnosis, or treatment.
        </p>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {m.sender === 'assistant' ? (
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                You
              </div>
            )}

            <div className={`max-w-[82%] space-y-2`}>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-xs whitespace-pre-line'
                }`}
              >
                {m.text}
              </div>

              {/* Assistant Suggested Follow-ups */}
              {m.suggestedNext && m.suggestedNext.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {m.suggestedNext.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="text-[11px] font-medium bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 px-3 py-1 rounded-full border border-slate-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSend())}
          placeholder="Ask a health or medical question..."
          className="flex-1 px-3 py-2 text-sm focus:outline-none"
        />
        <Button
          variant="primary"
          size="sm"
          icon={Send}
          onClick={() => handleSend()}
          disabled={!inputText.trim() || typing}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default AiAssistant;
