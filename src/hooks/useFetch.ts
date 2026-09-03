import { useEffect, useRef, useState } from "react";
import { ApiError } from "../lib/api";

const cache = new Map<string, { at: number; data: unknown }>();
const TTL = 3 * 60 * 1000; // 3 phút — đủ để lướt qua lại mượt mà

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Hook fetch thuần client có cache RAM + trạng thái loading/error/retry.
 * `key` thay đổi thì fetch lại — thay cho useEffect deps kiểu Next client component.
 */
export function useFetch<T>(
  key: string | null,
  fetcher: () => Promise<T>,
): FetchState<T> {
  const cached = key ? cache.get(key) : undefined;
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: cached && Date.now() - cached.at < TTL ? (cached.data as T) : null,
    loading: !!key,
    error: null,
  });
  const [tick, setTick] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!key) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL) {
      setState({ data: hit.data as T, loading: false, error: null });
      return;
    }
    let active = true;
    setState({ data: (hit?.data as T) ?? null, loading: true, error: null });
    fetcherRef
      .current()
      .then((data) => {
        if (!active) return;
        cache.set(key, { at: Date.now(), data });
        setState({ data, loading: false, error: null });
      })
      .catch((e: unknown) => {
        if (!active) return;
        const msg =
          e instanceof ApiError
            ? e.message
            : e instanceof Error
              ? e.message
              : "Có lỗi không xác định khi tải dữ liệu.";
        setState({ data: (hit?.data as T) ?? null, loading: false, error: msg });
      });
    return () => {
      active = false;
    };
  }, [key, tick]);

  return { ...state, retry: () => setTick((t) => t + 1) };
}
