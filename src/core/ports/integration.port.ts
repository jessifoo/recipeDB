/**
 * Third-Party Integration Ports
 * 
 * Define interfaces for all external services.
 * Swap implementations without changing business logic.
 * 
 * Examples:
 * - OpenAI → Claude → Local LLM
 * - SendGrid → Postmark → AWS SES
 * - Stripe → PayPal → Square
 */

/**
 * AI/LLM Integration Port
 * 
 * Implementations:
 * - OpenAI (GPT-4)
 * - Anthropic (Claude)
 * - Local LLM
 * - Mock (for testing)
 */
export interface IAIProvider {
  generateText(prompt: string, options?: AIOptions): Promise<string>;
  generateEmbedding(text: string): Promise<number[]>;
  chat(messages: ChatMessage[]): Promise<string>;
}

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Email Service Port
 * 
 * Implementations:
 * - SendGrid
 * - Postmark
 * - AWS SES
 * - Mock (for testing)
 */
export interface IEmailProvider {
  send(email: Email): Promise<void>;
  sendBatch(emails: Email[]): Promise<void>;
}

export interface Email {
  to: string | string[];
  from: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
}

/**
 * Payment Provider Port
 * 
 * Implementations:
 * - Stripe
 * - PayPal
 * - Square
 * - Mock (for testing)
 */
export interface IPaymentProvider {
  createCheckout(amount: number, currency: string, metadata?: Record<string, string>): Promise<CheckoutSession>;
  refund(paymentId: string, amount?: number): Promise<Refund>;
  getPayment(paymentId: string): Promise<Payment>;
}

export interface CheckoutSession {
  id: string;
  url: string;
  status: 'pending' | 'completed' | 'canceled';
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: Date;
}

export interface Refund {
  id: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed';
}

/**
 * Storage Provider Port
 * 
 * Implementations:
 * - AWS S3
 * - Cloudflare R2
 * - Local filesystem
 * - Mock (for testing)
 */
export interface IStorageProvider {
  upload(file: File, path: string): Promise<UploadResult>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getUrl(path: string, expiresIn?: number): Promise<string>;
}

export interface File {
  name: string;
  content: Buffer;
  mimeType: string;
}

export interface UploadResult {
  path: string;
  url: string;
  size: number;
}

/**
 * Analytics Provider Port
 * 
 * Implementations:
 * - Mixpanel
 * - Segment
 * - Plausible
 * - Mock (for testing)
 */
export interface IAnalyticsProvider {
  track(event: string, properties?: Record<string, unknown>): Promise<void>;
  identify(userId: string, traits?: Record<string, unknown>): Promise<void>;
  page(name: string, properties?: Record<string, unknown>): Promise<void>;
}

/**
 * Search Provider Port
 * 
 * Implementations:
 * - Algolia
 * - Meilisearch
 * - Typesense
 * - Database full-text search
 */
export interface ISearchProvider {
  index(documents: SearchDocument[]): Promise<void>;
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
  delete(documentId: string): Promise<void>;
}

export interface SearchDocument {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

export interface SearchResult {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}
