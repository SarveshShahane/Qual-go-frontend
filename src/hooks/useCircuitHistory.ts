import { useState, useCallback, useRef } from 'react';
import type { Circuit } from '../types/circuit';

const MAX_HISTORY = 50;

export interface UseCircuitHistoryReturn {
  circuit: Circuit;
  setCircuit: (newCircuit: Circuit | ((prev: Circuit) => Circuit), recordHistory?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetHistory: (initialCircuit: Circuit) => void;
  clearHistory: (initialCircuit?: Circuit) => void;
}

export function useCircuitHistory(initialCircuit: Circuit): UseCircuitHistoryReturn {
  const [present, setPresent] = useState<Circuit>(initialCircuit);
  const pastRef = useRef<Circuit[]>([]);
  const futureRef = useRef<Circuit[]>([]);
  const [, setTick] = useState(0); // Force re-render for canUndo/canRedo state updates

  const setCircuit = useCallback(
    (newCircuit: Circuit | ((prev: Circuit) => Circuit), recordHistory: boolean = true) => {
      setPresent((current) => {
        const next = typeof newCircuit === 'function' ? newCircuit(current) : newCircuit;
        if (recordHistory) {
          pastRef.current = [...pastRef.current.slice(-MAX_HISTORY + 1), current];
          futureRef.current = [];
        }
        return next;
      });
      setTick((t) => t + 1);
    },
    []
  );

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const previous = pastRef.current[pastRef.current.length - 1];
    pastRef.current = pastRef.current.slice(0, -1);
    futureRef.current = [present, ...futureRef.current];
    setPresent(previous);
    setTick((t) => t + 1);
  }, [present]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current[0];
    futureRef.current = futureRef.current.slice(1);
    pastRef.current = [...pastRef.current, present];
    setPresent(next);
    setTick((t) => t + 1);
  }, [present]);

  const resetHistory = useCallback((circuit: Circuit) => {
    pastRef.current = [];
    futureRef.current = [];
    setPresent(circuit);
    setTick((t) => t + 1);
  }, []);

  const clearHistory = useCallback((circuit?: Circuit) => {
    pastRef.current = [];
    futureRef.current = [];
    if (circuit) {
      setPresent(circuit);
    }
    setTick((t) => t + 1);
  }, []);

  return {
    circuit: present,
    setCircuit,
    undo,
    redo,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    resetHistory,
    clearHistory,
  };
}
