'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface Suggestion {
  id: string;
  label: string;
}

const INITIAL_SUGGESTIONS = [
  { id: 'what-does-corqon-do', label: 'What does Corqon actually do?' },
  { id: 'data-sources', label: 'What data sources does Corqon use?' },
  { id: 'privacy', label: 'How does Corqon handle privacy?' },
  { id: 'onboarding', label: 'How long does onboarding take?' },
  { id: 'pricing', label: 'How is Corqon priced?' },
  { id: 'ai', label: 'Does Corqon use artificial intelligence?' },
];

export default function FaqAssistantBlock() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Check if mobile on mount
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      text: 'Ask a question or choose a topic.',
      isUser: false,
      timestamp: 0,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [displayedTexts, setDisplayedTexts] = useState<Record<string, string>>({
    initial: 'Ask a question or choose a topic.',
  });
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [questionCount, setQuestionCount] = useState(0);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [limitMessageShown, setLimitMessageShown] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingIntervalsRef = useRef<Record<string, number>>({});
  const cooldownTimerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingRequestRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);

  const scrollToBottom = (smooth: boolean = false) => {
    if (!messagesContainerRef.current) return;
    
    // Cancel any pending scroll animation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    // On mobile, always use instant scroll to avoid performance issues
    if (isMobile || !smooth) {
      rafRef.current = requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
        rafRef.current = null;
      });
    } else {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const startTypewriter = (messageId: string, fullText: string) => {
    // Clear any existing interval for this message
    if (typingIntervalsRef.current[messageId]) {
      clearInterval(typingIntervalsRef.current[messageId]);
      delete typingIntervalsRef.current[messageId];
    }

    // On mobile, use fast typing animation
    if (isMobile) {
      // Initialize with empty text
      setDisplayedTexts(prev => ({ ...prev, [messageId]: '' }));

      const typingSpeed = 8; // Fast typing speed for mobile (8ms per character)
      let currentIndex = 0;

      const interval = setInterval(() => {
        currentIndex += 1;
        if (currentIndex <= fullText.length) {
          setDisplayedTexts(prev => ({
            ...prev,
            [messageId]: fullText.slice(0, currentIndex),
          }));
          // Use instant scroll during typewriter to keep up with text appearance
          scrollToBottom(false);
        }
        
        if (currentIndex >= fullText.length) {
          clearInterval(interval);
          delete typingIntervalsRef.current[messageId];
          // Final scroll to ensure everything is visible
          scrollToBottom(false);
        }
      }, typingSpeed);

      typingIntervalsRef.current[messageId] = interval as unknown as number;
      return;
    }

    // Desktop: use typewriter effect
    // Initialize with empty text
    setDisplayedTexts(prev => ({ ...prev, [messageId]: '' }));

    const typingSpeed = 15; // milliseconds per character
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex += 1;
      if (currentIndex <= fullText.length) {
        setDisplayedTexts(prev => ({
          ...prev,
          [messageId]: fullText.slice(0, currentIndex),
        }));
        // Use instant scroll during typewriter to keep up with text appearance
        scrollToBottom(false);
      }
      
      if (currentIndex >= fullText.length) {
        clearInterval(interval);
        delete typingIntervalsRef.current[messageId];
        // Final scroll to ensure everything is visible
        scrollToBottom(false);
      }
    }, typingSpeed);

    typingIntervalsRef.current[messageId] = interval as unknown as number;
  };

  const canSubmit = (): boolean => {
    if (questionCount >= 20) {
      return false;
    }
    if (isCooldownActive) {
      return false;
    }
    return true;
  };

  const startCooldown = () => {
    setIsCooldownActive(true);
    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current);
    }
    cooldownTimerRef.current = window.setTimeout(() => {
      setIsCooldownActive(false);
      cooldownTimerRef.current = null;
    }, 2000);
  };

  const showLimitMessage = () => {
    if (!limitMessageShown) {
      const limitMessage: Message = {
        id: `limit-${Date.now()}`,
        text: "You've reached your maximum amount of questions. Please refresh the website for a new chance",
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, limitMessage]);
      setDisplayedTexts(prev => ({ ...prev, [limitMessage.id]: limitMessage.text }));
      setLimitMessageShown(true);
      
      // On mobile, use requestAnimationFrame for better performance
      if (isMobile) {
        requestAnimationFrame(() => {
          scrollToBottom(false);
        });
      } else {
        setTimeout(() => {
          scrollToBottom(true);
        }, 0);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup all intervals on unmount
      Object.values(typingIntervalsRef.current).forEach(interval => {
        clearInterval(interval);
      });
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
      // Cancel any pending API requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Cancel any pending scroll animations
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleSendMessage = async (text: string, faqId?: string) => {
    if (!text.trim() && !faqId) return;

    // Check if submission is allowed
    if (!canSubmit()) {
      if (questionCount >= 20 && !limitMessageShown) {
        showLimitMessage();
      }
      return;
    }

    // Prevent concurrent requests on mobile
    if (isMobile && pendingRequestRef.current) {
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    pendingRequestRef.current = true;

    // Increment counter immediately to prevent rapid submissions
    setQuestionCount(prev => prev + 1);

    // Start cooldown immediately
    startCooldown();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: faqId ? '' : text.trim(),
      isUser: true,
      timestamp: Date.now(),
    };

    // If clicking a suggestion, show the question as user message
    if (faqId) {
      const faq = INITIAL_SUGGESTIONS.find(s => s.id === faqId) || suggestions.find(s => s.id === faqId);
      if (faq) {
        userMessage.text = faq.label;
      }
    }

    setMessages(prev => [...prev, userMessage]);
    setDisplayedTexts(prev => ({ ...prev, [userMessage.id]: userMessage.text }));
    setInputValue('');

    // On mobile, use requestAnimationFrame for better performance
    if (isMobile) {
      requestAnimationFrame(() => {
        scrollToBottom(false);
      });
    } else {
      setTimeout(() => {
        scrollToBottom(true);
      }, 0);
    }

    try {
      const response = await fetch('/api/faq-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqId ? { faqId } : { message: text.trim() }),
        signal: abortControllerRef.current.signal,
      });

      // Check if request was aborted
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data;
      try {
        const responseText = await response.text();
        if (!responseText || responseText.trim() === '') {
          throw new Error('Empty response from server');
        }
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!data || typeof data !== 'object' || !data.reply) {
        throw new Error('Invalid response format');
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: data.reply || 'I apologize, but I encountered an error. Please try again.',
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMessage]);
      
      // On mobile, use requestAnimationFrame for better performance
      if (isMobile) {
        requestAnimationFrame(() => {
          scrollToBottom(false);
        });
      } else {
        setTimeout(() => {
          scrollToBottom(true);
        }, 0);
      }
      
      startTypewriter(botMessage.id, botMessage.text);

      if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions(INITIAL_SUGGESTIONS);
      }
      
      pendingRequestRef.current = false;
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      console.error('Error sending message:', error);
      pendingRequestRef.current = false;
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        text: 'I apologize, but I encountered an error. Please try again.',
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // On mobile, use requestAnimationFrame for better performance
      if (isMobile) {
        requestAnimationFrame(() => {
          scrollToBottom(false);
        });
      } else {
        setTimeout(() => {
          scrollToBottom(true);
        }, 0);
      }
      
      startTypewriter(errorMessage.id, errorMessage.text);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    handleSendMessage('', suggestion.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-4">
          FAQ Assistant
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Find answers to common questions about Corqon.
        </p>
      </div>

      <div className="relative z-20 bg-gray-100 dark:bg-gray-800 md:bg-white/60 md:dark:bg-white/5 md:backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Chat Messages */}
        <div ref={messagesContainerRef} className="min-h-[400px] max-h-[600px] overflow-y-auto mb-6 space-y-4 pr-2 bg-transparent rounded-lg md:rounded-none p-4 md:p-0 -m-4 md:m-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {displayedTexts[message.id] ?? message.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={!canSubmit()}
                className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-full text-white/70 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10"
                aria-label={`Ask: ${suggestion.label}`}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            rows={1}
            disabled={!canSubmit()}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Type your question"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || !canSubmit()}
            className="w-11 h-11 flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 active:bg-blue-800 dark:active:bg-blue-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            aria-label="Send message"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19V5m0 0l-7 7m7-7l7 7"
              />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
