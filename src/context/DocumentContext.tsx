import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from 'react';
import type { DocumentState, DocumentAction, RackDefinition } from '../types/rack';
import { documentReducer, initialState } from './documentReducer';

const STORAGE_KEY = 'av-rack-layout';

interface DocumentContextValue {
  state: DocumentState;
  dispatch: React.Dispatch<DocumentAction>;
  getOccupiedRus: (rack: RackDefinition) => Set<number>;
}

const DocumentContext = createContext<DocumentContextValue | null>(null);

function loadFromStorage(): DocumentState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as DocumentState;
  } catch {
    // ignore
  }
  return initialState;
}

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(documentReducer, undefined, loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const getOccupiedRus = useMemo(
    () => (rack: RackDefinition): Set<number> => {
      const set = new Set<number>();
      for (const p of rack.placed) {
        const gear = state.gear[p.gearId];
        if (!gear) continue;
        for (let i = 0; i < gear.ruSize; i++) {
          set.add(p.startRu + i);
        }
      }
      return set;
    },
    [state.gear]
  );

  return (
    <DocumentContext.Provider value={{ state, dispatch, getOccupiedRus }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocument() {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocument must be used within DocumentProvider');
  return ctx;
}
