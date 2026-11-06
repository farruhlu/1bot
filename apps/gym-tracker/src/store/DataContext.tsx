import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AppData, SetEntry } from '../lib/types';
import {
  addSet,
  deleteSet,
  loadData,
  resetToSeed,
  saveData,
  updateSet,
} from '../lib/storage';

type DataContextValue = {
  data: AppData | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logSet: (input: {
    exerciseName: string;
    weightKg: number;
    reps: number;
    sets: number;
    notes: string;
    source: SetEntry['source'];
    rawTranscript?: string;
  }) => Promise<void>;
  editSet: (id: string, patch: Partial<SetEntry>) => Promise<void>;
  removeSet: (id: string) => Promise<void>;
  resetDemo: () => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const next = await loadData();
    setData(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const persist = useCallback(async (next: AppData) => {
    setData(next);
    await saveData(next);
  }, []);

  const logSet = useCallback(
    async (input: {
      exerciseName: string;
      weightKg: number;
      reps: number;
      sets: number;
      notes: string;
      source: SetEntry['source'];
      rawTranscript?: string;
    }) => {
      if (!data) return;
      await persist(addSet(data, input));
    },
    [data, persist],
  );

  const editSet = useCallback(
    async (id: string, patch: Partial<SetEntry>) => {
      if (!data) return;
      await persist(updateSet(data, id, patch));
    },
    [data, persist],
  );

  const removeSet = useCallback(
    async (id: string) => {
      if (!data) return;
      await persist(deleteSet(data, id));
    },
    [data, persist],
  );

  const resetDemo = useCallback(async () => {
    const next = await resetToSeed();
    setData(next);
  }, []);

  const value = useMemo(
    () => ({
      data,
      loading,
      refresh,
      logSet,
      editSet,
      removeSet,
      resetDemo,
    }),
    [data, loading, refresh, logSet, editSet, removeSet, resetDemo],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData вне DataProvider');
  return ctx;
}
