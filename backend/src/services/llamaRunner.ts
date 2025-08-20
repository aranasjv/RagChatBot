import { getLlama, LlamaChatSession } from 'node-llama-cpp';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your GGUF model
const modelPath = path.resolve(__dirname, '../../models/capybarahermes-2.5-mistral-7b.Q8_0.gguf');

// Initialize LLaMA model variables
let session: LlamaChatSession | null = null;
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

async function initializeLlama(): Promise<void> {
  if (session) return;
  if (isInitializing && initializationPromise) {
    return initializationPromise;
  }

  isInitializing = true;
  initializationPromise = (async () => {
    try {
      logger.info('Starting Llama model initialization...');
      const llama = await getLlama();
      const model = await llama.loadModel({ modelPath });
      const context = await model.createContext();
      
      // Try to create session - handle different API versions
      try {
        // Try the most common approach first
        session = new LlamaChatSession({ context } as any);
      } catch (sessionError) {
        // Fallback to contextSequence if available
        if (typeof (context as any).getSequence === 'function') {
          session = new LlamaChatSession({
            contextSequence: (context as any).getSequence()
          });
        } else {
          throw new Error('Could not create LlamaChatSession - no compatible API found');
        }
      }
      
      logger.info('Llama model initialized successfully');
    } catch (err: any) {
      logger.error('Failed to initialize Llama model: %s', err.message, { stack: err.stack });
      throw new Error(`Failed to initialize Llama model: ${err.message}`);
    } finally {
      isInitializing = false;
    }
  })();

  return initializationPromise;
}

function cleanOutput(text: string): string {
  if (!text) return '';

  let cleaned = text.trim();
  const prefixes = ['bot:', 'assistant:', 'ai:', 'me:', 'user:'];
  const lowerCleaned = cleaned.toLowerCase();
  
  for (const prefix of prefixes) {
    if (lowerCleaned.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length).trim();
      break;
    }
  }

  return cleaned.replace(/\n{3,}/g, '\n\n');
}

export async function runLlama(prompt: string, asJson: boolean = false): Promise<string> {
  try {
    if (!session) {
      await initializeLlama();
    }

    if (!prompt?.trim()) {
      throw new Error('Invalid prompt: must be a non-empty string');
    }

    if (!session) {
      throw new Error('Llama session not initialized');
    }

    const response = await session.prompt(prompt);
    const cleaned = cleanOutput(response);

    if (asJson) {
      const responseObj = { 
        answer: cleaned, 
        raw: response.trim(),
        timestamp: new Date().toISOString()
      };
      logger.info('Llama response generated');
      return JSON.stringify(responseObj, null, 2);
    }

    logger.info('Llama response generated');
    return cleaned;
  } catch (err: any) {
    const errorMsg = `⚠️ Llama pipeline error: ${err.message}`;
    logger.error('Error running Llama: %s', err.message, { stack: err.stack });
    
    if (asJson) {
      return JSON.stringify({
        error: errorMsg,
        timestamp: new Date().toISOString()
      }, null, 2);
    }
    
    return errorMsg;
  }
}

export async function cleanupLlama(): Promise<void> {
  if (session) {
    session = null;
    initializationPromise = null;
    logger.info('Llama session cleaned up');
  }
}

// Export for testing/debugging
export { initializeLlama };