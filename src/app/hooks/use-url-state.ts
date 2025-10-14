/**
 * URL State Management - REUSABLE for ALL apps
 * Type-safe URL query params with nuqs
 */

import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState, useQueryStates } from 'nuqs';

/**
 * Pagination URL state
 */
export function usePaginationUrl() {
  return useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  });
}

/**
 * Search/Filter URL state
 */
export function useSearchUrl() {
  return useQueryState('search', parseAsString.withDefault(''));
}

/**
 * Sort URL state
 */
export function useSortUrl<T extends string>(validValues: readonly T[]) {
  return useQueryStates({
    sortBy: parseAsStringEnum(validValues).withDefault(validValues[0] as T),
    sortOrder: parseAsStringEnum(['asc', 'desc'] as const).withDefault('desc'),
  });
}

/**
 * Tab URL state
 */
export function useTabUrl<T extends string>(tabs: readonly T[], defaultTab: T) {
  return useQueryState('tab', parseAsStringEnum(tabs).withDefault(defaultTab));
}

/**
 * Modal/Dialog URL state
 */
export function useDialogUrl(name: string) {
  const [open, setOpen] = useQueryState(name, parseAsString);
  
  return {
    isOpen: open !== null,
    open: (id?: string) => setOpen(id || 'true'),
    close: () => setOpen(null),
    id: open === 'true' ? undefined : open,
  };
}

/**
 * Generic filter URL state - Extend per app
 * @example
 * const [filters, setFilters] = useFilterUrl({
 *   category: parseAsString,
 *   status: parseAsStringEnum(['active', 'inactive']),
 *   minPrice: parseAsInteger,
 * });
 */
export function useFilterUrl<T extends Record<string, any>>(schema: T) {
  return useQueryStates(schema);
}
