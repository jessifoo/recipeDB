/**
 * Pagination Component - REUSABLE for ALL apps
 * Works with URL state and Zustand store
 */

'use client';

import { usePaginationUrl } from '../hooks/use-url-state';

export interface PaginationProps {
  total: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function Pagination({ total, onPageChange, onLimitChange }: PaginationProps) {
  const [{ page, limit }, setParams] = usePaginationUrl();

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const handlePageChange = (newPage: number) => {
    setParams({ page: newPage });
    onPageChange?.(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setParams({ page: 1, limit: newLimit });
    onLimitChange?.(newLimit);
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      {/* Results info */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrevPage}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNextPage}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
            <span className="font-medium">{total}</span> results
          </p>

          {/* Per page selector */}
          <select
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>

        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {/* Previous */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!hasPrevPage}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              ←
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 ${
                    page === pageNum
                      ? 'z-10 bg-blue-600 text-white'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!hasNextPage}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              →
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
