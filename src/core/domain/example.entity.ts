/**
 * Example Entity - Pure domain model
 * NO framework dependencies (no Prisma, no tRPC, nothing)
 */

export interface Example {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Value Objects for type safety
 */
export type ExampleId = string & { readonly __brand: 'ExampleId' };
export type ExampleName = string & { readonly __brand: 'ExampleName' };

/**
 * Domain rules/invariants
 */
export class ExampleRules {
  static readonly MIN_NAME_LENGTH = 1;
  static readonly MAX_NAME_LENGTH = 100;
  static readonly MIN_CONTENT_LENGTH = 1;

  static validateName(name: string): void {
    if (name.length < this.MIN_NAME_LENGTH || name.length > this.MAX_NAME_LENGTH) {
      throw new Error(`Name must be between ${this.MIN_NAME_LENGTH} and ${this.MAX_NAME_LENGTH} characters`);
    }
  }

  static validateContent(content: string): void {
    if (content.length < this.MIN_CONTENT_LENGTH) {
      throw new Error(`Content must be at least ${this.MIN_CONTENT_LENGTH} character`);
    }
  }

  static cannotBeTestInProduction(name: string): void {
    if (process.env.NODE_ENV === 'production' && name.toLowerCase() === 'test') {
      throw new Error('Cannot use "test" as name in production');
    }
  }
}
