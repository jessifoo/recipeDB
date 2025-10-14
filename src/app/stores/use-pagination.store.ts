/**
 * Pagination Store - REUSABLE for ALL apps
 * Generic pagination state with URL sync
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationStore extends PaginationState {
  // Actions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTotal: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
  
  // Computed
  hasNextPage: () => boolean;
  hasPrevPage: () => boolean;
  getOffset: () => number;
}

const initialState: PaginationState = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

/**
 * Create pagination store - Use for any paginated list
 * @example
 * const useRecipePagination = createPaginationStore('recipes');
 */
export function createPaginationStore(name: string) {
  return create<PaginationStore>()(
    devtools(
      (set, get) => ({
        ...initialState,

        setPage: (page: number) => {
          set({ page }, false, 'setPage');
        },

        setLimit: (limit: number) => {
          set({ limit, page: 1 }, false, 'setLimit');
        },

        setTotal: (total: number) => {
          const { limit } = get();
          const totalPages = Math.ceil(total / limit);
          set({ total, totalPages }, false, 'setTotal');
        },

        nextPage: () => {
          const { page, totalPages } = get();
          if (page < totalPages) {
            set({ page: page + 1 }, false, 'nextPage');
          }
        },

        prevPage: () => {
          const { page } = get();
          if (page > 1) {
            set({ page: page - 1 }, false, 'prevPage');
          }
        },

        reset: () => {
          set(initialState, false, 'reset');
        },

        hasNextPage: () => {
          const { page, totalPages } = get();
          return page < totalPages;
        },

        hasPrevPage: () => {
          const { page } = get();
          return page > 1;
        },

        getOffset: () => {
          const { page, limit } = get();
          return (page - 1) * limit;
        },
      }),
      { name: `pagination-${name}` }
    )
  );
}

/**
 * Default pagination store
 */
export const usePaginationStore = createPaginationStore('default');
