import { NextRequest, NextResponse } from 'next/server';
import { faqData } from '@/lib/faqData';
import {
  findBestMatch,
  normalizeText,
  tokenize,
  CONFIDENCE_THRESHOLD,
  FALLBACK_RESPONSE,
  calculateSimilarityScore,
} from '@/lib/faqMatch';

interface ChatRequest {
  message?: string;
  faqId?: string;
}

interface ChatResponse {
  reply: string;
  matchedId?: string;
  suggestions?: Array<{ id: string; label: string }>;
}

function getSuggestions(userInput: string, count: number = 4): Array<{ id: string; label: string }> {
  const tokens = tokenize(normalizeText(userInput));
  
  const scored = faqData.map(faq => ({
    faq,
    score: calculateSimilarityScore(userInput, tokens, faq),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  return scored
    .slice(0, count)
    .filter(item => item.score > 0)
    .map(item => ({
      id: item.faq.id,
      label: item.faq.question,
    }));
}

export async function POST(request: NextRequest) {
  try {
    let body: ChatRequest;
    
    try {
      const rawBody = await request.text();
      if (!rawBody || rawBody.trim() === '') {
        return NextResponse.json<ChatResponse>({
          reply: 'Please provide either a message or an faqId.',
        }, { status: 400 });
      }
      body = JSON.parse(rawBody) as ChatRequest;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json<ChatResponse>({
        reply: 'Invalid request format. Please provide a valid JSON body.',
      }, { status: 400 });
    }
    
    // Validate body structure
    if (!body || (typeof body !== 'object')) {
      return NextResponse.json<ChatResponse>({
        reply: 'Please provide either a message or an faqId.',
      }, { status: 400 });
    }
    
    // Handle direct FAQ ID lookup
    if (body.faqId) {
      const faq = faqData.find(item => item.id === body.faqId);
      if (faq) {
        return NextResponse.json<ChatResponse>({
          reply: faq.answer,
          matchedId: faq.id,
        });
      }
      return NextResponse.json<ChatResponse>({
        reply: 'I could not find that topic. Please try asking a question or selecting a suggested topic.',
      }, { status: 404 });
    }
    
    // Handle message matching
    if (body.message && typeof body.message === 'string') {
      const match = findBestMatch(body.message, faqData);
      
      if (match && match.score >= CONFIDENCE_THRESHOLD) {
        return NextResponse.json<ChatResponse>({
          reply: match.faq.answer,
          matchedId: match.faq.id,
        });
      }
      
      // Fallback with helpful response
      const suggestions = getSuggestions(body.message);
      
      return NextResponse.json<ChatResponse>({
        reply: FALLBACK_RESPONSE,
        suggestions,
      });
    }
    
    return NextResponse.json<ChatResponse>({
      reply: 'Please provide either a message or an faqId.',
    }, { status: 400 });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json<ChatResponse>({
      reply: 'An error occurred while processing your request.',
    }, { status: 500 });
  }
}
