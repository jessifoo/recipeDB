/**
 * Mock AI Adapter - For testing without API calls
 */

import type { IAIProvider, AIOptions, ChatMessage } from '@/core/ports/integration.port';
import type { ILogger } from '@/core/ports/logger.port';

export class MockAIAdapter implements IAIProvider {
  constructor(private logger: ILogger) {}

  async generateText(prompt: string, options?: AIOptions): Promise<string> {
    this.logger.debug('Mock AI: Generating text', { prompt });
    return `Mock response to: ${prompt.substring(0, 50)}...`;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    this.logger.debug('Mock AI: Generating embedding', { text });
    // Return mock 1536-dimensional embedding (OpenAI ada-002 size)
    return new Array(1536).fill(0).map(() => Math.random());
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    this.logger.debug('Mock AI: Chat', { messageCount: messages.length });
    const lastMessage = messages[messages.length - 1];
    return `Mock AI response to: ${lastMessage?.content}`;
  }
}
