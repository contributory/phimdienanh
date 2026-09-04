"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../lib/types";
import { imgUrl, stripHtml } from "../lib/utils";
import { IcInfo, IcPlay, IcStar } from "./icons";
import { HeroSkeleton } from "./ui";

const ROTATE_MS = 6500;

/** Sân khấu spotlight: chiếu luân phiên những phim vừa cập nhật */
export default function Hero({ items, loading }: { items: Movie[]; loading: boolean }) {
  const featured = useMemo(
    () =>
      items
        .filter((m) => m.poster_url || m.thumb_url)
        .slice(0, 6),
    [items],
  );
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || featured.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % featured.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, featured.length]);

  if (loading) return <HeroSkeleton />;
  if (featured.length === 0) return null;
  const m = featured[idx];
  const backdrop = imgUrl(m.poster_url || m.thumb_url);

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Phim nổi bật"
    >
      {/* backdrop crossfade */}
      <div className="absolute inset-0">
        {featured.map((f, i) => (
          <img
            key={f.slug}
            src={imgUrl(f.poster_url || f.thumb_url)}
            alt=""
            referrerPolicy="no-referrer"
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/78 to-ink-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" />
      </div>

      <div className="relative mx-auto flex min-h-[540px] w-full max-w-7xl flex-col justify-end px-4 pb-12 pt-36 sm:min-h-[600px] sm:px-6">
        <div key={m.slug} className="hero-in max-w-2xl">
          <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.28em] text-gold-400">
            <IcStar className="h-3.5 w-3.5" />
            Tâm điểm hôm nay
          </p>
          <h1 className="font-display text-5xl leading-[0.95] tracking-wide text-fog-100 drop-shadow-[0_6px_30px_rgba(0,0,0,0.7)] sm:text-7xl">
            {m.name}
          </h1>
          {m.origin_name && m.origin_name !== m.name && (
            <p className="mt-2 font-display text-xl tracking-widest text-fog-300">
              {m.origin_name}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold">
            {m.quality && (
              <span className="rounded bg-gold-500 px-2 py-1 text-ink-950">{m.quality}</span>
            )}
            {m.lang && (
              <span className="rounded bg-ember-600 px-2 py-1 text-fog-100">{m.lang}</span>
            )}
            {m.year && (
              <span className="rounded border border-fog-500/40 px-2 py-1 text-fog-300">{m.year}</span>
            )}
            {m.episode_time && (
              <span className="rounded border border-fog-500/40 px-2 py-1 text-fog-300">
                {m.episode_time}
              </span>
            )}
            {m.type === "series" && (
              <span className="rounded border border-fog-500/40 px-2 py-1 text-fog-300">
                {m.episode_current || "Nhiều tập"}
                {m.episode_total ? ` / ${m.episode_total} tập` : ""}
              </span>
            )}
          </div>

          <p className="clamp-3 mt-4 max-w-xl text-sm leading-relaxed text-fog-300 sm:text-[15px]">
            {stripHtml(m.content) || "Chưa có mô tả cho bộ phim này."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to={`/phim/${m.slug}`}
              className="group inline-flex items-center gap-2.5 rounded-md bg-gold-500 px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-ink-950 shadow-[0_0_34px_rgba(245,179,1,0.35)] transition hover:bg-gold-400 active:scale-95"
            >
              <IcPlay className="h-4 w-4 transition-transform group-hover:scale-125" />
              Xem ngay
            </Link>
            <Link
              to={`/phim/${m.slug}`}
              className="inline-flex items-center gap-2 rounded-md border border-fog-500/40 bg-ink-950/40 px-5 py-3 text-sm font-bold text-fog-100 backdrop-blur-sm transition hover:border-fog-100/70 hover:bg-ink-950/70 active:scale-95"
            >
              <IcInfo className="h-4 w-4" /> Chi tiết
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {m.category?.slice(0, 4).map((c) => (
              <Link
                key={c.slug}
                to={`/the-loai/${c.slug}`}
                className="rounded-full border border-ink-600 bg-ink-900/60 px-3 py-1 text-[11px] font-semibold text-fog-300 transition hover:border-gold-500/60 hover:text-gold-300"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* chỉ mục + progress */}
        <div className="hero-progress mt-7 flex max-w-sm items-center gap-2">
          {featured.map((f, i) => (
            <button
              key={f.slug}
              onClick={() => setIdx(i)}
              aria-label={`Chuyển tới ${f.name}`}
              className={`group h-4 flex-1 overflow-hidden rounded-full py-1.5 ${i === idx ? "" : "cursor-pointer"}`}
            >
              <span
                className={`block h-1 rounded-full ${
                  i === idx ? "bg-gold-500" : "bg-ink-600 transition group-hover:bg-fog-500"
                }`}
                style={i === idx ? { animationDuration: `${ROTATE_MS}ms` } : { width: "100%", animation: "none" }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Dòng ticker chạy ngang tên các phim mới */
export function Ticker({ items }: { items: Movie[] }) {
  if (items.length === 0) return null;
  const row = items.slice(0, 18);
  return (
    <div className="marquee overflow-hidden border-y border-ink-700/70 bg-ink-900/80 py-2.5">
      <div className="marquee-track">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
            {row.map((m) => (
              <a
                key={`${dup}-${m.slug}`}
                href={`#/phim/${m.slug}`}
                className="group flex items-center gap-3 px-4 text-sm font-semibold text-fog-300 transition-colors hover:text-gold-400"
              >
                <IcStar className="h-2.5 w-2.5 text-ember-500" />
                <span className="whitespace-nowrap">
                  {m.name}
                  <span className="ml-2 font-display tracking-widest text-fog-500 group-hover:text-gold-500">
                    {m.episode_current || m.quality || ""}
                  </span>
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
