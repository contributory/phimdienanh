"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { IcAlert, IcArrowR, IcChevronL, IcChevronR, IcRetry } from "./icons";

/* ── Scroll reveal ─────────────────────────────────────────────────────── */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (obs) => {
        if (obs[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/* ── Dải phim (film strip) trang trí ───────────────────────────────────── */
export function FilmStrip({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex items-center gap-[9px] overflow-hidden rounded-[4px] border border-ink-700/70 bg-ink-850 px-3 py-1.5 ${className}`}
    >
      {Array.from({ length: 48 }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2.5 shrink-0 rounded-[2px] ${i % 12 === 6 ? "bg-ember-500/70" : "bg-ink-950"}`}
        />
      ))}
    </div>
  );
}

/* ── Tiêu đề khu vực ───────────────────────────────────────────────────── */
export function SectionHead({
  title,
  to,
  accent = "gold",
}: {
  title: string;
  to?: string;
  accent?: "gold" | "ember";
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="font-display flex items-baseline gap-3 text-3xl tracking-wide text-fog-100 sm:text-4xl">
        <span
          className={`inline-block h-7 w-1.5 -skew-x-12 rounded-sm sm:h-8 ${accent === "gold" ? "bg-gold-500" : "bg-ember-500"}`}
        />
        {title}
      </h2>
      {to && (
        <Link
          to={to}
          className="group mb-1 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-fog-500 transition-colors hover:text-gold-400"
        >
          Xem tất cả
          <IcArrowR className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

/* ── Spinner ───────────────────────────────────────────────────────────── */
export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ── Trạng thái lỗi / rỗng ─────────────────────────────────────────────── */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-ember-500/25 bg-ink-900/70 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ember-500/40 bg-ember-500/10 text-ember-400">
        <IcAlert className="h-7 w-7" />
      </span>
      <div>
        <p className="font-display text-2xl tracking-wide text-fog-100">Không tải được dữ liệu</p>
        <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-fog-500">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-sm font-bold text-ink-950 transition hover:bg-gold-400 active:scale-95"
        >
          <IcRetry className="h-4 w-4" /> Thử lại
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-ink-700 bg-ink-900/60 px-6 py-16 text-center">
      <p className="font-display text-3xl tracking-wide text-fog-300">{title}</p>
      {note && <p className="max-w-md text-sm text-fog-500">{note}</p>}
    </div>
  );
}

/* ── Skeleton ──────────────────────────────────────────────────────────── */
export function PosterSkeleton() {
  return (
    <div>
      <div className="shimmer aspect-[2/3] w-full rounded-md" />
      <div className="shimmer mt-2 h-3.5 w-4/5 rounded" />
      <div className="shimmer mt-1.5 h-3 w-1/2 rounded" />
    </div>
  );
}

export function RowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-flow-col auto-cols-[46vw] gap-4 overflow-hidden sm:auto-cols-[200px]">
      {Array.from({ length: count }).map((_, i) => (
        <PosterSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col justify-end gap-3 px-4 pb-10 pt-40 sm:px-6">
      <div className="shimmer h-4 w-40 rounded" />
      <div className="shimmer h-14 w-3/4 max-w-xl rounded" />
      <div className="shimmer h-4 w-64 rounded" />
      <div className="shimmer h-16 w-full max-w-lg rounded" />
      <div className="mt-2 flex gap-3">
        <div className="shimmer h-11 w-36 rounded-md" />
        <div className="shimmer h-11 w-28 rounded-md" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <PosterSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Phân trang ────────────────────────────────────────────────────────── */
export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages: (number | "…")[] = [];
  const push = (p: number | "…") => pages[pages.length - 1] !== p && pages.push(p);
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) push(p);
    else push("…");
  }
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Phân trang">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="flex h-10 items-center gap-1 rounded-md border border-ink-700 bg-ink-900 px-3 text-sm font-semibold text-fog-300 transition enabled:hover:border-gold-500/50 enabled:hover:text-gold-400 disabled:opacity-35"
      >
        <IcChevronL className="h-4 w-4" /> Trước
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-fog-500">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`h-10 min-w-10 rounded-md px-3 font-display text-lg tracking-wide transition ${
              p === page
                ? "bg-gold-500 text-ink-950 shadow-[0_0_22px_rgba(245,179,1,0.35)]"
                : "border border-ink-700 bg-ink-900 text-fog-300 hover:border-gold-500/50 hover:text-gold-400"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-10 items-center gap-1 rounded-md border border-ink-700 bg-ink-900 px-3 text-sm font-semibold text-fog-300 transition enabled:hover:border-gold-500/50 enabled:hover:text-gold-400 disabled:opacity-35"
      >
        Sau <IcChevronR className="h-4 w-4" />
      </button>
    </nav>
  );
}
