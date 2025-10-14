/**
 * OpenAI Adapter - AI Provider Implementation
 * 
 * Swap to: claude.adapter.ts, local-llm.adapter.ts, etc.
 */

import type { IAIProvider, AIOptions, ChatMessage } from '@/core/ports/integration.port';
import type { ILogger } from '@/core/ports/logger.port';

export class OpenAIAdapter implements IAIProvider {
  constructor(
    private apiKey: string,
    private logger: ILogger
  ) {}

  async generateText(prompt: string, options?: AIOptions): Promise<string> {
    this.logger.info('Generating text with OpenAI', { prompt: prompt.substring(0, 50) });
    
    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options?.model || 'gpt-4',
          prompt,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      return data.choices[0].text;
    } catch (error) {
      this.logger.error('OpenAI generation failed', { error });
      throw new Error('Failed to generate text');
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    this.logger.info('Generating embedding', { text: text.substring(0, 50) });
    
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      this.logger.error('Embedding generation failed', { error });
      throw new Error('Failed to generate embedding');
    }
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    this.logger.info('Chat completion', { messageCount: messages.length });
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      this.logger.error('Chat completion failed', { error });
      throw new Error('Failed to complete chat');
    }
  }
}
