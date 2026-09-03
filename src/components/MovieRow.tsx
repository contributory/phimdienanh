"use client";

import { useRef } from "react";
import type { Movie } from "../lib/types";
import MovieCard from "./MovieCard";
import { IcChevronL, IcChevronR } from "./icons";
import { Reveal, RowSkeleton, SectionHead } from "./ui";

export default function MovieRow({
  title,
  to,
  items,
  loading,
  error,
  accent = "gold",
}: {
  title: string;
  to: string;
  items: Movie[];
  loading: boolean;
  error?: string | null;
  accent?: "gold" | "ember";
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <Reveal as="section" className="relative">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="font-display flex items-baseline gap-3 text-3xl tracking-wide text-fog-100 sm:text-4xl">
          <span
            className={`inline-block h-7 w-1.5 -skew-x-12 rounded-sm sm:h-8 ${accent === "gold" ? "bg-gold-500" : "bg-ember-500"}`}
          />
          {title}
        </h2>
        <div className="mb-1 flex items-center gap-2">
          <div className="hidden gap-1.5 sm:flex">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Cuộn trái"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-700 bg-ink-900 text-fog-300 transition hover:border-gold-500/60 hover:text-gold-400 active:scale-90"
            >
              <IcChevronL className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Cuộn phải"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-700 bg-ink-900 text-fog-300 transition hover:border-gold-500/60 hover:text-gold-400 active:scale-90"
            >
              <IcChevronR className="h-4 w-4" />
            </button>
          </div>
          <a
            href={`#${to}`}
            className="text-sm font-semibold text-fog-500 transition-colors hover:text-gold-400"
          >
            Xem tất cả →
          </a>
        </div>
      </div>

      {loading ? (
        <RowSkeleton />
      ) : error ? (
        <p className="rounded-md border border-ember-500/25 bg-ink-900/70 px-4 py-6 text-sm text-ember-400">
          Không tải được "{title}": {error}
        </p>
      ) : (
        <div
          ref={scroller}
          className="row-scroll -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
        >
          {items.map((m) => (
            <div key={m.slug} className="w-[42vw] shrink-0 snap-start sm:w-[176px]">
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
      )}
    </Reveal>
  );
}

export { SectionHead };
