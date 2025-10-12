/**
 * Demo API route showing correct logger usage
 * This demonstrates the ONLY approved way to log in this codebase
 */

import { logger } from '@recipedb/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // ✅ CORRECT: Using centralized logger
  logger.info('Demo API called', {
    url: request.url,
    method: request.method,
  });

  try {
    // Simulate some work
    const data = {
      message: 'Demo API response',
      timestamp: new Date().toISOString(),
      features: {
        logging: 'centralized',
        enforcement: ['ESLint', 'pre-commit hooks', 'TypeScript'],
      },
    };

    logger.debug('Response data prepared', { data });

    return NextResponse.json(data);
  } catch (error) {
    // ✅ CORRECT: Logging errors with context
    logger.error('Demo API failed', error, {
      url: request.url,
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  logger.info('Demo POST request received');

  try {
    const body = await request.json();
    
    logger.debug('Request body received', { body });

    // Simulate validation warning
    if (!body.name) {
      logger.warn('POST request missing required field', { 
        field: 'name',
        received: Object.keys(body),
      });
      
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    logger.info('POST request processed successfully', { name: body.name });

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    logger.error('Failed to process POST request', error);
    
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
