'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import OpenTopDottedFrame from '@/components/ui/OpenTopDottedFrame';
import DottedDivider from '@/components/ui/DottedDivider';
import DecisionInputsPanel from '@/components/home/DecisionInputsPanel';
import DefinitionsPanel from '@/components/home/DefinitionsPanel';

const USER_QUESTION = 'Using the Week 50 briefing, what should I prioritize first this week?';

const ASSISTANT_RESPONSE = `Week 50 summary (system-level)

What the signals indicate
• Planning instability is elevated across delivery workstreams.
• Last-minute changes are clustering in Teams A, B, and C.
• Context switching is above the 4-week average, increasing operational friction.

What to do first (next 5 business days)
• Tighten change control for high-change workstreams (owner: COO, timeframe: 1 week).
• Introduce a protected focus block policy in delivery teams (owner: Head of Delivery, timeframe: 2 weeks).
• Set a weekly review cadence for Team A/B/C drivers and deltas (owner: HRD + COO, timeframe: ongoing).

Why this is the right first move
• These actions target the leading drivers behind the Week 50 risk uptick.
• Coverage and participation are sufficient to treat this as a reliable pattern signal.
• Goal is stability and predictability, not individual performance.

Aggregated signals only. No individual scoring. Not a medical product.`;

// Week-specific responses for deep-linked questions
const getWeekResponse = (weekNum: string): string => {
  const responses: Record<string, string> = {
    '48': `Week 48 summary (system-level)

What the signals indicate
• System-level indicators remain within expected ranges.
• Meeting density and context switching aligned with 4-week average.
• Baseline patterns show consistent operational rhythm.

What to do first (next 5 business days)
• Review meeting cadence for Q1 planning (owner: COO, timeframe: 2 weeks).
• Assess context switching patterns in delivery teams (owner: Head of Delivery, timeframe: 3 weeks).
• Monitor baseline absence trends (owner: HRD, timeframe: ongoing).

Why this is the right first move
• These actions maintain operational stability during baseline periods.
• Proactive monitoring helps catch early signals before they escalate.
• Goal is to preserve the current healthy rhythm.

Aggregated signals only. No individual scoring. Not a medical product.`,
    '49': `Week 49 summary (system-level)

What the signals indicate
• Early volatility signals observed with upticks in fragmentation and instability.
• Context switching increased vs 4-week average.
• Last-minute change pressure trending upward.

What to do first (next 5 business days)
• Address planning volatility in project timelines (owner: Head of Delivery, timeframe: 2 weeks).
• Review context switching patterns in high-pressure teams (owner: COO, timeframe: 2 weeks).
• Monitor early risk signals for escalation patterns (owner: HRD, timeframe: ongoing).

Why this is the right first move
• These actions address emerging pressure points before they become structural issues.
• Early intervention can prevent the patterns observed in Week 49 from escalating.
• Goal is to stabilize patterns before they compound.

Aggregated signals only. No individual scoring. Not a medical product.`,
    '50': ASSISTANT_RESPONSE
  };
  
  return responses[weekNum] || ASSISTANT_RESPONSE;
};

type ContextStage = 'import' | 'weekSelect' | 'ready';
type AnimationStage = ContextStage | 'user-typing' | 'user-visible' | 'assistant-typing' | 'assistant-streaming' | 'complete';

