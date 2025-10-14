/**
 * Global App Store - REUSABLE for ALL apps
 * Common UI state every app needs
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // User preferences
  locale: string;
  
  // Loading/Error (global)
  isLoading: boolean;
  error: string | null;
}

export interface AppStore extends AppState {
  // UI Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: AppState['theme']) => void;
  
  // Preferences
  setLocale: (locale: string) => void;
  
  // Loading/Error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Global app store - Persisted to localStorage
 */
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        sidebarOpen: true,
        theme: 'system',
        locale: 'en',
        isLoading: false,
        error: null,

        // UI Actions
        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar');
        },

        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open }, false, 'setSidebarOpen');
        },

        setTheme: (theme) => {
          set({ theme }, false, 'setTheme');
        },

        // Preferences
        setLocale: (locale) => {
          set({ locale }, false, 'setLocale');
        },

        // Loading/Error
        setLoading: (loading) => {
          set({ isLoading: loading }, false, 'setLoading');
        },

        setError: (error) => {
          set({ error }, false, 'setError');
        },

        clearError: () => {
          set({ error: null }, false, 'clearError');
        },
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          theme: state.theme,
          locale: state.locale,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'app-store' }
  )
);
