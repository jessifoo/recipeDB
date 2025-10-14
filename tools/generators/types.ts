/**
 * Generator types
 */

export interface FeatureConfig {
  name: string;
  fields: FieldConfig[];
  operations: Operation[];
}

export interface FieldConfig {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url';
  required: boolean;
}

export type Operation = 'create' | 'get' | 'list' | 'update' | 'delete';