export default function AnimatedChatDemo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stage, setStage] = useState<AnimationStage>('import');
  const [userText, setUserText] = useState('');
  const [assistantText, setAssistantText] = useState('');
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<48 | 49 | 50>(48);
  const [contextStage, setContextStage] = useState<ContextStage>('import');
  const [isDeepLinked, setIsDeepLinked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const userTypewriterIntervalRef = useRef<number | null>(null);
  const assistantTypewriterIntervalRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const prefersReducedMotion = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const autoPromptSentRef = useRef(false);

  // Shared function to animate assistant response with typewriter effect
  const animateAssistantResponse = useCallback((fullResponse: string, onComplete?: () => void) => {
    // Clear any existing animation
    if (assistantTypewriterIntervalRef.current) {
      clearInterval(assistantTypewriterIntervalRef.current);
      assistantTypewriterIntervalRef.current = null;
    }

    setShowTypingIndicator(false);
    setStage('assistant-streaming');

    // Respect reduced motion preference
    if (prefersReducedMotion.current) {
      setAssistantText(fullResponse);
      setStage('complete');
      onComplete?.();
      return;
    }

    // Typewriter animation
    let assistantIndex = 0;
    const typingSpeed = 18; // milliseconds per character (same as normal flow)
    
    assistantTypewriterIntervalRef.current = window.setInterval(() => {
      assistantIndex += 1;
      if (assistantIndex <= fullResponse.length) {
        setAssistantText(fullResponse.slice(0, assistantIndex));
      } else {
        if (assistantTypewriterIntervalRef.current) {
          clearInterval(assistantTypewriterIntervalRef.current);
          assistantTypewriterIntervalRef.current = null;
        }
        setStage('complete');
        onComplete?.();
      }
    }, typingSpeed);
  }, []);

  // Single source of truth send function
  const sendMessage = useCallback(async (text?: string) => {
    // Prevent sending if already loading
    if (isLoading) {
      return;
    }

    const messageToSend = text?.trim() || userText.trim();
    
    if (!messageToSend) {
      return;
    }

    try {
      // Set loading state
      setIsLoading(true);
      setShowTypingIndicator(true);
      setStage('assistant-typing');

      // For weekly briefing questions, use contextual response
      const weekMatch = messageToSend.match(/Week (\d+)/);
      if (weekMatch) {
        const weekNum = weekMatch[1];
        
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = getWeekResponse(weekNum);
        
        // Use shared animation function
        animateAssistantResponse(response);
      } else {
        // Fallback: try the FAQ API
        const response = await fetch('/api/faq-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageToSend }),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
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

        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format');
        }
        
        // Use shared animation function
        animateAssistantResponse(data.reply || 'I apologize, but I could not generate a response.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Use shared animation function for error messages too
      animateAssistantResponse('I apologize, but I encountered an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, userText, animateAssistantResponse]);

  useEffect(() => {
    setMounted(true);
    
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.current = mediaQuery.matches;
    }
  }, []);

  // Handle deep link from Weekly CFO Briefing
  useEffect(() => {
    if (!mounted || !searchParams || autoPromptSentRef.current) return;
    
    const source = searchParams.get('source');
    const weekParam = searchParams.get('week');
    
    if (source === 'weekly-briefing') {
      setIsDeepLinked(true);
      autoPromptSentRef.current = true;
      
      // Extract week number and set it
      if (weekParam) {
        const weekNum = parseInt(weekParam, 10);
        if ([48, 49, 50].includes(weekNum)) {
          setSelectedWeek(weekNum as 48 | 49 | 50);
        }
      }
      
      // Scroll to section smoothly with offset for better positioning
      setTimeout(() => {
        const section = document.getElementById('briefing-chat');
        if (section) {
          const ANCHOR_OFFSET_PX = 120;
          const y = section.getBoundingClientRect().top + window.scrollY - ANCHOR_OFFSET_PX;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      
      // Skip animation and show ready state immediately
      setContextStage('ready');
      setStage('ready');
      
      // Set the question and trigger the send function
      setTimeout(() => {
        const weekNum = weekParam || '50';
        const prefilledQuestion = `Explain Week ${weekNum} and recommended next steps.`;
        
        // Set the user text to display in the UI
        setUserText(prefilledQuestion);
        setStage('user-visible');
        
        // Actually send the message to get the response
        // Use a small delay to ensure the user message is visible first
        setTimeout(() => {
          sendMessage(prefilledQuestion);
        }, 300);
        
        // Remove the query params to prevent re-triggering on re-render
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, '', '/#briefing-chat');
        }
      }, 500);
    }
  }, [mounted, searchParams, router, sendMessage]);

  // Listen for assistant bridge events from dashboard or other components
  useEffect(() => {
    if (!mounted) return;

    const handleAssistantAsk = (event: Event) => {
      const customEvent = event as CustomEvent<{ week: number; prompt: string }>;
      const { week, prompt } = customEvent.detail;
      
      // Set deep linked flag to skip animation
      setIsDeepLinked(true);
      
      // Set the week
      if ([48, 49, 50].includes(week)) {
        setSelectedWeek(week as 48 | 49 | 50);
      }
      
      // Scroll to section smoothly with offset
      const section = document.getElementById('briefing-chat');
      if (section) {
        const ANCHOR_OFFSET_PX = 120;
        const y = section.getBoundingClientRect().top + window.scrollY - ANCHOR_OFFSET_PX;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      
      // Set ready state
      setContextStage('ready');
      setStage('ready');
      
      // Set the user text and send the message
      setTimeout(() => {
        setUserText(prompt);
        setStage('user-visible');
        
        // Send the message with typing animation
        setTimeout(() => {
          sendMessage(prompt);
        }, 300);
      }, 300);
    };

    window.addEventListener('corqon:assistantAsk', handleAssistantAsk);
    
    return () => {
      window.removeEventListener('corqon:assistantAsk', handleAssistantAsk);
    };
  }, [mounted, sendMessage]);

  const scrollToBottom = (smooth: boolean = false) => {
    if (messagesContainerRef.current) {
      if (smooth && !prefersReducedMotion.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
  };

  // Auto-scroll when messages update
  useEffect(() => {
    if (userText || assistantText || showTypingIndicator) {
      scrollToBottom(true);
    }
  }, [userText, assistantText, showTypingIndicator]);

  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
    
    if (userTypewriterIntervalRef.current) {
      clearInterval(userTypewriterIntervalRef.current);
      userTypewriterIntervalRef.current = null;
    }
    if (assistantTypewriterIntervalRef.current) {
      clearInterval(assistantTypewriterIntervalRef.current);
      assistantTypewriterIntervalRef.current = null;
    }
  };

  const addTimer = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  };

  const startAnimation = () => {
    clearAllTimers();
    
    setStage('import');
    setContextStage('import');
    setUserText('');
    setAssistantText('');
    setShowTypingIndicator(false);
    setSelectedWeek(48);

    if (prefersReducedMotion.current) {
      // Skip context stages, show ready state immediately
      setContextStage('ready');
      setStage('ready');
      setSelectedWeek(50);
      
      // Show user question instantly
      addTimer(() => {
        setUserText(USER_QUESTION);
        setStage('user-visible');
        
        // Wait, then show typing indicator
        addTimer(() => {
          setShowTypingIndicator(true);
          setStage('assistant-typing');
          
          // Wait, then show full response instantly
          addTimer(() => {
            setShowTypingIndicator(false);
            setAssistantText(ASSISTANT_RESPONSE);
            setStage('complete');
            
            // Reset after pause
            addTimer(() => {
              startAnimation();
            }, 3000);
          }, 1500);
        }, 1000);
      }, 500);
    } else {
      // Week selection animation durations (exactly 4000ms total)
      const WEEK_SELECT_DURATIONS = {
        open: 500,      // A) Open selector
        visible: 1200,  // B) Options visible
        highlight: 800, // C) Week 50 highlight
        select: 700,    // D) Select Week 50
        confirm: 800,   // E) Confirm chip
      } as const;
      
      // Verify total is exactly 4000ms
      const TOTAL = Object.values(WEEK_SELECT_DURATIONS).reduce((a, b) => a + b, 0);
      if (TOTAL !== 4000) {
        console.error(`Week selection duration mismatch: expected 4000ms, got ${TOTAL}ms`);
      }
      
      // Stage 1: Import briefing
      addTimer(() => {
        setContextStage('import');
        setStage('import');
      }, 0);
      
      // Stage 2: Week select - exactly 4000ms sequence
      // Timeline: A(500ms) -> B(1200ms) -> C(800ms) -> D(700ms) -> E(800ms) = 4000ms total
      const weekSelectStartDelay = 1000;
      addTimer(() => {
        // A) Open selector (0ms into week selection)
        setContextStage('weekSelect');
        setStage('weekSelect');
        setSelectedWeek(48);
        
        // B) Hold with options visible (500ms after open)
        // C) Highlight Week 50 (500+1200=1700ms after open)
        addTimer(() => {
          setSelectedWeek(50);
          
          // D) Select Week 50 (1700+800=2500ms after open)
          addTimer(() => {
            // E) Confirm chip (2500+700=3200ms after open)
            addTimer(() => {
              setContextStage('ready');
              setStage('ready');
              setSelectedWeek(50);
              
              // F) Immediately proceed to typing (3200+800=4000ms after open)
              addTimer(() => {
                setStage('user-typing');
                
                // Typewriter effect for user question
                let userIndex = 0;
                userTypewriterIntervalRef.current = window.setInterval(() => {
                  userIndex += 1;
                  if (userIndex <= USER_QUESTION.length) {
                    setUserText(USER_QUESTION.slice(0, userIndex));
                  } else {
                    if (userTypewriterIntervalRef.current) {
                      clearInterval(userTypewriterIntervalRef.current);
                      userTypewriterIntervalRef.current = null;
                    }
                    setStage('user-visible');
                    
                    // Wait, then show typing indicator
                    addTimer(() => {
                      setShowTypingIndicator(true);
                      setStage('assistant-typing');
                      
                      // Wait, then start streaming assistant response
                      addTimer(() => {
                        // Use shared animation function
                        animateAssistantResponse(ASSISTANT_RESPONSE, () => {
                          // Reset after pause
                          addTimer(() => {
                            startAnimation();
                          }, 3000);
                        });
                      }, 2000);
                    }, 1000);
                  }
                }, 30);
              }, 0);
            }, WEEK_SELECT_DURATIONS.confirm);
          }, WEEK_SELECT_DURATIONS.select);
        }, WEEK_SELECT_DURATIONS.open + WEEK_SELECT_DURATIONS.visible);
      }, weekSelectStartDelay);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    
    // Skip animation if deep linked
    if (isDeepLinked) {
      return;
    }
    
    // Start animation after a short delay
    const initialDelay = window.setTimeout(() => {
      startAnimation();
    }, 500);

    return () => {
      clearAllTimers();
      clearTimeout(initialDelay);
    };
  }, [mounted, isDeepLinked]);

  if (!mounted) {
    return null;
  }

  return (
    <section id="briefing-chat" className="corqon-section scroll-mt-28">
      {/* Dotted Frame Wrapper - Same geometry as cards section */}
      <OpenTopDottedFrame
        alignClassName="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12"
        contentClassName="p-0"
        fadeFromTopPx={64}
      >
        {/* Chatbot Area */}
        <div className="px-8 pt-0 pb-12">
          {/* Section Header - Centered */}
          <div className="mb-12 lg:mb-16 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-4">
              Talk to your weekly briefing
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed mb-6">
              Ask what to prioritize next. Get a clear, system-level answer grounded in Week 50 context.
            </p>
            <p className="text-xs text-white/40">
              Privacy-safe aggregation. No individual scoring. Not a medical product.
            </p>
          </div>

          {/* Chat Card - Fixed Height with Internal Scrolling */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 lg:p-8 h-[520px] md:h-[560px] flex flex-col">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  CORQON Assistant
                </div>
                <div className="text-xs text-white/40">
                  Online
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area - Scrollable */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden mb-6 space-y-4 pr-2 scrollbar-hide"
          >
            {/* User Message */}
            {(stage === 'user-typing' || stage === 'user-visible' || stage === 'assistant-typing' || stage === 'assistant-streaming' || stage === 'complete') && (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-blue-500 text-white">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {userText}
                    {stage === 'user-typing' && (
                      <span className="inline-block w-0.5 h-4 bg-white ml-1 animate-pulse" />
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {showTypingIndicator && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Assistant Message */}
            {(stage === 'assistant-streaming' || stage === 'complete') && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white/10 text-white">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {assistantText}
                    {stage === 'assistant-streaming' && (
                      <span className="inline-block w-0.5 h-4 bg-white ml-1 animate-pulse" />
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar (Disabled) - Fixed */}
          <form className="flex gap-3 items-end mb-3 flex-shrink-0">
            <textarea
              value=""
              readOnly
              disabled
              placeholder="Type your question..."
              rows={1}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 opacity-50 cursor-not-allowed pointer-events-none resize-none"
              aria-label="Chat input (demo only)"
            />
            <button
              type="button"
              disabled
              className="w-11 h-11 flex items-center justify-center bg-blue-500 text-white rounded-lg opacity-40 cursor-not-allowed pointer-events-none"
              aria-label="Send message (disabled)"
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

          {/* Context Area - Fixed Height */}
          <div className="h-10 flex items-center flex-shrink-0">
            {/* Stage 1: Import briefing */}
            {contextStage === 'import' && (
              <div className="inline-flex items-center gap-2 text-xs text-white/70">
                <svg
                  className="w-3.5 h-3.5 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="font-medium">Import briefing</span>
                <div className="flex gap-1 ml-1">
                  <div className="w-1 h-1 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Stage 2: Week select */}
            {contextStage === 'weekSelect' && (
              <div className="w-full">
                <div className="text-xs text-white/40 mb-1.5">Select week</div>
                <div className="flex gap-2">
                  {([48, 49, 50] as const).map((week) => (
                    <div
                      key={week}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                        selectedWeek === week
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'bg-white/5 text-white/70 border border-white/10'
                      }`}
                    >
                      Week {week}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stage 3: Ready badge */}
            {contextStage === 'ready' && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B0F17] border border-[#4C7DFF]/30 text-xs shadow-[0_0_0_1px_rgba(76,125,255,0.10)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4C7DFF]"></div>
                <svg
                  className="w-3 h-3 text-[#4C7DFF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="font-medium text-white/70">Week {selectedWeek} briefing</span>
                <span className="text-white/30 text-[10px]">Decision support context</span>
              </div>
            )}
          </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dotted Divider - Roof line for new blocks area */}
        <DottedDivider />

        {/* New Under-Area: 70/30 Blocks */}
        <div className="px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] lg:divide-x lg:divide-white/10 gap-6 lg:gap-0">
            <div className="lg:pr-6">
              <DecisionInputsPanel />
            </div>
            <div className="lg:pl-6">
              <DefinitionsPanel />
            </div>
          </div>
        </div>
      </OpenTopDottedFrame>
    </section>
  );
}
