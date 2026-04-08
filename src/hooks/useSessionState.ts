import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for session-only state management.
 * State is kept in memory only and cleared on unmount or page refresh.
 * No localStorage or sessionStorage is used.
 */
export function useSessionState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);

  // Clear state on unmount
  useEffect(() => {
    return () => {
      setState(initialState);
    };
  }, [initialState]);

  // Clear state on page hide (refresh/close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      setState(initialState);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [initialState]);

  const clearState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return [state, setState, clearState] as const;
}
