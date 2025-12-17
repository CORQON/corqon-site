import { FAQItem } from './faqData';

/**
 * Normalizes text by:
 * - Trimming whitespace
 * - Converting to lowercase
 * - Removing punctuation and symbols (keeping letters/numbers/spaces)
 * - Collapsing multiple spaces to single space
 * - Removing diacritics (accents)
 */
export function normalizeText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with space
    .replace(/\s+/g, ' '); // Collapse multiple spaces
}

/**
 * Tokenizes normalized text into an array of words
 */
export function tokenize(text: string): string[] {
  return text.split(/\s+/).filter(word => word.length > 0);
}

/**
 * Checks if the normalized input matches common greeting patterns
 * Handles variants like: hey, heyy, hello, helloo, hi, hii, yo, sup, etc.
 * Also handles multi-word greetings like "hello there", "hey corqon"
 */
export function isGreeting(normalizedInput: string, tokens: string[]): boolean {
  // Single word greeting pattern
  const singleWordGreetingPattern = /^(h+i+|he+y+|hell+o+|yo+|sup+|hey+)$/;
  if (singleWordGreetingPattern.test(normalizedInput)) {
    return true;
  }
  
  // Multi-word greeting: check if first token is a greeting word
  if (tokens.length > 0) {
    const firstToken = tokens[0];
    const greetingWords = ['hi', 'hey', 'hello', 'yo', 'sup', 'hii', 'heyy', 'helloo'];
    return greetingWords.some(greeting => firstToken.startsWith(greeting) || greeting.startsWith(firstToken));
  }
  
  return false;
}

/**
 * Calculates Jaccard similarity between two sets of tokens
 * Returns a value between 0 and 1
 */
export function jaccardSimilarity(tokens1: string[], tokens2: string[]): number {
  if (tokens1.length === 0 && tokens2.length === 0) return 1.0;
  if (tokens1.length === 0 || tokens2.length === 0) return 0.0;

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Checks if one string contains the other (for substring matching)
 */
export function containsMatch(str1: string, str2: string): boolean {
  return str1.includes(str2) || str2.includes(str1);
}

/**
 * Calculates a similarity score between user input and an FAQ entry
 * Returns a score between 0 and 1
 */
export function calculateSimilarityScore(
  userInput: string,
  userTokens: string[],
  faq: FAQItem
): number {
  const normalizedInput = normalizeText(userInput);
  const normalizedQuestion = normalizeText(faq.question);
  const questionTokens = tokenize(normalizedQuestion);
  
  // Exact normalized match: 1.0
  if (normalizedInput === normalizedQuestion) {
    return 1.0;
  }
  
  // Check for greeting match
  if (isGreeting(normalizedInput, userTokens)) {
    // Check if FAQ is a greeting/smalltalk entry
    if (faq.tags.includes('smalltalk')) {
      // Give high score for greeting matches
      // If the FAQ question also contains greeting words, boost even more
      const questionLower = normalizedQuestion.toLowerCase();
      const hasGreetingWords = ['hi', 'hey', 'hello', 'yo', 'sup'].some(word => 
        questionLower.includes(word)
      );
      return hasGreetingWords ? 0.95 : 0.85;
    }
  }
  
  // If candidate question includes the query or query includes the candidate: 0.85 to 0.95
  if (containsMatch(normalizedInput, normalizedQuestion)) {
    const lengthRatio = Math.min(normalizedInput.length, normalizedQuestion.length) / 
                        Math.max(normalizedInput.length, normalizedQuestion.length);
    return 0.85 + (lengthRatio * 0.1); // Scale between 0.85 and 0.95
  }
  
  // Token Jaccard similarity
  const jaccard = jaccardSimilarity(userTokens, questionTokens);
  
  // Boost score if there are direct token matches
  let tokenMatchBoost = 0;
  const userTokenSet = new Set(userTokens);
  const questionTokenSet = new Set(questionTokens);
  const matchingTokens = [...userTokenSet].filter(t => questionTokenSet.has(t));
  
  if (matchingTokens.length > 0) {
    // Boost based on proportion of matching tokens
    tokenMatchBoost = (matchingTokens.length / Math.max(userTokens.length, questionTokens.length)) * 0.3;
  }
  
  // Combine Jaccard with token match boost
  const baseScore = jaccard * 0.7;
  const finalScore = Math.min(1.0, baseScore + tokenMatchBoost);
  
  return finalScore;
}

/**
 * Finds the best matching FAQ entry for the given user input
 * Returns the FAQ item and its similarity score, or null if no good match
 */
export function findBestMatch(
  userInput: string,
  faqData: FAQItem[]
): { faq: FAQItem; score: number } | null {
  const normalized = normalizeText(userInput);
  const tokens = tokenize(normalized);
  
  if (tokens.length === 0) {
    return null;
  }
  
  let bestMatch: { faq: FAQItem; score: number } | null = null;
  
  for (const faq of faqData) {
    const score = calculateSimilarityScore(userInput, tokens, faq);
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { faq, score };
    }
  }
  
  return bestMatch;
}

/**
 * Threshold for considering a match confident enough
 * Scores below this will trigger the fallback response
 */
export const CONFIDENCE_THRESHOLD = 0.28;

/**
 * Fallback response when no match meets the threshold
 */
export const FALLBACK_RESPONSE = 'I can help. Are you looking for a sample weekly briefing, privacy and procurement details, or how CORQON measures signals?';

