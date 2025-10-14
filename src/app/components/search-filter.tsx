/**
 * Search/Filter Component - REUSABLE for ALL apps
 * Debounced search with URL sync
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchUrl } from '../hooks/use-url-state';

export interface SearchFilterProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  debounce?: number;
}

export function SearchFilter({ 
  placeholder = 'Search...', 
  onSearch,
  debounce = 300,
}: SearchFilterProps) {
  const [searchUrl, setSearchUrl] = useSearchUrl();
  const [localValue, setLocalValue] = useState(searchUrl);

  // Sync URL to local on mount
  useEffect(() => {
    setLocalValue(searchUrl);
  }, [searchUrl]);

  // Debounced URL update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== searchUrl) {
        setSearchUrl(localValue);
        onSearch?.(localValue);
      }
    }, debounce);

    return () => clearTimeout(timer);
  }, [localValue, searchUrl, setSearchUrl, onSearch, debounce]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        placeholder={placeholder}
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            setSearchUrl('');
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
