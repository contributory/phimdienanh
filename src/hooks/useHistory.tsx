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
const MAX = 30;

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
  remove: (slug: string, episodeSlug?: string) => void;
  clear: () => void;
  hasWatched: (slug: string, episodeSlug?: string) => boolean;
}

const Ctx = createContext<HistoryCtx>({
  entries: [],
  push: () => {},
  remove: () => {},
  clear: () => {},
  hasWatched: () => false,
});

/** Gộp lịch sử theo phim — giữ mục mới nhất cho từng bộ (đang xem dở). */
export function latestByMovie(entries: HistoryEntry[]): HistoryEntry[] {
  const seen = new Set<string>();
  return entries.filter((e) => {
    if (seen.has(e.slug)) return false;
    seen.add(e.slug);
    return true;
  });
}

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

  const remove = useCallback((slug: string, episodeSlug?: string) => {
    setEntries((prev) => {
      const next = prev.filter(
        (x) => !(x.slug === slug && (!episodeSlug || x.episodeSlug === episodeSlug)),
      );
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
    () => ({ entries, push, remove, clear, hasWatched }),
    [entries, push, remove, clear, hasWatched],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHistory() {
  return useContext(Ctx);
}
