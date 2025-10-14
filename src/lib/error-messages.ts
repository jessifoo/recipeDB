/**
 * Centralized Error Messages - ONE PLACE for all error messages
 * 
 * Usage:
 * import { ErrorMessages } from '@/lib/error-messages';
 * throw new Error(ErrorMessages.RECIPE_NOT_FOUND);
 */

export const ErrorMessages = {
  // Generic errors
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'An internal error occurred',
  
  // Example domain errors (replace with your domain)
  EXAMPLE_NOT_FOUND: 'Example not found',
  EXAMPLE_ALREADY_EXISTS: 'Example already exists',
  EXAMPLE_INVALID_DATA: 'Invalid example data',
  
  // Add your domain-specific errors here:
  // RECIPE_NOT_FOUND: 'Recipe not found',
  // RECIPE_INVALID_SERVINGS: 'Servings must be a positive number',
  // RECIPE_DUPLICATE_TITLE: 'A recipe with this title already exists',
  
  // PRODUCT_OUT_OF_STOCK: 'Product is out of stock',
  // PRODUCT_INVALID_PRICE: 'Price must be greater than zero',
  
  // USER_EMAIL_EXISTS: 'Email already registered',
  // USER_INVALID_PASSWORD: 'Password must be at least 8 characters',
  
} as const;

/**
 * Error codes for programmatic handling
 */
export const ErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  
  // Add your codes here
  // RECIPE_NOT_FOUND: 'RECIPE_NOT_FOUND',
  // PRODUCT_OUT_OF_STOCK: 'PRODUCT_OUT_OF_STOCK',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
export type ErrorMessage = typeof ErrorMessages[keyof typeof ErrorMessages];
