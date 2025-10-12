/**
 * File marker system
 * ALL generated files must include this metadata
 * Enforces generator usage, prevents manual file creation
 */

export const FILE_MARKER = Symbol.for('@app/generated');

export interface GeneratedFileMetadata {
  readonly [FILE_MARKER]: true;
  readonly generator: string;
  readonly generatedAt: string;
  readonly version: string;
}

/**
 * Helper to create metadata for generated files
 */
export function createFileMetadata(
  generator: string,
  version: string = '1.0.0'
): GeneratedFileMetadata {
  return {
    [FILE_MARKER]: true,
    generator,
    generatedAt: new Date().toISOString(),
    version,
  };
}

/**
 * Validate that a file has proper metadata
 */
export function hasValidMetadata(obj: unknown): obj is { __metadata: GeneratedFileMetadata } {
  if (!obj || typeof obj !== 'object') return false;
  
  const metadata = (obj as any).__metadata;
  if (!metadata || typeof metadata !== 'object') return false;
  
  return (
    metadata[FILE_MARKER] === true &&
    typeof metadata.generator === 'string' &&
    typeof metadata.generatedAt === 'string' &&
    typeof metadata.version === 'string'
  );
}
