"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { HistoryEntry } from "../lib/types";

const STORAGE_KEY = "rapkk.history.v1";
const MAX = 14;

function read(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* bộ nhớ đầy hoặc bị chặn — bỏ qua */
  }
}

interface HistoryCtx {
  entries: HistoryEntry[];
  push: (e: Omit<HistoryEntry, "at">) => void;
  clear: () => void;
  hasWatched: (slug: string, episodeSlug?: string) => boolean;
}

const Ctx = createContext<HistoryCtx>({
  entries: [],
  push: () => {},
  clear: () => {},
  hasWatched: () => false,
});

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>(read);

  const push = useCallback((e: Omit<HistoryEntry, "at">) => {
    setEntries((prev) => {
      const next = [
        { ...e, at: Date.now() },
        ...prev.filter(
          (x) => !(x.slug === e.slug && x.episodeSlug === e.episodeSlug),
        ),
      ].slice(0, MAX);
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setEntries([]);
    write([]);
  }, []);

  const hasWatched = useCallback(
    (slug: string, episodeSlug?: string) =>
      entries.some((x) => x.slug === slug && (!episodeSlug || x.episodeSlug === episodeSlug)),
    [entries],
  );

  const value = useMemo(
    () => ({ entries, push, clear, hasWatched }),
    [entries, push, clear, hasWatched],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHistory() {
  return useContext(Ctx);
}
